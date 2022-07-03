const express = require("express");
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/comment/product
router.get('/product', async (req, res, next) => {
  const sql2 =
    'SELECT product_comment.* FROM product_comment WHERE product_comment.customer_id = 1';

  
  let [product] = await pool.execute(sql2);

  res.json(product);
});

module.exports = router;