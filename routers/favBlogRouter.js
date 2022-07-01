const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// Delete 收藏品
// localhost:3003/api/favblog/del/:userId/:blogId
router.get('/del/:userId/:blogId', async (req, res, next) => {
  const sql2 = 'DELETE FROM collect_blog WHERE customer_id = ? AND blog_id = ?';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.blogId]); 

  res.json({code: 0 , message: '刪除成功'})
});

// Add 收藏品
// localhost:3003/api/favblog/add/:userId/:blogId
router.get('/add/:userId/:blogId', async (req, res, next) => {
  const sql2 = 'INSERT INTO collect_blog (customer_id, blog_id) VALUES (?,?)';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.blogId]); 

  res.json({code: 0 , message: '加入成功'})
});

// localhost:3003/api/favblog/:userId
router.get('/:userId', async (req, res, next) => {
  const sql2 =
    'SELECT collect_blog.*, blog.title, blog.article_context , blog.image FROM collect_blog JOIN blog ON collect_blog.blog_id = blog.id WHERE collect_blog.customer_id = 1 ORDER BY collect_blog.id DESC';

  let [blog] = await pool.execute(sql2, [req.params.userId]);

  res.json(blog);
});

// localhost:3003/api/favblog
router.get('/', async (req, res, next) => {
  const sql2 =
    'SELECT collect_blog.* , blog.title, blog.article_context, blog.image FROM collect_blog JOIN blog ON collect_blog.blog_id = blog.id WHERE collect_blog.customer_id = 1';

  
  let [blog] = await pool.execute(sql2);

  res.json(blog);
});

module.exports = router;
