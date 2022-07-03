const express = require('express');
const router = express.Router();
const pool = require('../utils/database.js');
// 驗證資料
const { body, validationResult } = require('express-validator');
// 密碼雜湊
const bcrypt = require('bcrypt');
// 處理文件上傳
const multer = require('multer');
// 內建設定路徑的方式
const path = require('path');

// 圖片上傳需要地方放，在 public 裡，建立 members 放圖片
// 設定圖片儲存的位置
const storage = multer.diskStorage({
  // 設定儲存的目的地 (檔案夾) ../public/members
  destination: function (req, file, cb) {
    // cb(callback) 第二個參數 放 檔案路徑
    cb(null, path.join(__dirname, '..', 'public', 'members'));
  },
  // 重新命名使用者上傳的圖片名稱
  filename: function (req, file, cb) {
    // console.log('multer filename', file);
    // 取出圖片副檔名
    let ext = file.originalname.split('.').pop();
    // 將圖片檔名 以 Date.now() 重新命名
    let newFilename = `${Date.now()}.${ext}`;
    cb(null, newFilename);
    // file = {
    //   fieldname: 'photo',
    //   originalname: 'japan04-200.jpg',
    //   encoding: '7bit',
    //   mimetype: 'image/jpeg'
    // }
  },
});

const uploader = multer({
  // 設定儲存的位置
  storage: storage,
  // 過濾圖片 (限制副檔名)
  fileFilter: function(req, file, cb) {
    if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png' && file.mimetype !== 'image/webp') {
      // 錯誤訊息
      cb('這些是不被接受的格式', false);
    } else {
      // 格式正確
      cb(null, true);
    }
  },
  // 檔案尺寸的過濾
  limits: {
    // 1k = 1024 ; 200 k
    fileSize: 200 * 1024,
  }
});

// http://localhost:3003/api/member/edit/profile
router.post('/edit/profile', uploader.single('avatar'), async (req, res, next) => {
  // 圖片處理完成後，會被放在 req 物件裡
  // console.log('req.file', req.file);
  // console.log('req.body', req.body);

  let avatar = req.file ? '/members/' + req.file.filename : '';

  // 如果有更換大頭貼，才更新大頭貼
  if(!avatar){
    let [result] = await pool.execute('UPDATE customer SET member_name=?, phone=?, address=?, gender=?, age=? WHERE id=?', [req.body.member_name, req.body.phone, req.body.address, req.body.gender, req.body.age, req.body.id]);
  }else{
    let [result] = await pool.execute('UPDATE customer SET avatar=?, member_name=?, phone=?, address=?, gender=?, age=? WHERE id=?', [avatar, req.body.member_name, req.body.phone, req.body.address, req.body.gender, req.body.age, req.body.id]);    
  }

  res.json({ message: '更新成功'});
});


const passwordRules = [
  body('newPassword').isLength({min: 3}).withMessage('密碼長度至少為3'),
  body('confirmNewPassword')
    .custom((value, { req }) => {
      // 驗證規則
      return value === req.body.newPassword;
    })
    .withMessage('密碼驗證不一致'),
];

// http://localhost:3003/api/member/password/change
router.post('/password/change', passwordRules, async (req, res, next) => {
  // 確定收到前端送來的資料
  console.log('form', req.body);

  // 拿到驗證結果
  const validateResults = validationResult(req);
  console.log('validateResults', validateResults);

  // 表單資料 驗證失敗 的情況，如果 驗證成功 會是 空的
  if(!validateResults.isEmpty()) {
    // 不是 empty --> 表示有不符合 --> 表示驗證失敗
    let error = validateResults.array();
    return res.status(400).json({error: error[0].msg});
  }

  let [customer] = await pool.execute('SELECT * FROM customer WHERE id = ?', [req.body.userID])

  // console.log(customer);

  // 比對 密碼是否輸入正確
  let passwordCompareResult = await bcrypt.compare(req.body.oldPassword, customer[0].password);

  // console.log(passwordCompareResult);

  if (passwordCompareResult === false) {
    return res.status(400).json({ error: '密碼錯誤' });
  }

  // 雜湊新的密碼
  let hashNewPassword = await bcrypt.hash(req.body.newPassword, 10);

  // 更新密碼
  let [result] = await pool.execute('UPDATE customer SET password = ? WHERE id = ?', [hashNewPassword, req.body.userID])

  res.json({message: 'change password'});
})


// http://localhost:3003/api/member/info
router.get('/info', async (req, res, next) => {
  if (req.session.customer) {
    // 表示登入過
    const sql = 'SELECT id, account, member_name, phone, address, gender, age, avatar FROM customer WHERE id = ?';
    const [user] = await pool.execute(sql, [req.session.customer.id]);
    return res.json({ customer: user[0], status: 1 });
  } else {
    // 表示尚未登入
    return res.status(403).json({ code: 2005, error: '狀態是沒有登入', status: 0 });
  }
});


module.exports = router;
