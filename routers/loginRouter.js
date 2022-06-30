const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const pool = require('../utils/database.js');

const path = require('path');
const { count } = require('console');


router.post('/', async (req, res, next) => {
    console.log(req.body);

    let [customers] = await pool.execute('SELECT id, account, password FROM customer WHERE account = ?', [req.body.account]);

    if (customers.length === 0) {
        // 如果沒有，就回覆錯誤
        // 這個 email 沒有註冊過
        return res.status(400).json({ code: 3003, error: '帳號或密碼錯誤' });
    }
    
    // 如果程式碼能執行到這裡，表示 members 裡至少有一個資料
    // 把這個會員資料拿出來
    let customer = customers[0];
    console.log('customer : ',customer);

    if (req.body.password !== customer.password) {
        return res.status(400).json({ code: 3004, error: '帳號或密碼錯誤' });
    }


    res.json({ code: 0, result: `東西有從後台打回前台:`+{customer} });
});


module.exports = router;