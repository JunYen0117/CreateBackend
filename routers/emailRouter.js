const express = require('express');
const router = express.Router();
const pool = require('../utils/database.js');
const nodemailer = require('nodemailer');

router.post('/',async (req, res, next) =>{
    //console.log('req.body', req.body);
    const [customers] = await pool.execute('SELECT * FROM customer WHERE account = ?', [req.body.account]);
    const customer = customers[0];
    console.log(customer)

    if (customers.length === 0) {
      return res.status(400).json({ code: 3003, error: '帳號或密碼錯誤' });
    }


    let date = new Date()
    let dateformat = date.toUTCString()
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 3003,
        auth: {
          user: 'ispanForTeamThird@gmail.com',
          pass: 'pransvipwfsvuvnr',
        },
      });
      
    transporter.sendMail({
        from: '"Create Hallway"<ispanForTeamThird@gmail.com>',
        to: customer.account,//'relife12345@gmail.com',
        subject: '【創意迴廊】 忘記 密碼 通知信',
        html: `<img src="https://upload.cc/i1/2022/07/02/8XLhgi.png" style="width: 300px; height: 85px"><h2>親愛的使用者您好：</h2><h2>您於 ${dateformat} <br>回報網站有無法登入的情況發生<br>請點選下方連結以重新設定密碼<br><a href="#/">https://localhost:3000</h2>`
    }).then(info => {
        //console.log({ info });
    })

    return res.json( '已寄送認證信至信箱' );
})



module.exports = router;