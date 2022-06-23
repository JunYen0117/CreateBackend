const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product/detail/1
router.get('/:productId', async (req, res, next) => {
  let sql = 'SELECT id, product_name, price, image FROM product WHERE product.id = ?';
  let [product] = await pool.execute(sql, [req.params.productId]);
  res.json(product);
})


module.exports = router;