const express = require('express');
const router = express.Router();
// 跟資料庫連線
const pool = require('../utils/database.js');
// 驗證資料使用
const { body, validationResult } = require('express-validator');
// 密碼雜湊
const bcrypt = require('bcrypt');

// 認證規則
const registerRules = [
  body('account').isEmail().withMessage('Email 欄位請填寫正確格式'),
  body('password').isLength({ min: 3 }).withMessage('密碼長度至少為3'),
  body('re_password')
    .custom((value, { req }) => {
      // 驗證規則
      return value === req.body.password;
    })
    .withMessage('密碼驗證不一致'),
];

// http://localhost:3003/api/auth/signup
router.post('/signup', registerRules, async (req, res, next) => {
  console.log('signup body:', req.body); //req.body 前端送過來的 form 表單的資料

  // 拿到驗證結果 -> 驗證資料
  const validateResults = validationResult(req);
  // 如果 驗證成功 validateResults 會是空的
  // 如果 驗證失敗 validateResults 會是驗證失敗的訊息
  console.log('validateResults:', validateResults);

  // 表單資料 驗證失敗 的情況
  if (!validateResults.isEmpty()) {
    // 不是 empty --> 表示有驗證失敗的訊息
    let error = validateResults.array();
    // 回傳 status 400 和 {code: 3001, error: 錯誤訊息} 給 client
    return res.status(400).json({ code: 3010, error: error });
  }

  // 確認 email 有沒有註冊過
  const [members] = await pool.execute('SELECT * FROM customer WHERE account = ?', [req.body.account]);
  console.log('members', members);
  if (members.length !== 0) {
    // 這個 email 有註冊過
    return res.status(400).json({ code: 3011, error: '這個 email 已經註冊過' });
  }

  // 密碼雜湊 hash ; bcrypt (長度: 60)
  const hashPassword = await bcrypt.hash(req.body.password, 10);
  console.log('hashPassword: ', hashPassword);

  // save to db // [ [{email: xx , password: xxx}],[fdfafa] ]  [ [ {第一筆資料},{第二筆資料} ] ,[亂碼] ]
  // // result = [{email: xx , password: xxx}]
  const date = new Date();
  let [result] = await pool.execute('INSERT INTO customer (member_name, account, password, gender, age, phone, address, valid, create_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)', [
    req.body.member_name,
    req.body.account,
    hashPassword,
    req.body.gender,
    req.body.age,
    req.body.phone,
    req.body.address,
    1,
    date,
  ]);
  // console.log('insert result:', result);

  let signupData = {
    member_num: '',
    member_name: req.body.member_name,
    account: req.body.account,
    password: hashPassword,
    gender: req.body.gender,
    age: req.body.age,
    phone: req.body.phone,
    address: req.body.address,
    create_time: date,
    valid: 1,
  };

  // 驗證成功 response 給前端
  res.json({ code: 0, result: '註冊成功', signupData: signupData });
});

// -------------------------------------------------------------------------------------

// http://localhost:3003/api/auth/login
router.post('/login', async (req, res, next) => {
  // 確認資料有收到
  // console.log('req.body', req.body);

  // 確認 資料庫 有沒有這個帳號 -> 用 WHERE 篩選 account
  const [customers] = await pool.execute('SELECT * FROM customer WHERE account = ?', [req.body.account]);

  if (customers.length === 0) {
    return res.status(400).json({ code: 3003, error: '帳號或密碼錯誤' });
  }

  const customer = customers[0];
  // console.log('customer', customer);

  // 如果資料庫存在會員帳號，則確認密碼是否正確
  // 進行比對 -> bcrypt.compare( 使用者輸入的密碼 , 資料庫取出的密碼 )
  // 比對成功 -> 回傳 true ; 比對失敗 -> 回傳 false
  const passwordCompareResult = await bcrypt.compare(req.body.password, customer.password);
  if (passwordCompareResult === false) {
    // 如果密碼不符合，回覆登入錯誤
    return res.status(400).json({ code: 3004, error: '帳號或密碼錯誤' });
  }
  // console.log('passwordCompareResult',passwordCompareResult);

  // 密碼符合，開始寫 session
  // 把 會員資料 寫入 存入變數，方便重複使用
  const returnCustomer = { id: customer.id, account: customer.account };
  // 把 會員資料 寫入 session (存在後台)
  req.session.customer = returnCustomer;
  // 回應給前端
  res.json({ code: 0, message: '登入成功', member: returnCustomer });
});

// -------------------------------------------------------------------------------------

// 進入 http://localhost:3003/api/auth/logout 這個網址，前端就會登出
router.get('/logout', (req, res, next) => {
  // 因為我們會依靠判斷 req.session.customer 有沒有資料來當作有沒有登入
  // 所以當我們把 req.session.customer 設定成 null，那就登出了
  req.session.customer = null;
  // res.sendStatus(202) 等於 res.status(202).send('OK')
  return res.json('登出成功');
});

module.exports = router;
