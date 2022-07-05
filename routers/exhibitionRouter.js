const express = require('express');
const router = express.Router();
const pool = require('../utils/database');


// localhost:3003/api/exhibition
router.get('/', async (req, res, next) => { //商品頁

  let SelectArea='';
  if((req.query.area)!==''){ //設定篩選地區
    SelectArea=`AND area = '${req.query.area}'`
    // console.log(SelectArea);
  }else{
    SelectArea=''
  }

  let today = new Date().toLocaleDateString()
  let selectdate = new Date()
  if((req.query.date)!==''){  //設定篩選時間區間
    selectdate.setMonth(selectdate.getMonth()+Number(req.query.date));
    selectdate=selectdate.toLocaleDateString();
  }else{
    selectdate.setFullYear(selectdate.getFullYear()+10);
    selectdate=selectdate.toLocaleDateString();
  }

  let minPrice = 0;
  let maxPrice = 1000;
  switch (req.query.level) { //設定篩選價錢區間
    case '1':
      minPrice = 0;
      maxPrice = 150;
      break;
    case '2':
      minPrice = 150;
      maxPrice = 300;
      break;
    case '3':
      minPrice = 300;
      maxPrice = 10000;
      break;
    default:
      minPrice = 0;
      maxPrice = 1000;
      break;
  }

  
  //TODO: 灌資料

  const sql = `SELECT exhibition.id, exhibition.exhibition_name, exhibition.city, exhibition.longitude,exhibition.latitude,exhibition.exhibition_intro,exhibition.exhibition_price,exhibition.start_date,exhibition.end_date,exhibition_img.exhibition_img FROM exhibition JOIN exhibition_img ON exhibition_img.exhibition_id = exhibition.id AND exhibition_img.img_main=1 WHERE exhibition_price > ? AND exhibition_price <= ? AND start_date <= ? AND ? <= end_date ${SelectArea}`
  
  let [exhibition] = await pool.execute(sql, [minPrice, maxPrice,selectdate,today]);

  exhibition.map((item,index)=>{
    item.start_date=(item.start_date).replace(/-/g,'/')
    item.end_date=(item.end_date).replace(/-/g,'/')
  })
 
  res.json(exhibition);
 
});

router.get('/:exhibitionId', async (req, res, next) => { //商品詳細頁
  const sql = 'SELECT * FROM exhibition  WHERE exhibition.id = ?'
  let [exhibition] = await pool.execute(sql, [req.params.exhibitionId]);

  const sql2 = 'SELECT exhibition_img.exhibition_img FROM exhibition JOIN exhibition_img ON exhibition_img.exhibition_id = exhibition.id WHERE exhibition.id = ?'
  let [exhibitionImg] = await pool.execute(sql2, [req.params.exhibitionId]);
  exhibition.map((item,index)=>{
    let startTime=item.start_time.toString()
    let endTime=item.end_time.toString()
    item.start_time=startTime.slice(0,5)
    item.end_time=endTime.slice(0,5)
    item.start_date=(item.start_date).replace(/-/g,'/')
    item.end_date=(item.end_date).replace(/-/g,'/')
   
  })
  res.json({
    exhibition: exhibition,
    image: exhibitionImg,
  });
});

module.exports = router;