const express = require('express')
const router = express.Router()
const { authenticated } = require('../config/auth')
// importing models
const db = require('../models')
const Record = db.Record
const User = db.User
// importing utils
const { currentTime } = require('../utils/getCurrentTime')

// importing express-validator & check condition arrays
const { check, validationResult } = require('express-validator');
const { newRecordCheck } = require('../utils/backend-validation');



// add new record
router.get('/new', authenticated, (req, res) => {
  //create a function to get the current time to put in view
  const result = `${currentTime.year}-${currentTime.month}-${currentTime.date}`
  res.render('new', { result })
})

router.post('/new', authenticated, (req, res) => {
  Record.create({
    name: req.body.name,
    amount: req.body.amount,
    date: req.body.date,
    category: req.body.category,
    UserId: req.user.id
  })
    .then((records) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})

//edit page
router.get('/edit/:id', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findOne({
        where: {
          Id: req.params.id,
          UserId: req.user.id,
        }
      })
    })
    .then((record) => {
      const record_date = JSON.stringify(record.date).slice(1, 11)
      return res.render('edit', { record, record_date })
    })
})

router.put('/edit/:id', authenticated, newRecordCheck, (req, res) => {
  Record.findOne({
    where: {
      Id: req.params.id,
      UserId: req.user.id,
    }
  })
    .then((record) => {
      record.name = req.body.name
      record.amount = req.body.amount
      record.category = req.body.category
      record.date = req.body.date
      return record.save()
    })
    .then((record) => { return res.redirect(`/`) })
    .catch((record) => { return res.status(422).json(error) })

})

// remove records

router.delete('/:id', authenticated, (req, res) => {
  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")

      return Record.destroy({
        where: {
          UserId: req.user.id,
          Id: req.params.id
        }
      })
    })
    .then((record) => { return res.redirect('/') })
    .catch((error) => { return res.status(422).json(error) })
})

module.exports = router