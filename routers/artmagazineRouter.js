const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// 文章
// localhost:3003/api/artmagazine
router.get('/', async (req, res, next) => {
    const sql = 'SELECT blog.*, author.author_name FROM blog JOIN author ON blog.author_id = author.id'
    let [artmagzs] = await pool.execute(sql);
    res.json(artmagzs);
});

module.exports = router;