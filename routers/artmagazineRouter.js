const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// 文章
// localhost:3003/api/artmagazine
router.get('/', async (req, res, next) => {

    let sql = '';
    let artmagzs = [];

    if(Number(req.query.status) === 1) {
        sql = 'SELECT blog.*, author.author_name FROM blog JOIN author ON blog.author_id = author.id WHERE blog.article_status = ?';
        [artmagzs] = await pool.execute(sql, [req.query.status]);
    } else {
        sql = 'SELECT blog.*, author.author_name FROM blog JOIN author ON blog.author_id = author.id';
        [artmagzs] = await pool.execute(sql);
    }

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

// 文章評論讀取
router.get('/comment/:articleId', async (req,res,next)=>{
    const sql = 'SELECT blog_comment.comment, customer.member_name, customer.avatar FROM blog_comment JOIN customer ON blog_comment.customer_id = customer.id WHERE blog_comment.blog_id = ? ORDER BY blog_comment.id DESC;'
    let [article] = await pool.execute(sql, [req.params.articleId]);
    res.json({
        comments: article,
    })
})

// 文章評論新增
router.post('/comment', async (req,res,next)=>{
    console.log(req.body.blog_id)
    await pool.execute('INSERT INTO blog_comment (`blog_id`, `customer_id`, `comment`) VALUES (?,?,?);', 
    [req.body.blog_id, req.body.customer_id, req.body.comment],(error, results) => {
     if (error) return res.json({ error: error });
     });
     res.json({
         state: "ok"
     })
    })


module.exports = router;