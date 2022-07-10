// 套件引用
const express = require('express');
const router = express.Router();

// 連接資料庫
const pool = require('../utils/database');
const checkConToller = require('../utils/checkLogin');

router.use((req, res, next) => {
  // console.log('request is coming couponRouter');
  next();
});

// 新戶的優惠券
// 加入的 (1.6)
//localhost:3003/api/coupons/available/new/:customer_id
router.get('/available/new/:customer_id', async (req, res, next) => {
  let [couponOne] = await pool.execute('INSERT INTO coupon_take (customer_id, coupon_id, coupon_status) VALUES (?,?,?),(?,?,?)', [
    req.params.customer_id,
    1,
    1,
    req.params.customer_id,
    6,
    1,
  ]);
 
  res.json({ code: 0, message: '註冊成功' });
});

// 撈出使用者全部可領取的優惠券 (coupon_send_status=1)
// localhost:3003/api/coupons/available?page=1
router.get('/available/:customer_id', async (req, res, next) => {
  let page = req.query.page || 1;
  // console.log('current page', page);

  let [availableList] = await pool.execute(
    'SELECT * FROM coupon WHERE id NOT IN  (SELECT coupon_id from coupon_take where customer_id= ?) AND coupon_send_type=2 ORDER BY `discount` ASC',
    [req.params.customer_id]
  );
  // console.log('撈出使用者全部可領取的優惠券:可領取的優惠券列表',availableList );

  const total = availableList.length;
  // console.log('total:', total);

  const perPage = 2; // 每一頁有幾筆
  const lastPage = Math.ceil(total / perPage);
  // console.log('lastPage:', lastPage);

  let offset = (page - 1) * perPage;
  // console.log('offset:', offset);

  let [pageAvailableList] = await pool.execute(
    'SELECT * FROM coupon WHERE coupon.id NOT IN (SELECT coupon_id from coupon_take where customer_id= ?) AND coupon_send_type=2 ORDER BY `discount` ASC LIMIT ? OFFSET ?',
    [req.params.customer_id, perPage, offset]
  );

  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      total,
      lastPage,
      page,
      offset,
    },
    // 真正的資料
    availableList: pageAvailableList,
  });
  // console.log(availableList);
});

// 撈出全部使用者可使用的優惠券
// localhost:3003/api/coupons/receive/:customer_id?page=1
router.get('/receive/:customer_id', async (req, res, next) => {
  // console.log('撈出全部使用者可使用的優惠券:可使用的優惠券列表');

  let receivePage = req.query.page || 1;
  // console.log('current receivePage', receivePage);

  let [receiveList] = await pool.execute('SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id= ? AND coupon_status=1 ORDER BY `discount` ASC', [
    req.params.customer_id,
  ]);
  // console.log('receiveList:', receiveList);

  const receiveTotal = receiveList.length;
  // console.log('receiveTotal:', receiveTotal);

  const receivePerPage = 2; // 每一頁有幾筆
  const receiveLastPage = Math.ceil(receiveTotal / receivePerPage);
  // console.log('lastPage:', receiveLastPage);

  let receiveOffset = (receivePage - 1) * receivePerPage;
  // console.log('receiveOffset:', receiveOffset);

  let [pageReceiveList] = await pool.execute(
    'SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id= ? AND coupon_status=1 ORDER BY `discount` ASC LIMIT ? OFFSET ?',
    [req.params.customer_id, receivePerPage, receiveOffset]
  );

  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      receiveTotal,
      receiveLastPage,
      receivePage,
      receiveOffset,
    },
    // 真正的資料
    receiveList: pageReceiveList,
  });
  // console.log('receiveList:', receiveList);
});

// 已失效優惠券(優惠券過期)
// localhost:3003/api/coupons/updateCoupon
router.get('/updateCoupon', async (req, res, next) => {
  let [updateCoupon] = await pool.execute('SELECT * FROM coupon_take right JOIN coupon on coupon_id = coupon.id where  coupon_end_period < CURDATE() ORDER BY `coupon_id` ASC');
  // console.log('updateCoupon:', updateCoupon);

  let updateCouponStatus = [];

  for (let i = 0; i < updateCoupon.length; i++) {
    [updateCouponStatus] = await pool.execute('UPDATE coupon_take SET coupon_status = "0" WHERE coupon_id = ? ', [updateCoupon[i].coupon_id]);
    // console.log('updateCouponStatus:', updateCouponStatus);
  }

  res.json({
    updateCoupon,
    updateCouponStatus, // 更新優惠券狀態
    msg: '更新成功',
  });
});

