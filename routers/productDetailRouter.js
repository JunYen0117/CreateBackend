const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product/detail/1
router.get('/:productId', async (req, res, next) => {
  let sql = 'SELECT product.id, product.product_name, product.price, product.image, product.vendor_id, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id WHERE product.id = ?';
  let [product] = await pool.execute(sql, [req.params.productId]);
  res.json(product);
})


module.exports = router;