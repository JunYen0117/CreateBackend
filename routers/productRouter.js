const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product
router.get('/', async (req, res, next) => {
  // 如果沒有宣告 page，則預設 page = 1
  let page = req.query.page || 1;

  // 1. 取得 ?page 的值，目前頁數
  console.log('current page:', page);

  // 2. 取得目前的總筆數
  const sql = 'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id';
  let [products] = await pool.execute(sql);
  const total = products.length;
  console.log('total:', total);

  // 3. 計算總共有幾頁
  const perPage = 20; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage); // 最後一頁是第幾頁
  console.log('lastPage:', lastPage);

  // 4. 計算 offset 是多少 (計算要跳過幾筆)
  let offset = (page - 1) * perPage;
  console.log('offset:', offset);

  // 5. 取得這一頁的資料
  const sqlPage =
    'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id LIMIT ? OFFSET ?';
  let [pageProducts] = await pool.execute(sqlPage, [perPage, offset]);

  // 6. 回覆給前端
  res.json({
    pagination: {
      total,
      lastPage,
      page,
    },
    data: pageProducts,
  });
});

// localhost:3003/api/product/classification
router.get('/classification', async (req, res, next) => {
  const sql = 'SELECT * FROM classification';
  const [classification] = await pool.execute(sql);
  res.json(classification);
});

// localhost:3003/api/product/classification/1
router.get('/classification/:classificationId', async (req, res, next) => {
  const sql =
    'SELECT classification.classification_name, category.category_name, product.id, product.category_id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id JOIN classification ON product.classification_id = classification.id JOIN category ON product.category_id = category.id WHERE product.classification_id = ?';
  let [classification] = await pool.execute(sql, [req.params.classificationId]);
  res.json(classification);
});

// localhost:3003/api/product/category/1
router.get('/category/:categoryId', async (req, res, next) => {
  const sql =
    'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id WHERE product.category_id = ?';
  let [category] = await pool.execute(sql, [req.params.categoryId]);
  res.json(category);
});

module.exports = router;
