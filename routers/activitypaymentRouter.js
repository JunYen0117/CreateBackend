const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const LinePay = require('line-pay-v3')


let linePay = new LinePay({
  channelId: process.env.LINEPAY_ID,
  channelSecret: process.env.LINEPAY_SECRET,
  uri: 'https://sandbox-api-pay.line.me'
})
randomNumber=()=>{
  const now = new Date()
  let month = now.getMonth() + 1
  let day = now.getDate()
  let hour = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()
  return now.getFullYear().toString() + month.toString() + day + hour + minutes + seconds + (Math.round(Math.random() * 89 + 100)).toString()
 };

let payUrl=''
let amount=0

// localhost:3003/api/activitypayment
router.post('/', async (req, res, next) => {
  let orderdate = randomNumber();
  amount=req.body.order.total
  const order = {
    amount: req.body.order.total,
    currency: 'TWD',
    orderId: `Order${orderdate}`,
    packages: [
      {
        id: req.body.order.exhibition_id,
        amount: req.body.order.total,
        name: '展覽',
        products: [
          {
            name: req.body.order.exhibition_name,
            quantity: req.body.order.count,
            price:  req.body.order.price
          }
        ]
      }
    ],
    redirectUrls: {
      confirmUrl: 'http://localhost:3003/api/activitypayment/linepay',
      cancelUrl: 'https://example.com/cancelUrl'
    }
  }
  const line = await linePay.request(order).then(res=>{
    console.log(res)
    payUrl=res.info.paymentUrl.web
  })
    // console.log('data:', req.body);
    // data: {
    //   order: {
    //     exhibition_id: '1',
    //     exhibition_name: '進擊的巨人展FINAL門票',
    //     price: '280',
    //     count: '2',
    //     total: '560',
    //     date: { start: '2022-06-25', end: '2022-08-21' }
    //   },
    //   orderName: '小明',
    //   orderEmail: 'ming@test.com',
    //   orderPhone: '0911111111'
    // }

    const date = new Date();  
  
    let [result] = await pool.execute('INSERT INTO exhibition_order (customer_id, exhibition_id, count, total,order_name,order_email,order_phone,order_date) VALUES (?, ?, ?, ?, ?, ?, ?,?)', [req.body.userID, req.body.order.exhibition_id, req.body.order.count, req.body.order.total,req.body.orderName,req.body.orderEmail,req.body.orderPhone,date]);


  res.json({ code: 0, result: 'OK',payUrl:payUrl});
 
});

router.get('/linepay', (req, res, next) => {
  // console.log('data:', req.body);

  linePay.confirm({amount:amount,currency:'TWD'},req.query.transactionId).then(res=>{console.log(res)});
  // res.send("OK");
  

  res.redirect('http://localhost:3000/activity');
  
  


// res.json({ code: 0, result: 'OK' });

});


module.exports = router;
