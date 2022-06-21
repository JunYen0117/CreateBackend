const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product?page=1
router.get('/', async (req, res, next) => {
  // 如果沒有宣告 page，則預設 page = 1
  const page = req.query.page || 1;
  // 把 query.String 轉成數字
  const classificationId = Number(req.query.classificationId) || -1;

  // 1. 取得 ?page 的值，目前頁數
  console.log('current page : ', page);

  // 設定預設值，隨著條件變動
  let sql = 'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id';
  let [products] = await pool.execute(sql);

  // 2. 取得目前的總筆數
  if(classificationId !== -1) {
    sql = `SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id WHERE product.classification_id = ?`;
    [products] = await pool.execute(sql, [classificationId]);
  }

  // 3. 計算總共有幾頁
  const total = products.length;
  console.log('total : ', total);

  // 設定每一頁要顯示幾筆
  const perPage = 20; 
  const lastPage = Math.ceil(total / perPage); 
  console.log('lastPage : ', lastPage);

  // 4. 計算 offset 是多少 (計算要跳過幾筆)
  let offset = (page - 1) * perPage;
  console.log('offset : ', offset);

  // 設定預設值，隨著條件變動
  let sqlPage = 'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id LIMIT ? OFFSET ?';
  let [pageProducts] = await pool.execute(sqlPage, [perPage, offset]);

  // 5. 取得這一頁的資料
  if(classificationId !== -1) {
    sqlPage = `SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id WHERE product.classification_id = ? LIMIT ? OFFSET ?`;
    [pageProducts] = await pool.execute(sqlPage, [classificationId, perPage, offset]);
  }

  console.log('sqlPage : ', sqlPage)
  console.log('pageProducts : ', pageProducts.length)

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

// localhost:3003/api/product/category/1
router.get('/category/:categoryId', async (req, res, next) => {
  const sql = 'SELECT product.id, product.product_name, product.price, product.image, vendor.business_name FROM product JOIN vendor ON product.vendor_id = vendor.id WHERE product.category_id = ?';
  let [category] = await pool.execute(sql, [req.params.categoryId]);
  res.json(category);
});

// --------- Sidebar ---------
// localhost:3003/api/product/classification
router.get('/classification', async (req, res, next) => {
  const sql = 'SELECT * FROM classification';
  const [classification] = await pool.execute(sql);
  res.json(classification);
});

// localhost:3003/api/product/classification/1/category
router.get('/classification/:classificationId/category', async (req, res, next) => {
  const sql = 'SELECT * FROM category WHERE classification_id = ?';
  const [category] = await pool.execute(sql, [req.params.classificationId]);
  res.json(category);
});
// --------- Sidebar ---------


module.exports = router;