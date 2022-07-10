const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// ====================== 刪除 =========================

// Delete 收藏品
// localhost:3003/api/fav/activity/del/:userId/:exId
router.get('/activity/del/:userId/:exId', async (req, res, next) => {
  const sql2 = 'DELETE FROM collect_exhibition WHERE customer_id = ? AND exhibition_id = ?';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.exId]);

  res.json({ code: 0, message: '刪除成功' });
});

// localhost:3003/api/fav/product/del/:userId/:prdId
router.get('/product/del/:userId/:prdId', async (req, res, next) => {
  const sql2 = 'DELETE FROM collect_product WHERE customer_id = ? AND product_id = ?';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.prdId]);

  res.json({ code: 0, message: '刪除成功' });
});

// localhost:3003/api/fav/blog/del/:userId/:blogId
router.get('/blog/del/:userId/:blogId', async (req, res, next) => {
  const sql2 = 'DELETE FROM collect_blog WHERE customer_id = ? AND blog_id = ?';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.blogId]);

  res.json({ code: 0, message: '刪除成功' });
});

// ====================== 加入 =========================

// Add 收藏品
// localhost:3003/api/fav/activity/add/:userId/:exId
router.get('/activity/add/:userId/:exId', async (req, res, next) => {
  const sql2 = 'INSERT INTO collect_exhibition (customer_id, exhibition_id) VALUES (?,?)';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.exId]);

  res.json({ code: 0, message: '加入成功' });
});

// localhost:3003/api/fav/blog/add/:userId/:blogId
router.get('/blog/add/:userId/:blogId', async (req, res, next) => {
  const sql2 = 'INSERT INTO collect_blog (customer_id, blog_id) VALUES (?,?)';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.blogId]);

  res.json({ code: 0, message: '加入成功' });
});

// localhost:3003/api/fav/product/add/:userId/:prdId
router.get('/product/add/:userId/:prdId', async (req, res, next) => {
  const sql2 = 'INSERT INTO collect_product (customer_id, product_id) VALUES (?,?)';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.prdId]);

  res.json({ code: 0, message: '加入成功' });
});

// ====================== userId =========================

// localhost:3003/api/fav/activity/:userId
router.get('/activity/:userId', async (req, res, next) => {
  const sql2 =
    'SELECT collect_exhibition.*, exhibition.exhibition_name, exhibition.exhibition_price, exhibition.start_date, exhibition.end_date, exhibition.start_time, exhibition.end_time, exhibition.exhibition_location, exhibition_img.exhibition_img, exhibition_img.img_main FROM collect_exhibition JOIN exhibition ON collect_exhibition.exhibition_id = exhibition.id JOIN exhibition_img ON collect_exhibition.exhibition_id = exhibition_img.exhibition_id WHERE collect_exhibition.customer_id = ? AND exhibition_img.img_main= 1 ORDER BY collect_exhibition.id DESC;';

  let [exhibition] = await pool.execute(sql2, [req.params.userId]);

  res.json(exhibition);
});

// localhost:3003/api/fav/blog/:userId
router.get('/blog/:userId', async (req, res, next) => {
  const sql2 =
    'SELECT collect_blog.*, blog.title, blog.article_context , blog.image FROM collect_blog JOIN blog ON collect_blog.blog_id = blog.id WHERE collect_blog.customer_id = 1 ORDER BY collect_blog.id DESC';

  let [blog] = await pool.execute(sql2, [req.params.userId]);

  res.json(blog);
});

// localhost:3003/api/fav/product/:userId
router.get('/product/:userId', async (req, res, next) => {
  const sql2 =
    'SELECT collect_product.*, product.product_name, product.price, product.image FROM collect_product JOIN product ON collect_product.product_id = product.id WHERE collect_product.customer_id = ? ORDER BY collect_product.id DESC';

  let [product] = await pool.execute(sql2, [req.params.userId]);

  res.json(product);
});

// localhost:3003/api/fav/product/check
router.get('/product/check/:userId/:productId', async (req, res, next) => {
  const sql = 'SELECT * FROM collect_product WHERE customer_id = ? AND product_id = ?';

  let [fav] = await pool.execute(sql, [req.params.userId, req.params.productId]);

  res.json(fav);
});
// localhost:3003/api/fav/activity/check
router.get('/activity/check/:userId/:exId', async (req, res, next) => {
  const sql = 'SELECT * FROM collect_exhibition WHERE customer_id = ? AND exhibition_id = ?';

  let [fav] = await pool.execute(sql, [req.params.userId, req.params.exId]);

  res.json(fav);
});

module.exports = router;
