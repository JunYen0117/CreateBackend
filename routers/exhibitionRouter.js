const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product
router.get('/', async (req, res, next) => {
  const sql = 'SELECT exhibition.id, exhibition.exhibition_name, exhibition.city, exhibition.longitude,exhibition.latitude,exhibition.exhibition_intro,exhibition.exhibition_price,exhibition.start_date,exhibition.end_date,exhibition_img.exhibition_img FROM exhibition JOIN exhibition_img ON exhibition_img.exhibition_id = exhibition.id AND exhibition_img.img_main=1'
  

  let [exhibition] = await pool.execute(sql);

  res.json(exhibition);
 
});

router.get('/:exhibitionId', async (req, res, next) => {
  const sql = 'SELECT * FROM exhibition  WHERE exhibition.id = ?'
  let [exhibition] = await pool.execute(sql, [req.params.exhibitionId]);
  res.json(exhibition);
});

// // localhost:3003/api/product/classification
// router.get('/classification', async (req, res, next) => {
//   const sql = 'SELECT * FROM classification'
//   const [classification] = await pool.execute(sql);
//   res.json(classification);
// });

// // localhost:3003/api/product/classification/1
// router.get('/classification/:classificationId', async (req, res, next) => {
//   const sql = 'SELECT * FROM category WHERE classification_id = ?'
//   let [category] = await pool.execute(sql, [req.params.classificationId]);
//   res.json(category);
// });



module.exports = router;