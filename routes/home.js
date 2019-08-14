const express = require('express')
const router = express.Router()
var Sequelize = require('sequelize');
// set up authenticated middleware
const { authenticated } = require('../config/auth')

// set up models
const db = require('../models')
const User = db.User
const Record = db.Record

// sequelize operators
const Op = Sequelize.Op;

// home page

router.get('/', authenticated, (req, res) => {
  // create filter array
  const months_array = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
  const category_array = ['食', '衣', '住', '行', '其他', '所有']

  //create variable to display totalAmout in view
  let totalAmount = 0

  // if months isn't seleted,set default value to current month
  req.query.months = req.query.months || new Date().getMonth() + 1
  // if category isn't seleted,set default value to all categories
  req.query.category = req.query.category || ''

  // create variables 
  let months = req.query.months
  let category = req.query.category

  // create font-awesome image object
  const category_image = {
    '食': '<i class="fas fa-utensils"></i>',
    '衣': '<i class="fas fa-tshirt"></i>',
    '住': '<i class="fas fa-home"></i>',
    '行': '<i class="fas fa-bus"></i>',
    '其他': '<i class="fas fa-shopping-bag"></i>'
  }
  // setting filter pattern
  let filter = {
    UserId: req.user.id
  }
  if (req.query.category === '' || req.query.category === '所有') {
    filter.date = {
      [Op.between]: [new Date(2019, req.query.months - 1, 1), new Date(2019, req.query.months, 0)]
      // "$gte": new Date(2019, req.query.months - 1, 1), "$lt": new Date(2019, req.query.months, 0) 
    }
  } else {
    filter.date = {
      [Op.between]: [new Date(2019, req.query.months - 1, 1), new Date(2019, req.query.months, 0)]
      // "$gte": new Date(2019, req.query.months - 1, 1), "$lt": new Date(2019, req.query.months, 0)
    }
    filter.category = category
  }

  User.findByPk(req.user.id)
    .then((user) => {
      if (!user) throw new Error("user not found")
      return Record.findAll({
        where: filter
      })
    })
    .then((records) => {
      records.forEach(item => {
        totalAmount += Number(item.amount)
      })
      return res.render('index', { records, months_array, category_array, totalAmount, months, category, category_image })
    })
    .catch((error) => { return res.status(422).json(error) })
})


module.exports = router