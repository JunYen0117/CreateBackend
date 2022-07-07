const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// ======================== OrderFinish==============================

//  改變customer_order 的 valid 改為1 (已完成)

//  TODO: localhost:3003/api/productorder/shipped/:customer_id/:orderId/:valid

router.get('/shipped/:customer_id/:orderId/:valid', async (req, res, next) => {
  const sql3 = 'UPDATE customer_order SET valid = 1 WHERE customer_id =? AND id = ?';

  //console.log(req.params.orderId)

  let [ordervalid] = await pool.execute(sql3, [req.params.customer_id, req.params.orderId]);
  let valid = ordervalid;

  res.json({
    valid,
  });
});

// ======================== OrderCancel ==============================

// 改變customer_order_detail 的 valid

//  TODO:  localhost:3003/api/productorder/notshipped/:customer_id/:orderId/:valid

router.get('/notshipped/:customer_id/:orderId/:valid', async (req, res, next) => {
  const sql3 = 'UPDATE customer_order SET valid = 0 WHERE customer_id =? AND id = ?';

  //console.log(req.params.orderId)

  let [ordervalid] = await pool.execute(sql3, [req.params.customer_id, req.params.orderId]);
  let valid = ordervalid;

  res.json({
    valid,
  });
});

// ======================== detail ==============================

//  抓 id, vendor, productnum, product_name, price, account, total, image

// TODO:  localhost:3003/api/productorder/shipped/:customer_id/:orderID
router.get('/shipped/:customer_id/:orderId', async (req, res, next) => {
  // console.log('orderId', req.params.orderId)
  const sql2 =
    'SELECT customer_order_detail.order_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal, product.product_name, product.product_num, product.image, vendor.business_name, customer_order.customer_id FROM customer_order_detail JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id JOIN customer_order ON customer_order_detail.order_id = customer_order.id WHERE customer_order.customer_id = ? AND customer_order_detail.order_id = ? ';

  // 取得商品數量[req.params.orderId]
  let [productdetail] = await pool.execute(sql2, [req.params.customer_id, req.params.orderId]);
  let total = productdetail;

  // console.log(total);

  // 抓總金額
  let result = 0;
  for (let i = 0; i < total.length; i++) {
    result = result + total[i].subtotal;
  }
  // console.log(result);

  //  抓收件人資料 email 名字電話地址
  let receiver = [];

  let [receiverdata] = await pool.execute('SELECT customer_order.* FROM `customer_order` WHERE customer_order.id= ?', [req.params.orderId]);
  receiver = receiverdata;
  // console.log(receiver);

  //  抓付款人資料 名字電話地址
  let payment = [];

  let [paymentdata] = await pool.execute(
    'SELECT customer.member_name, customer.phone, customer.address, customer_order.id FROM `customer` JOIN customer_order ON customer.id = customer_order.customer_id WHERE customer_order.id= ?',
    [req.params.orderId]
  );
  payment = paymentdata;
  // console.log(payment);

  res.json({
    total,
    result,
    receiver: receiver,
    payment: payment,
  });
});


//   抓 id, vendor, productnum, product_name, price, account, total, image

// TODO: localhost:3003/api/productorder/notshipped/:customer_id/:orderID
router.get('/notshipped/:customer_id/:orderId', async (req, res, next) => {
  // console.log('orderId', req.params.orderId)
  const sql2 =
    'SELECT customer_order_detail.order_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal, product.product_name, product.product_num, product.image, vendor.business_name, customer_order.customer_id FROM customer_order_detail JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id JOIN customer_order ON customer_order_detail.order_id = customer_order.id WHERE customer_order.customer_id = ? AND customer_order_detail.order_id = ? ';

  // 取得商品數量[req.params.orderId]
  let [productdetail] = await pool.execute(sql2, [req.params.customer_id, req.params.orderId]);
  let total = productdetail;

  // console.log(total);

  // 抓總金額
  let result = 0;
  for (let i = 0; i < total.length; i++) {
    result = result + total[i].subtotal;
  }
  // console.log(result);

  //  抓收件人資料 email 名字電話地址
  let receiver = [];

  let [receiverdata] = await pool.execute('SELECT customer_order.* FROM `customer_order` WHERE customer_order.id= ?', [req.params.orderId]);
  receiver = receiverdata;
  // console.log(receiver);

  //  抓付款人資料 名字電話地址
  let payment = [];

  let [paymentdata] = await pool.execute(
    'SELECT customer.member_name, customer.phone, customer.address, customer_order.id FROM `customer` JOIN customer_order ON customer.id = customer_order.customer_id WHERE customer_order.id= ?',
    [req.params.orderId]
  );
  payment = paymentdata;
  // console.log(payment);

  res.json({
    total,
    result,
    receiver: receiver,
    payment: payment,
  });
});

//  抓 id, vendor, productnum, product_name, price, account, total, image

