const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/productorder
router.get('/', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_id =1 ';

  
  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2);
  let total = productorder.length;

  
  // id為1的分別買了哪些東西 幾樣商品 product_id
  let totaldata = [];
  for (let i = 0; i < total; i++) {
    let [data] = await pool.execute('SELECT * FROM customer_order_detail WHERE order_id = ?', [i + 1]);
    // console.log(data);
    totaldata = [...totaldata, { data }];
    // [{訂單1號買了哪些商品} ,{訂單2號...}.....]
  }

  
  // 抓總金額
  let totalarr = [];
  let mydata = {};
  // i -> 訂單總數
  for (let i = 0; i < totaldata.length; i++) {
    // [{ [0], [1], [2] } --> 3個訂單 
    ]
    // j -> 訂單內的商品總數 （第幾個商品）
      let result = 0;
    for (let j = 0; j < totaldata[i].data.length; j++) {
      result = result + totaldata[i].data[j].subtotal;
      
    }
    console.log(result);
        // mydata = { orderid: 1 , totalsub: 總金額 , totalcount : 總數量 } 
        mydata = { orderid: totaldata[i].data[0].order_id, totalsub: result, totalcount: totaldata[i].data.length };
        totalarr = [...totalarr, mydata]
  }
  // 
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
