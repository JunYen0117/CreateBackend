const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/productorder
router.get('/', async (req, res, next) => {
  // 抓使用者id為1的訂單列表
  const sql2 = 'SELECT * FROM customer_order WHERE customer_order.customer_id = 1'; //5.6訂單

  // 抓使用者id為1的訂單總數
  let [productorder] = await pool.execute(sql2);
  let orderId = [];
  let orderDate = [];
  productorder.map((v) => {
    orderId.push(v.id);
    orderDate.push(v.order_date);
    return;
  });
  console.log(orderId);
  // 2筆訂單 [5,6]cd

  //訂單內容的detail
  let totaldata = [];
  for (let i = 0; i < orderId.length; i++) {
    console.log(orderDate[i]);
    let [product] = await pool.execute('SELECT * FROM customer_order_detail WHERE customer_order_detail.order_id = ?', [orderId[i]]);
    totaldata = [...totaldata, { product }];
  }
  // console.log(totaldata)
  // console.log(product);

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
  console.log(totalarr);
  res.json({
    totalarr: totalarr,
  });
});

// ======================== detail ==============================

// TODO:  抓 vendor, productnum, product_name, price, account, total

router.get('/:orderId', async (req, res, next) => {
  const sql2 =
    'SELECT customer_order_detail.order_id, customer_order_detail.price, customer_order_detail.amount, customer_order_detail.subtotal, product.product_name, product.product_num, vendor.business_name FROM customer_order_detail JOIN product ON customer_order_detail.product_id = product.id JOIN vendor ON customer_order_detail.vendor_id = vendor.id WHERE order_id =1 ';

  // 取得商品數量
  let [productdetail] = await pool.execute(sql2);
  let total = productdetail;

  
  // let totaldetail = [];
  // for (let i = 0; i <= total.length; i++) {
  //   totaldetail.push(total[i]);

  //   detaildata = {
  //     orderid: totaldetail[i].order_id,
  //     businessname: totaldetail[i].business_name,
  //     productnum: totaldetail[i].product_num,
  //     productname: totaldetail[i].product_name,
  //     price: totaldetail[i].price,
  //     amount: totaldetail[i].amount,
  //     subtotal: totaldetail[i].subtotal,
  //   };
  //   detailarr = [...totaldetail, detaildata];
  // }
  // console.log(detailarr);

  res.json(total);
});

// res.json({
//   pagination: {
//     total,
//   },
//   data:
// });

module.exports = router;
