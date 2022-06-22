const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product
router.get('/', async (req, res, next) => {
    const sql = 'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id'
    let [products] = await pool.execute(sql);
    res.json(products);
  });