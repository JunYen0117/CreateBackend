const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/productorder
router.get('/', async (req, res, next) => {
  const sql2 = 'SELECT * FROM customer_order ';

  let [productorder] = await pool.execute(sql2);
  let total = productorder.length;

  let totaldata = [];
  for (let i = 0; i < total; i++) {
    let [data] = await pool.execute('SELECT * FROM customer_order_detail WHERE order_id = ?', [i + 1]);
    // console.log(data);
    totaldata = [...totaldata, { data }];
  }

  let totalarr = [];
  let mydata = {};
  for (let i = 0; i < totaldata.length; i++) {
      let result = 0;
    for (let j = 0; j < totaldata[i].data.length; j++) {
      result = result + totaldata[i].data[j].subtotal;
    }
    console.log(result);

        mydata = { orderid: totaldata[i].data[0].order_id, totalsub: result, totalcount: totaldata[i].data.length };
        totalarr = [...totalarr, mydata]
  }

  res.json({
    totalarr: totalarr,
  });
});
router.get('/:orderId', async (req, res, next) => {
  const sql2 = 'SELECT * FROM customer_order ';

  let [productorder] = await pool.execute(sql2);
  let total = productorder.length;

  let [data] = await pool.execute('SELECT * FROM customer_order_detail WHERE order_id = ?', [req.params.orderId]);
  res.json({
    pagination: {
      total,
    },
    data: data,
  });
});

router.get('/productorderdetail', async (req, res, next) => {
  const sql =
    'SELECT customer_order_detail.id, customer_order_detail.order_id, customer_order_detail.product_id,customer_order_detail.vendor_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal FROM customer_order_detail JOIN customer_order ON customer_order_detail.order_id = customer_order.id JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id WHERE customer_order_detail.order_id = 1';
});

module.exports = router;
