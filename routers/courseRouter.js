const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/product
router.get('/', async (req, res, next) => {
  const sql = 'SELECT course.id, course.course_name, course.city, course.longitude,course.latitude,course_intro, course_item.course_price FROM course JOIN course_item ON course_item.course_id = course.id'
  

  let [course] = await pool.execute(sql);

  res.json(course);
 
});




module.exports = router;