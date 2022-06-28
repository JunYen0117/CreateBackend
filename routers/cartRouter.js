const express = require("express");
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/cart/orderDetails
router.post('/orderDetails', async (req, res, next) => {
  // shippingData
  const shippingData = req.body.shippingData;

  // 收件資料
  const recipient = shippingData.recipient;
  const recipientEmail = shippingData.email;
  const tel = shippingData.tel;
  const address = shippingData.county + shippingData.district + shippingData.address;

  // 購買商品清單
  const checkList = req.body.checkList;
  const total = req.body.total;

  // 目前時間
  const date = new Date();  

  // customer_order
  // customer_id 待修改 -> 會員id
  const sql = 'INSERT INTO customer_order (customer_id, recipient, recipient_email, tel, address, order_date, total, valid) VALUES (1, ?, ?, ?, ?, ?, ?, 2)';
  const [order] = await pool.execute(sql, [recipient, recipientEmail, tel, address, date, total]);

  // customer_order_detail
  const orderId = order.insertId;
  let sqlDetail = 'INSERT INTO customer_order_detail (order_id, product_id, vendor_id, price, amount, subtotal) VALUES (?, ?, ?, ?, ?, ?)';
  for (let i = 0; i < checkList.length; i++) {
    let subtotal = checkList[i].price * checkList[i].quantity;
    let [orderProduct] = await pool.execute(sqlDetail, [orderId, checkList[i].id, checkList[i].vendor_id, checkList[i].price, checkList[i].quantity, subtotal]);
  }

  res.json({message: '歡迎下次光臨'});
})


module.exports = router;