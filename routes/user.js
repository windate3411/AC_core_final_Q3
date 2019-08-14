const express = require('express')
const router = express.Router()
const passport = require('passport')

// set up models
const db = require('../models')
const User = db.User

// importing bcrypt for password hash
const bcrypt = require('bcryptjs')

// set up authenticated middleware
const { authenticated } = require('../config/auth')

// importing express-validator for back-end validation
const { check, validationResult } = require('express-validator')
const { newUserCheck } = require('../utils/backend-validation')

router.get('/', (req, res) => {
  res.send('this is the user page')
})

//login
router.get('/login', (req, res) => {
  res.render('login', { errors: [{ message: req.flash('error') }] })
})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
  })(req, res, next)
})

//register
router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body
  // if validation fails,redirect
  const err_msg = validationResult(req)
  if (!err_msg.isEmpty()) {
    return res.render('register', { err_msg: err_msg.array() })
  }
  let errors = []
  if (!name || !email || !password || !password2) {
    errors.push({ message: '所有欄位都是必填!' })
  }
  if (password !== password2) {
    errors.push({ message: '兩次密碼輸入不一致!' })
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2
    })
  } else {
    User.findOne({ where: { email: email } }).then(user => {
      if (user) {
        console.log('User already exists')
        errors.push({ message: '此信箱已被註冊過!' })
        res.render('register', {
          name,
          email,
          password,
          password2,
          errors
        })
      } else {
        const newUser = new User({ // 如果 email 不存在就直接新增
          name,
          email,
          password,
        })

        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) console.log(err);
            newUser.password = hash
            newUser
              .save()
              .then(user => {
                res.redirect('/')
              })
              .catch(err => {
                console.log(err);
              })
          }))
      }
    })
  }

})

// logout
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success_msg', '你已經成功登出')
  res.redirect('/user/login')
})

module.exports = router