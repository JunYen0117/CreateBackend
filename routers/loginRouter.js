const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../utils/database.js');

const path = require('path');


router.post('/', async (req, res, next) => {

    let [customers] = await pool.execute('SELECT * FROM customer WHERE account = ?', [req.body.account]);

    if (customers.length === 0) {
        // 如果沒有，就回覆錯誤
        // 這個 email 沒有註冊過
        return res.status(400).json({ code: 3003, error: '帳號或密碼錯誤' });
    }
    // 如果程式碼能執行到這裡，表示 customers 裡至少有一個資料
    // 把這個會員資料拿出來
    let customer = customers[0];

    if (req.body.password !== customer.password) {
        return res.status(400).json({ code: 3004, error: '帳號或密碼錯誤' });
    }

    let sessionData = { id: customer.id, member_num: customer.member_num, member_name: customer.member_name, account: customer.account, gender: customer.gender, age: customer.age, phone: customer.phone, address: customer.address, create_time: customer.create_time, valid: customer.valid };
    req.session.customer = sessionData;

    res.json({ code: 0, result: '東西有從後台打回前台', sessionData: sessionData});
});


module.exports = router;