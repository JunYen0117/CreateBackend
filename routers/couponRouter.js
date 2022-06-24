const express = require('express');
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/coupon?page=1
router.get('/', async (req, res, next) => {
  console.log('優惠券列表');

  let page = req.query.page || 1;
  console.log('current page', page);

  let [couponList] = await pool.execute('SELECT * FROM coupon');
  const total = couponList.length;

  console.log('total:', total);

  const perPage = 2; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);
  console.log('lastPage:', lastPage);

  let offset = (page - 1) * perPage;
  console.log('offset:', offset);

  let [pageCouponList] = await pool.execute('SELECT * FROM coupon LIMIT ? OFFSET ?', [perPage, offset]);

  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      total,
      lastPage,
      page,
    },
    // 真正的資料
    couponList: pageCouponList,
  });

});

// 單一優惠券的分頁 
// router.get('/:couponNum', async (req, res, next) => {
//   // 取得網址上的參數 req.params
//   // req.params.couponNum
//   console.log('get coupon by id', req.params);

//   let page = req.query.page || 1;
//   console.log('current page', page);

//   // 2. 取得目前的總筆數
//   // (這邊可能要改寫一下， 優惠券編碼是不需要做分頁的)
//   let [allResults] = await pool.execute('SELECT * FROM coupon WHERE coupon_no = ?', [req.params.couponNum]);
//   const total = allResults.length;
//   console.log('total:', total);

//   // 3. 計算總共有幾頁
//   // Math.ceil 1.1 => 2   1.05 -> 2
//   const perPage = 2; // 每一頁有幾筆
//   const lastPage = Math.ceil(total / perPage);
//   console.log('lastPage:', lastPage);

//   // 4. 計算 offset 是多少（計算要跳過幾筆）
//   // 在第五頁，就是要跳過 4 * perPage
//   let offset = (page - 1) * perPage;
//   console.log('offset:', offset);

//   // 5. 取得這一頁的資料 select * from table limit ? offet ?
//   let [pageCoupons] = await pool.execute('SELECT * FROM coupon WHERE coupon_no = ? ORDER BY id DESC LIMIT ? OFFSET ?', [req.params.couponNum, perPage, offset]);

//   // 6. 回覆給前端
//   res.json({
//     // 用來儲存所有跟頁碼有關的資訊
//     pagination: {
//       total,
//       lastPage,
//       page,
//     },
//     // 真正的資料
//     couponList: pageCoupons,
//   });
// });

module.exports = router;
