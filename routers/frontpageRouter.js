const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// 首頁主頁
// localhost:3003/api/front

// 質感商品
router.get('/product',async(req,res,next)=> {
    const sql = `
    SELECT * FROM product WHERE id IN ( SELECT customer_order_detail.product_id FROM customer_order
        INNER JOIN customer_order_detail ON customer_order.id = customer_order_detail.id
        GROUP BY customer_order_detail.product_id
        )
        ORDER BY (
        SELECT SUM(customer_order_detail.amount) FROM customer_order 
        INNER JOIN customer_order_detail ON customer_order.id = customer_order_detail.id
        WHERE customer_order_detail.product_id = product.id
        GROUP BY customer_order_detail.product_id
        ) DESC;`
        let [frontproduct] = await pool.execute(sql);
        res.json(frontproduct);
})

// 精選品牌
router.get('/brand',async(req,res,next)=> {
    const sql = 'SELECT id , business_name, logo FROM vendor'
        let [frontbrand] = await pool.execute(sql);
        res.json(frontbrand);
})
// 文章
router.get('/article',async(req,res,next)=> {
    const sql = 'SELECT id , title, image FROM blog'
        let [frontarticle] = await pool.execute(sql);
        res.json(frontarticle);
})
module.exports = router;