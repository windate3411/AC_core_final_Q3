const { check } = require('express-validator');

module.exports = {
  newRecordCheck: [
    check('name')
      .not().isEmpty()
      .withMessage('支出項目是必填項目喔!'),
    check('amount')
      .isInt({ gt: 0 })
      .withMessage('金額必須是大於零的整數喔!')
      .not().isEmpty()
      .withMessage('金額是必填項目喔!'),
    check('category')
      .not().isEmpty()
      .withMessage('類別是必選項目喔!'),
    check('date')
      .not().isEmpty()
      .withMessage('日期是必選項目喔!')
      .isISO8601()
      .withMessage('請填入標準的日期格式')],
  newUserCheck: [
    check('name')
      .not().isEmpty()
      .withMessage('使用者名稱是必填項目喔!'),
    check('email')
      .not().isEmpty()
      .withMessage('使用者信箱是必填項目喔!')
      .isEmail()
      .withMessage('請輸入正確的Email格式'),
    check('password')
      .not().isEmpty()
      .withMessage('使用者密碼是必填項目喔!')
      .isLength({ min: 8 })
      .withMessage("使用者密碼必須至少8個字元!")
  ]
}