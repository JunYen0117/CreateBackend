const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// =============== 加進資料庫 =====================

// localhost:3003/api/comment/product/add
TODO: router.post('/product/add', async (req, res, next) => {
  // console.log('data', req.body);

  const sql = 'INSERT INTO product_comment (order_id, product_id, customer_id, comment, star) VALUES (?,?,?,?,?)';

  for (i = 0; i < req.body.length; i++) {
    let [comment] = await pool.execute(sql, [req.body[i].order_id, req.body[i].product_id, req.body[i].customer_id, req.body[i].comment, req.body[i].star]);
  }

  res.json({ message: 'OK' });
});

// localhost:3003/api/comment/product/checked
TODO: router.get('/product/checked', async (req, res, next) => {

  const sql = 'SELECT product_comment.* FROM product_comment WHERE product_comment.order_id= ?';

  let [check] = await pool.execute(sql, [req.query.orderId]);

  res.json(check);


});


// localhost:3003/api/comment/product
TODO: router.get('/product', async (req, res, next) => {
  const sql2 = 'SELECT product_comment.* FROM product_comment WHERE product_comment.customer_id = 1';

  let [product] = await pool.execute(sql2);

  res.json(product);
});

module.exports = router;