// 撈出全部使用者擁有的優惠券但已失效
// localhost:3003/api/coupons/invalid?page=1
router.get('/invalid/:customer_id', async (req, res, next) => {
  // console.log('使用者擁有的優惠券但已失效：已失效的優惠券列表');

  let invalidPage = req.query.page || 1;
  // console.log('current invalidPage', invalidPage);

  let [invalidList] = await pool.execute('SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id= ? AND coupon_status=0 ORDER BY `discount` ASC', [
    req.params.customer_id,
  ]);
  const invalidTotal = invalidList.length;

  // console.log('invalidTotal:', invalidTotal);

  const invalidPerPage = 2; // 每一頁有幾筆
  const invalidLastPage = Math.ceil(invalidTotal / invalidPerPage);
  // console.log('invalidLastPage:', invalidLastPage);

  let invalidOffset = (invalidPage - 1) * invalidPerPage;
  // console.log('invalidOffset:', invalidOffset);

  let [pageInvalidList] = await pool.execute(
    'SELECT * FROM coupon right JOIN coupon_take on coupon.id = coupon_id where customer_id= ? AND coupon_status=0 ORDER BY `discount` ASC LIMIT ? OFFSET ?',
    [req.params.customer_id, invalidPerPage, invalidOffset]
  );

  res.json({
    // 用來儲存所有跟頁碼有關的資訊
    pagination: {
      invalidTotal,
      invalidLastPage,
      invalidPage,
      invalidOffset,
    },
    // 真正的資料
    invalidList: pageInvalidList,
  });
  // console.log('invalidList:', invalidList);
});

// 領取優惠券
// localhost:3003/api/coupons/insertCoupon;
router.post('/insertCoupon', async (req, res, next) => {
  const date = new Date();

  // console.log(req.body);
  // 正式用版本--資料庫
  let [insertCoupon] = await pool.execute('INSERT INTO coupon_take (customer_id ,coupon_id,coupon_status,take_time) VALUE (?,?,?,?)', [
    req.body.customer_id,
    req.body.coupon_id,
    1,
    date,
  ]);

  let [updateCoupon] = await pool.execute('UPDATE coupon SET quota = quota-1, take_count = take_count+1  where id = ? AND quota>0', [req.body.coupon_id]);

  res.json({
    insertCoupon, // 領取的優惠券
    updateCoupon, // 更新優惠券數量
    msg: '領取成功',
  });
});

// postman 用的測試資料
// [
//   {
//  "customer_id":2,
//   "coupon_id":7
//   },
//   {
//  "customer_id":2,
//   "coupon_id":8
//   },
//   {
//  "customer_id":2,
//   "coupon_id":9
//   }
// ]

// postman上 res.json 的結果
// {
// "updateCoupon": [
//     {
//         "id": 3,
//         "coupon_name": "年中慶優惠折抵200",
//         "coupon_no": "7",
//         "coupon_send_type": 3,
//         "coupon_min_cost": 2500,
//         "discount": 200,
//         "quota": 1,
//         "take_count": 0,
//         "used_count": 0,
//         "send_start_time": "2022-06-10 00:00:01",
//         "send_end_time": "2022-06-30 23:59:59",
//         "coupon_start_period": "2022-06-10 00:00:01",
//         "coupon_end_period": "2022-06-30 23:59:59",
//         "coupon_send_status": 1,
//         "create_time": "2022-06-10 00:00:01",
//         "customer_id": 2,
//         "coupon_id": 7,
//         "coupon_status": 1,
//         "take_time": "2022-06-22 11:56:53"
//     },
//     {
//         "id": 4,
//         "coupon_name": "年中慶優惠折抵100",
//         "coupon_no": "8",
//         "coupon_send_type": 3,
//         "coupon_min_cost": 1500,
//         "discount": 100,
//         "quota": 1,
//         "take_count": 0,
//         "used_count": 0,
//         "send_start_time": "2022-06-10 00:00:01",
//         "send_end_time": "2022-06-30 23:59:59",
//         "coupon_start_period": "2022-06-10 00:00:01",
//         "coupon_end_period": "2022-06-30 23:59:59",
//         "coupon_send_status": 1,
//         "create_time": "2022-06-10 00:00:01",
//         "customer_id": 2,
//         "coupon_id": 8,
//         "coupon_status": 1,
//         "take_time": "2022-06-22 11:56:53"
//     },
//     {
//         "id": 6,
//         "coupon_name": "畢業季優惠折抵200元",
//         "coupon_no": "9",
//         "coupon_send_type": 3,
//         "coupon_min_cost": 2500,
//         "discount": 200,
//         "quota": 1,
//         "take_count": 0,
//         "used_count": 0,
//         "send_start_time": "2022-06-01 00:00:01",
//         "send_end_time": "2022-06-30 23:59:59",
//         "coupon_start_period": "2022-06-01 00:00:01",
//         "coupon_end_period": "2022-06-30 23:59:59",
//         "coupon_send_status": 1,
//         "create_time": "2022-06-01 00:00:01",
//         "customer_id": 2,
//         "coupon_id": 9,
//         "coupon_status": 1,
//         "take_time": "2022-06-22 11:57:44"
//     }
//   ],
//   "msg": "更新成功"
// }

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

// 5. 取得這一頁的資料 select * from table limit ? offset ?
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
