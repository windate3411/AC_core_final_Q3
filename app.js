const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const port = process.env.PORT || 3000
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

// set up view engine
app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  helpers: {
    addUp: function (value) {
      return value + 5
    },
    get_date: function (date) {
      const record_date = JSON.stringify(date).slice(1, 11)
      return record_date
    },
    get_image: function (category_image, category) {
      return category_image[category]
    },
    if_selected: function (category_value, category) {
      return category_value === category ? 'selected' : ''
    }
  }
}))
app.set('view engine', 'handlebars')

// 判別開發環境
if (process.env.NODE_ENV !== 'production') {
  // 如果不是 production 模式
  require('dotenv').config()
  // 使用 dotenv 讀取 .env 檔案
}

// set up bodyParser
app.use(bodyParser.urlencoded({ extended: true }))

// set up static files
app.use(express.static('public'))

// set up method override
const flash = require('connect-flash')
app.use(methodOverride('_method'))

// using connect-flash
app.use(flash())

// set up models
const db = require('./models')
const User = require('./models/user')
const Record = require('./models/record')

// set up session and passport
const session = require('express-session')
const passport = require('passport')

// session setting
app.use(session({
  secret: 'the secret key',
  resave: 'flase',
  saveUninitialized: 'false'
}))

//使用passport
app.use(passport.initialize())
app.use(passport.session())
require('./config/passport')(passport)
app.use((req, res, next) => {
  res.locals.user = req.user
  res.locals.userName = 'Danny'
  res.locals.success_msg = req.flash('success_msg')
  res.locals.warning_msg = req.flash('warning_msg')
  res.locals.isAuthenticated = req.isAuthenticated
  next()
})


// set up routes
app.use('/', require('./routes/home'))
app.use('/user', require('./routes/user'))
app.use('/record', require('./routes/record'))
app.use('/auth', require('./routes/auth'))

// set up sever
app.listen(port, () => {
  console.log(`you are now listening at port ${port}`);
})