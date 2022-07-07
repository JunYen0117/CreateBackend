const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// =============== 加進資料庫 =====================

// localhost:3003/api/comment/product/add
router.post('/product/add', async (req, res, next) => {
  const sql = 'INSERT INTO product_comment (order_id, product_id, customer_id, comment, star) VALUES (?,?,?,?,?)';

  for (i = 0; i < req.body.length ; i++) {
    if(req.body[i].comment) {
      let [comment] = await pool.execute(sql, [req.body[i].order_id, req.body[i].product_id, req.body[i].customer_id, req.body[i].comment, req.body[i].star]);
    } else {
      sql = 'INSERT INTO product_comment (order_id, product_id, customer_id, star) VALUES (?, ?,?,?)';
      let [comment] = await pool.execute(sql, [req.body[i].order_id, req.body[i].product_id, req.body[i].customer_id, req.body[i].star]); 
    }
  }

  res.json({ message: 'OK' });
});

// localhost:3003/api/comment/product/checked
router.get('/product/checked', async (req, res, next) => {

  const sql = 'SELECT product_comment.* FROM product_comment WHERE product_comment.order_id= ?';

  let [check] = await pool.execute(sql, [req.query.orderId]);

  res.json(check);
});

// localhost:3003/api/comment/product/1
router.get('/product/:productId', async (req, res, next) => {
  const sql = 'SELECT product_comment.*, customer.member_name FROM product_comment JOIN customer ON product_comment.customer_id = customer.id WHERE product_comment.product_id = ?';

  let [comment] = await pool.execute(sql, [req.params.productId]);

  res.json(comment);
});


module.exports = router;
