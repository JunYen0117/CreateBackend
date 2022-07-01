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

router.post('/', registerRules, async (req, res, next) => {
  console.log('register body:', req.body); //req.body 前端送過來的資料

  // 拿到驗證結果
  const validateResults = validationResult(req);
  console.log('validateResults:',validateResults);
  if (!validateResults.isEmpty()) {
    // 不是 empty --> 表示有驗證失敗的訊息
    let error = validateResults.array();
    return res.status(400).json({ code: 3010, error: error });
  }

  // // 確認 email 有沒有註冊過
  const [members] = await pool.execute('SELECT * FROM customer WHERE account = ?', [req.body.account]);
  console.log('members',members)
  if (members.length !== 0) {
    // 這個 email 有註冊過
    return res.status(400).json({ code: 3011, error: '這個 email 已經註冊過' });
  }

  // 密碼雜湊 hash
  const hashPassword = await bcrypt.hash(req.body.password, 10);



  // save to db // [ [{email: xx , password: xxx}],[fdfafa] ]  [ [ {第一筆資料},{第二筆資料} ] ,[亂碼] ]
  // // result = [{email: xx , password: xxx}]
   const date=new Date();
   let [result] = await pool.execute('INSERT INTO customer (member_name, account, password, gender, age, phone, address, valid, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [req.body.member_name, req.body.account, hashPassword, req.body.gender, req.body.age, req.body.phone, req.body.address, 1, date]);
  // console.log('insert result:', result);

  let sessionData = { 
    member_num: '', 
    member_name: req.body.member_name, 
    account: req.body.account, 
    password: hashPassword,
    gender: req.body.gender, 
    age: req.body.age, 
    phone: req.body.phone, 
    address: req.body.address, 
    create_time: date, 
    valid: 1 };
  req.session.customer = sessionData;
  // response
  res.json({ code: 0, result: '東西有從後台打回前台', sessionData: sessionData });
});


module.exports = router;