const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

router.get('/', async (req, res, next) => {

  let state = req.query.state || 1;
  //state 0 =已結束
  //state 1 =已報名
  //state 2 =已使用
  // console.log('state', state);

    const sql = 'SELECT exhibition_order.id,exhibition_order.state,exhibition_order.count,exhibition_order.total,exhibition.exhibition_name,exhibition.start_date,exhibition.end_date,exhibition.start_time,exhibition.end_time,exhibition.exhibition_location,exhibition_img.exhibition_img FROM exhibition_order JOIN exhibition ON exhibition.id = exhibition_order.exhibition_id JOIN exhibition_img ON exhibition_img.exhibition_id = exhibition_order.exhibition_id AND exhibition_img.img_main=1 WHERE customer_id = 1 AND state = ?'
    
  
  
    let [activity] = await pool.execute(sql, [state]);
  
    res.json(activity);
   
  });

  // UPDATE `exhibition_order` SET `state` = '0' WHERE `exhibition_order`.`id` = 7;
module.exports = router;
