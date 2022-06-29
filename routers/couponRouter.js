const express = require('express');
const router = express.Router();
const pool = require('../utils/database');
const checkConToller = require('../utils/checkLogin');

// 撈出全部的優惠券 (coupon_send_status=1)
// localhost:3003/api/coupons/available?page=1
router.get('/available', async (req, res, next) => {
  console.log('優惠券列表');

  let page = req.query.page || 1;
  console.log('current page', page);

  let [couponList] = await pool.execute('SELECT * FROM coupon WHERE coupon.id NOT IN (SELECT coupon_id from coupon_take where customer_id=1) AND coupon_send_status=1;');

  const total = couponList.length;

  console.log('total:', total);

  const perPage = 3; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);
  console.log('lastPage:', lastPage);

  let offset = (page - 1) * perPage;
  console.log('offset:', offset);

  let [pageCouponList] = await pool.execute('SELECT * FROM coupon WHERE coupon.id NOT IN (SELECT coupon_id from coupon_take where customer_id=1) AND coupon_send_status=1 LIMIT ? OFFSET ?', [perPage, offset]);

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

// 合併登入後再打開這個版本測試
// // 撈出可領取的優惠券(使用者沒有的)
// // localhost:3003/api/coupons
// router.get("/get", checkConToller.checkLogin, async (req, res, next) => {
//   const serverUserData = req.session;
//     let [couponList] = await pool.execute(
//       "SELECT * FROM coupon WHERE coupon.id NOT IN (SELECT coupon_id from coupon_take where customer_id=?) AND coupon_send_status=1;",
// [serverUserData.customer.id]
//     );
  
//     res.json(couponList);
// });


// 測試用版本--Get
// 使用者擁有的優惠券
// localhost:3003/api/coupons/receive
router.get("/receive", async (req, res, next) => {
  const serverUserData = req.session;
    let [couponList] = await pool.execute(
      "SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id=1 AND coupon_status=1;",
    );
    res.json(couponList);
});

// 合併登入後再打開這個版本測試--Post
// // 使用者擁有的優惠券
// // localhost:3003/api/coupons/receive
// router.post("/receive",  checkConToller.checkLogin, async (req, res, next) => {
//   const serverUserData = req.session;
//     let [couponList] = await pool.execute(
//       "SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id=? AND coupon_status=1;",
//       [serverUserData.customer.id]
//     );
//     res.json(couponList);
// });


// 測試用版本--Get
// 使用者擁有的優惠券但已失效
// // localhost:3003/api/coupons/invalid
router.get("/invalid", async (req, res, next) => {
  const serverUserData = req.session;
    let [couponList] = await pool.execute(
      "SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id=1 AND coupon_status=0;",
    );
    res.json(couponList);
});

// 合併登入後再打開這個版本測試--Post
// // 使用者擁有的優惠券但已失效
// // localhost:3003/api/coupons/invalid
// router.post("/invalid", checkConToller.checkLogin, async (req, res, next) => {

//   const serverUserData = req.session;
//     let [couponList] = await pool.execute(
//       "SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id=? AND coupon_status=0;",
//       [serverUserData.customer.id]
//     );
//     res.json(couponList);
// });



//領取優惠券
router.post("/post", async (req, res, next) => {
  const date = new Date();

  let [couponList] = await pool.execute(
    "INSERT INTO coupon_take (customer_id ,coupon_id,coupon_status,take_time)) VALUE (?,?,?,?)",
    [req.body.customer_id, req.body.coupon_id, date, 1]
  );

  let [couponListNew] = await pool.execute(
    "UPDATE coupon SET quota = quota-1 where id = ? ",
    [req.body.coupon_id]
  );

  res.json({
    msg: "ok",
  });
});

// 單一優惠券的分頁 
// router.get('/:couponNum', async (req, res, next) => {
// 取得網址上的參數 req.params
// req.params.couponNum
//   console.log('get coupon by id', req.params);

//   let page = req.query.page || 1;
//   console.log('current page', page);

// 2. 取得目前的總筆數
// (這邊可能要改寫一下， 優惠券編碼是不需要做分頁的)
//   let [allResults] = await pool.execute('SELECT * FROM coupon WHERE coupon_no = ?', [req.params.couponNum]);
//   const total = allResults.length;
//   console.log('total:', total);

// 3. 計算總共有幾頁
// Math.ceil 1.1 => 2   1.05 -> 2
//   const perPage = 2; // 每一頁有幾筆
//   const lastPage = Math.ceil(total / perPage);
//   console.log('lastPage:', lastPage);

// 4. 計算 offset 是多少（計算要跳過幾筆）
// 在第五頁，就是要跳過 4 * perPage
//   let offset = (page - 1) * perPage;
//   console.log('offset:', offset);

// 5. 取得這一頁的資料 select * from table limit ? offet ?
// let [pageCoupons] = await pool.execute('SELECT * FROM coupon WHERE coupon_no = ? ORDER BY id DESC LIMIT ? OFFSET ?', [req.params.couponNum, perPage, offset]);

// 6. 回覆給前端
//   res.json({
// 用來儲存所有跟頁碼有關的資訊
//     pagination: {
//       total,
//       lastPage,
//       page,
//     },
// 真正的資料
//     couponList: pageCoupons,
//   });
// });

module.exports = router;
