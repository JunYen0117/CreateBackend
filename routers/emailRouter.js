const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.get('/',async (req, res, next) =>{
    let date = new Date()
    let dateformat = date.toUTCString()
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 3003,
        auth: {
          user: 'relife12345@gmail.com',
          pass: 'ygikuizuwoezvzac',
        },
      });
      
    transporter.sendMail({
        from: '"Create Hallway"<example@test.com>',
        to: 'relife12345@gmail.com',
        subject: '【創意迴廊】 忘記 密碼 通知信',
        html: `<img src="https://upload.cc/i1/2022/07/02/8XLhgi.png" style="width: 300px; height: 85px"><h2>親愛的使用者您好：</h2><h2>您於 ${dateformat} <br>回報網站有無法登入的情況發生<br>請點選下方連結以重新設定密碼<br><a href="#/">https://localhost:3000</h2>`
    }).then(info => {
        console.log({ info });
    })
})



module.exports = router;