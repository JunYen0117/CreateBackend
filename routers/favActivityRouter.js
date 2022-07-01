const express = require('express');
const router = express.Router();
const pool = require('../utils/database');


// Delete 收藏品
// localhost:3003/api/favactivity/del/:userId/:exId
router.get('/del/:userId/:exId', async (req, res, next) => {
  const sql2 = 'DELETE FROM collect_exhibition WHERE customer_id = ? AND exhibition_id = ?';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.exId]); 

  res.json({code: 0 , message: '刪除成功'})
});

// Add 收藏品
// localhost:3003/api/favactivity/add/:userId/:exId
router.get('/add/:userId/:exId', async (req, res, next) => {
  const sql2 = 'INSERT INTO collect_exhibition (customer_id, exhibition_id) VALUES (?,?)';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.exId]); 

  res.json({code: 0 , message: '加入成功'})
});

// localhost:3003/api/favactivity/:userId
router.get('/:userId', async (req, res, next) => {
  const sql2 =
    'SELECT collect_exhibition.*, exhibition.exhibition_name, exhibition.exhibition_price, exhibition.start_date, exhibition.end_date, exhibition.start_time, exhibition.end_time, exhibition.exhibition_location FROM collect_exhibition JOIN exhibition ON collect_exhibition.exhibition_id = exhibition.id WHERE collect_exhibition.customer_id = ? ORDER BY collect_exhibition.id DESC';

  let [exhibition] = await pool.execute(sql2, [req.params.userId]);

  res.json(exhibition);
});

// localhost:3003/api/favactivity
router.get('/', async (req, res, next) => {
  const sql2 =
    'SELECT collect_exhibition.*, exhibition.exhibition_name, exhibition.exhibition_price, exhibition.start_date, exhibition.end_date, exhibition.start_time, exhibition.end_time, exhibition.exhibition_location FROM collect_exhibition JOIN exhibition ON collect_exhibition.exhibition_id = exhibition.id WHERE collect_exhibition.customer_id = 1';

  
  let [exhibition] = await pool.execute(sql2);

  res.json(exhibition);
});

module.exports = router;
