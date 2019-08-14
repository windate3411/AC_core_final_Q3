const express = require('express')
const router = express.Router()
const passport = require('passport')
// fb login
router.get(
  '/facebook',
  passport.authenticate('facebook', { scope: ['email', 'public_profile'] })
)
router.get(
  '/facebook/callback',
  passport.authenticate('facebook', {
    successRedirect: '/',
    failureRedirect: '/user/login',
    failureFlash: true
  }))

module.exports = router