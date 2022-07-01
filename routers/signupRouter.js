const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const pool = require('../utils/database.js');

const path = require('path');

// 認證規則
const registerRules = [
  body('account').isEmail().withMessage('Email 欄位請填寫正確格式'),
  body('password').isLength({ min: 3 }).withMessage('密碼長度不足'),
  body('re_password')
    .custom((value, { req }) => {
      return value === req.body.password;
    })
    .withMessage('密碼驗證不一致'),
];


// 1. 設定驗證規則 body()
// 2. 把 前端的req 拿來驗證 validationResult(req) => 空的 or 有資料(驗證失敗)
// 3. 驗證失敗 把 錯誤訊息 取出來 回給 前端 res.json(error)


router.post('/', registerRules, async (req, res, next) => {
  console.log('register body:', req.body); //req.body 前端送過來的資料

  // 拿到驗證結果
  const validateResults = validationResult(req);
  console.log('validateResults', validateResults);
  if (!validateResults.isEmpty()) {
    // 不是 empty --> 表示有驗證失敗的訊息
    let error = validateResults.array();
    return res.status(400).json({ code: 3010, error: error });
  }

  // // 確認 email 有沒有註冊過
  // let [members] = await pool.execute('SELECT id, email FROM members WHERE email = ?', [req.body.email]);
  // if (members.length !== 0) {
  //   // 這個 email 有註冊過
  //   return res.status(400).json({ code: 3002, error: '這個 email 已經註冊過' });
  //   // 盡可能讓後端回覆的格式是一致的，如果無法完全一致，那至少要讓前端有判斷的依據。
  //   // 做專案的時候，在專案開始前，可以先討論好要回覆的錯誤格式與代碼。
  // }

  // // 密碼雜湊 hash
  // let hashPassword = await bcrypt.hash(req.body.password, 10);



  // // save to db // [ [{email: xx , password: xxx}],[fdfafa] ]  [ [ {第一筆資料},{第二筆資料} ] ,[亂碼] ]
  // // result = [{email: xx , password: xxx}]
  // let [result] = await pool.execute('INSERT INTO members (email, password, name, photo) VALUES (?, ?, ?, ?)', [req.body.email, hashPassword, req.body.name, photo]);
  // console.log('insert result:', result);

  // response
  res.json({ code: 0, result: 'OK' });
});


module.exports = router;