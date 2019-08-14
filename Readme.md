# 家庭記帳本 Household Expense tracker-sequelize

基本上是利用https://github.com/windate3411/expense-tracker做修改完成的專案，基本功能完全一致。

## 專案預覽 Project preview

![image](https://github.com/windate3411/AC_core_final_Q3/blob/master/result1.PNG)
![image](https://github.com/windate3411/AC_core_final_Q3/blob/master/result2.PNG)
![image](https://github.com/windate3411/AC_core_final_Q3/blob/master/result3.PNG)
![image](https://github.com/windate3411/AC_core_final_Q3/blob/master/result4.PNG)

## 專案需求 Prerequisites

為了確保程式順利運作，你需要安裝以下程式 You need to install following software 

+ [Node.js v10.16.0(LTS)](https://nodejs.org/en/)

## 如何開始 Getting Started
```
# 下載專案 Clone the repository:
git clone https://github.com/windate3411/AC_core_final_Q3.git

# 安裝NPM套件 Install NPM dependencies
npm install

# 在根目錄下新增.env檔案並有著以下的格式 Create .env file which contains following info under project directory 

FACEBOOK_ID=XXXXXXXX
FACEBOOK_SECRET=XXXXXXXX
FACEBOOK_CALLBACK=http://example.com/auth/facebook/callback

# 執行程式 Start the app
npm run dev

順利執行時會在終端機看到
you are now listening at port 3000
便可前往http://localhost:3000使用
```

## 給助教的話

主要修改部分有以下

+ 連接資料庫的做法
```
const db = require('../models')
const User = db.User
const Record = db.Record
```
+ query的程式碼
```
// sequelize operators
const Op = Sequelize.Op;

// setting filter pattern
let filter = {
  UserId: req.user.id
}
if (req.query.category === '' || req.query.category === '所有') {
  filter.date = {
    [Op.between]: [new Date(2019, req.query.months - 1, 1), new Date(2019, req.query.months, 0)]
  }
} else {
  filter.date = {
    [Op.between]: [new Date(2019, req.query.months - 1, 1), new Date(2019, req.query.months, 0)]
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
```
## 作者 Author

* **Danny Wang** 



 
 
 
 
 