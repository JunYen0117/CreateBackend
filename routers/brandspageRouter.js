// 一定要引用的!
const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// 品牌
// localhost:3003/api/brandpage
router.get('/', async (req, res, next) => {
    const sql = 'SELECT id, business_name, logo, introduce FROM vendor '
    let [brands] = await pool.execute(sql);
    res.json(brands);
});

// 品牌商品
// localhost:3003/api/brandpage/brand/1
router.get('/brand/:brandId', async (req, res, next) => {

  const sql = 'SELECT vendor.id, vendor.business_name, vendor.logo, vendor.introduce, vendor.address, vendor.create_time, product.product_name, product.price, product.image FROM vendor JOIN product ON vendor.id = product.vendor_id WHERE vendor.id = ?'
  let [brand] = await pool.execute(sql, [req.params.brandId]);
  res.json({
    brand: brand,
    brandName: brand[0].business_name,
    create_time: brand[0].create_time,
    quantity: brand.length,
    address: brand[0].address,
    logo: brand[0].logo,
  });
});


// 最後一行
module.exports = router;