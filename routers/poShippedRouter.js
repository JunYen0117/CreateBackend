const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/poshipped
router.get('/', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_order.customer_id = 1 AND valid = 3 '; //消費者寫死 valid=3 shipped 

  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2);
  // console.log(productorder);
  let orderId = [];
  let orderDate = [];
  productorder.map((v) => {
    orderId.push(v.id);
    orderDate.push(v.order_date);
    return;
  });
  // console.log(orderId);
  // 2筆訂單 [5,6]

  //訂單內容的detail
  let totaldata = [];
  for (let i = 0; i < orderId.length; i++) {
    // console.log(orderDate[i]);
    let [product] = await pool.execute('SELECT * FROM customer_order_detail WHERE customer_order_detail.order_id = ?', [orderId[i]]);
    totaldata = [...totaldata, { product }];
    // console.log(product);
  }
  // console.log(totaldata)

  // 抓總金額
  let totalarr = [];
  let mydata = {};
  // i -> 訂單總數
  for (let i = 0; i < totaldata.length; i++) {
    // [{ [0], [1], [2] } --> 3個訂單

    // console.log(totaldata[i].product.length)
    // j -> 訂單內的商品總數 （第幾個商品）
    let result = 0;
    for (let j = 0; j < totaldata[i].product.length; j++) {
      // console.log(totaldata[i].product[j]);
      result = result + totaldata[i].product[j].subtotal;
    }
    // console.log(result);
    //mydata = { orderid: 1 , totalsub: 總金額 }
    mydata = { orderid: totaldata[i].product[0].order_id, totalsub: result, orderdate: orderDate[i] };
    totalarr = [...totalarr, mydata];
  }
  // console.log(totalarr);
  res.json({
    totalarr: totalarr,
  });
});




// ======================== detail ==============================

// TODO:  抓 id, vendor, productnum, product_name, price, account, total

// localhost:3003/api/poshipped/:orderID
router.get('/:orderId', async (req, res, next) => {
  // console.log('orderId', req.params.orderId)
  const sql2 =
    'SELECT customer_order_detail.order_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal, product.product_name, product.product_num, vendor.business_name FROM customer_order_detail JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id WHERE order_id = ? ';

  // 取得商品數量[req.params.orderId]
  let [productdetail] = await pool.execute(sql2, [req.params.orderId]);
  let total = productdetail;

  // console.log(total);

  // 抓總金額
  let result = 0;
  for (let i = 0; i < total.length; i++) {
    result = result + total[i].subtotal;
    result += total[i].subtotal;
  }
  // console.log(result);

  // TODO: 抓收件人資料 名字電話地址
  let receiver = [];


    let [receiverdata] = await pool.execute('SELECT customer.member_name, customer.phone, customer.address, customer_order.id FROM `customer` JOIN customer_order ON customer.id = customer_order.customer_id WHERE customer_order.id= ?', [req.params.orderId]);
    receiver = receiverdata;
    // console.log(receiver);
  

  res.json({
    total,
    result,
    receiver:receiver
  });
});


module.exports = router;