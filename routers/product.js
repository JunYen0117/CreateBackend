const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product
router.get('/', async (req, res, next) => {
  const sql = 'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id'
  let [products] = await pool.execute(sql);
  res.json(products);
});

// localhost:3003/api/product/classification
router.get('/classification', async (req, res, next) => {
  const sql = 'SELECT * FROM classification'
  const [classification] = await pool.execute(sql);
  res.json(classification);
});

// localhost:3003/api/product/classification/1
router.get('/classification/:classificationId', async (req, res, next) => {
  const sql = 'SELECT * FROM category WHERE classification_id = ?'
  let [category] = await pool.execute(sql, [req.params.classificationId]);
  res.json(category);
});



module.exports = router;