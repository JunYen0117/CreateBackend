const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product
router.post('/', async (req, res, next) => {
    console.log('data:', req.body);
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
  
    let [result] = await pool.execute('INSERT INTO exhibition_order (customer_id, exhibition_id, count, total,order_name,order_email,order_phone,order_date) VALUES (1, ?, ?, ?, ?, ?, ?,?)', [req.body.order.exhibition_id, req.body.order.count, req.body.order.total,req.body.orderName,req.body.orderEmail,req.body.orderPhone,date]);


  res.json({ code: 0, result: 'OK' });
 
});
module.exports = router;
