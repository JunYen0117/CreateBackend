const express = require('express');
const router = express.Router();
const pool = require('../utils/database.js');
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

// http://localhost:3003/api/member/editprofile
router.post('/editprofile', uploader.single('avatar'), async (req, res, next) => {
  // 圖片處理完成後，會被放在 req 物件裡
  // console.log('req.file', req.file);
  // console.log('req.body', req.body);

  let avatar = req.file ? '/members/' + req.file.filename : '';

  let [result] = await pool.execute('UPDATE customer SET avatar=?, member_name=?, phone=?, address=?, gender=?, age=? WHERE id=?', [avatar, req.body.member_name, req.body.phone, req.body.address, req.body.gender, req.body.age, req.body.id]);

  res.json({ message: '更新成功'});
});

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
