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
// 進入文章的內文
router.get('/Magzarticle/:articleId', async (req,res,next)=>{
    const sql = 'SELECT blog.title, blog.article_context, blog.image, author.author_name, create_time FROM `blog` INNER JOIN `author` ON blog.author_id = author.id WHERE blog.id = ?;'
    let [article] = await pool.execute(sql, [req.params.articleId]);
    res.json({
        articleTitle:article[0].title,
        createTime:article[0].create_time,
        articleContext:article[0].article_context,
        author:article[0].author_name,
        image:article[0].image
    })
})
module.exports = router;