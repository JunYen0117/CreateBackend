const express = require('express');
const router = express.Router();
const pool = require('../utils/database.js');

// http://localhost:3003/api/member/info

router.get('/info', async (req, res, next) => {
  if (req.session.customer) {
    // 表示登入過
    const sql = 'SELECT * FROM customer WHERE id = ?';
    const [user] = await pool.execute(sql, [req.session.customer.id]);
    return res.json({ customer: user[0], status: 1 });
  } else {
    // 表示尚未登入
    return res.status(403).json({ code: 2005, error: '狀態是沒有登入', status: 0 });
  }
});

module.exports = router;
