const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// Delete 收藏ㄆㄧㄣ
// localhost:3003/api/favproduct/del/:userId/:prdId
router.get('/del/:userId/:prdId', async (req, res, next) => {
  const sql2 = 'DELETE FROM collect_product WHERE customer_id = ? AND product_id = ?';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.prdId]); 

  res.json({code: 0 , message: '刪除成功'})
});

// Add 收藏品
// localhost:3003/api/favproduct/add/:userId/:prdId
router.get('/add/:userId/:prdId', async (req, res, next) => {
  const sql2 = 'INSERT INTO collect_product (customer_id, product_id) VALUES (?,?)';

  let [data] = await pool.execute(sql2, [req.params.userId, req.params.prdId]); 

  res.json({code: 0 , message: '加入成功'})
});

// localhost:3003/api/favproduct/:userId
router.get('/:userId', async (req, res, next) => {
  const sql2 =
    'SELECT collect_product.*, product.product_name, product.price, product.image FROM collect_product JOIN product ON collect_product.product_id = product.id WHERE collect_product.customer_id = ?';

  let [product] = await pool.execute(sql2, [req.params.userId]);

  res.json(product);
});

// localhost:3003/api/favproduct
router.get('/', async (req, res, next) => {
  const sql2 =
    'SELECT collect_product.*, product.product_name, product.price, product.image FROM collect_product JOIN product ON collect_product.product_id = product.id WHERE collect_product.customer_id = 1';

  let [product] = await pool.execute(sql2);

  res.json(product);
});

module.exports = router;