// TODO: localhost:3003/api/productorder/cancel/:customer_id/:orderID
router.get('/cancel/:customer_id/:orderId', async (req, res, next) => {
  // console.log('orderId', req.params.orderId)
  const sql2 =
    'SELECT customer_order_detail.order_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal, product.product_name, product.product_num, product.image, vendor.business_name, customer_order.customer_id FROM customer_order_detail JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id JOIN customer_order ON customer_order_detail.order_id = customer_order.id WHERE customer_order.customer_id = ? AND customer_order_detail.order_id = ? ';

  // 取得商品數量[req.params.orderId]
  let [productdetail] = await pool.execute(sql2, [req.params.customer_id, req.params.orderId]);
  let total = productdetail;

  // console.log(total);

  // 抓總金額
  let result = 0;
  for (let i = 0; i < total.length; i++) {
    result = result + total[i].subtotal;
  }
  // console.log(result);

  //  抓收件人資料 email 名字電話地址
  let receiver = [];

  let [receiverdata] = await pool.execute('SELECT customer_order.* FROM `customer_order` WHERE customer_order.id= ?', [req.params.orderId]);
  receiver = receiverdata;
  // console.log(receiver);

  //  抓付款人資料 名字電話地址
  let payment = [];

  let [paymentdata] = await pool.execute(
    'SELECT customer.member_name, customer.phone, customer.address, customer_order.id FROM `customer` JOIN customer_order ON customer.id = customer_order.customer_id WHERE customer_order.id= ?',
    [req.params.orderId]
  );
  payment = paymentdata;
  // console.log(payment);

  res.json({
    total,
    result,
    receiver: receiver,
    payment: payment,
  });
});

// 抓 id, vendor, productnum, product_name, price, account, total, image

// localhost:3003/api/productorder/finish/:customer_id/:orderID
router.get('/finish/:customer_id/:orderId', async (req, res, next) => {
  // console.log('orderId', req.params.orderId)
  const sql2 =
    'SELECT customer_order_detail.order_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal, product.product_name, product.product_num, product.image, vendor.business_name, customer_order.customer_id FROM customer_order_detail JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id JOIN customer_order ON customer_order_detail.order_id = customer_order.id WHERE customer_order.customer_id = ? AND customer_order_detail.order_id = ? ';

  // 取得商品數量[req.params.orderId]
  let [productdetail] = await pool.execute(sql2, [req.params.customer_id, req.params.orderId]);
  let total = productdetail;

  // 抓總金額
  let result = 0;
  for (let i = 0; i < total.length; i++) {
    result = result + total[i].subtotal;
  }
  // console.log(result);

  //  抓收件人資料 email 名字電話地址
  let receiver = [];

  let [receiverdata] = await pool.execute('SELECT customer_order.* FROM `customer_order` WHERE customer_order.id= ?', [req.params.orderId]);
  receiver = receiverdata;
  // console.log(receiver);

  //  抓付款人資料 名字電話地址
  let payment = [];

  let [paymentdata] = await pool.execute(
    'SELECT customer.member_name, customer.phone, customer.address, customer_order.id FROM `customer` JOIN customer_order ON customer.id = customer_order.customer_id WHERE customer_order.id= ?',
    [req.params.orderId]
  );
  payment = paymentdata;
  // console.log(payment);

  res.json({
    total,
    result,
    receiver: receiver,
    payment: payment,
  });
});

// ======================== List ==============================

// localhost:3003/api/productorder/shipped/:customer_id
router.get('/shipped/:customer_id', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_order.customer_id = ? AND valid = 3 '; //消費者寫死 valid=3 shipped

  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2, [req.params.customer_id]);
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

// localhost:3003/api/productorder/notshipped/:customer_id
router.get('/notshipped/:customer_id', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_order.customer_id = ? AND valid = 2 ';
  // valid = 2 notshipped valid= 3 shipped

  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2, [req.params.customer_id]);
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
  let arrshipped = [];
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
    arrshipped = [...arrshipped, mydata];
  }
  // console.log('test');
  res.json({
    arrshipped: arrshipped,
  });
});

// localhost:3003/api/productorder/finish/:customer_id
router.get('/finish/:customer_id', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_order.customer_id = ? AND valid = 1 '; //消費者寫死

  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2, [req.params.customer_id]);
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

// localhost:3003/api/productorder/cancel/:customer_id
router.get('/cancel/:customer_id', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_order.customer_id = ? AND valid= 0';
  //消費者目前寫死 valid等於0

  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2, [req.params.customer_id]);
  // console.log(productorder)
  let orderId = [];
  let orderDate = [];
  productorder.map((v) => {
    orderId.push(v.id);
    orderDate.push(v.order_date);
    return;
  });
  // console.log(productorder)
  // console.log(orderId)
  // => 5 (valid=0)

  // 訂單內容的detail
  let totaldata = [];
  for (let i = 0; i < orderId.length; i++) {
    // console.log(orderDate[i]);
    let [product] = await pool.execute('SELECT * FROM customer_order_detail WHERE customer_order_detail.order_id = ?', [orderId[i]]);
    totaldata = [...totaldata, { product }];
    // console.log(product);
  }
  // console.log(totaldata)

  // 抓總金額
  let arrcancel = [];
  let mydata = {};
  // i -> 訂單總數
  for (let i = 0; i < totaldata.length; i++) {
    // [{ [0], [1], [2] } --> 3個訂單

    // console.log(totaldata[i].product.length);
    // j -> 訂單內的商品總數 （第幾個商品）
    let result = 0;
    for (let j = 0; j < totaldata[i].product.length; j++) {
      // console.log(totaldata[i].product[j]);
      result = result + totaldata[i].product[j].subtotal;
    }
    // console.log(result);
    // mydata = { orderid: 1 , totalsub: 總金額 }
    mydata = { orderid: totaldata[i].product[0].order_id, totalsub: result, orderdate: orderDate[i] };
    arrcancel = [...arrcancel, mydata];
  }
  // console.log(arrcancel);
  res.json({
    arrcancel: arrcancel,
  });
});

module.exports = router;
