const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const expressSession = require('express-session');

let port = process.env.SERVER_PORT || 3003;

// 設定 session 要存在哪裡
let FileStore = require('session-file-store')(expressSession);
// 啟用 session，會存到CreateBackEnd 的外面
app.use(
  expressSession({
    store: new FileStore({
      path: path.join(__dirname, '..', 'sessions'),
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// 讓cors可以允許cookie跨源
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

// server.js能辨識req.body的內容
app.use(express.urlencoded({ extended: true }));
// server.js能辨識json格式的資料
app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('首頁');
});

// 會員大頭貼
// http://localhost:3003/images/members/1655005255714.jpg
app.use('/images/members', express.static(path.join(__dirname, 'public', 'members')));
// 商品圖片
// http://localhost:3003/images/product/1_1咖啡壺.jpg
app.use('/images/product', express.static(path.join(__dirname, 'public', 'img', 'products')));
//展覽圖片
app.use('/images/exhibition', express.static(path.join(__dirname, 'public', 'img', 'exhibition')));

// 品牌圖片
// http://localhost:3003/images/brand/red.jpg
app.use('/images/brand', express.static(path.join(__dirname, 'public', 'img', 'brands')));

// 雜誌圖片
// http://localhost:3003/images/artmagzs/
app.use('/images/artmagzs', express.static(path.join(__dirname, 'public', 'img', 'artmagzs')));

// Routers
// 購物商城
const productRouter = require('./routers/productRouter');
app.use('/api/product', productRouter);

// 首頁主頁
const frontRouter = require('./routers/frontpageRouter')
app.use('/api/front', frontRouter);

// 品牌頁 
const brandspageRouter = require('./routers/brandspageRouter')
app.use('/api/brandpage', brandspageRouter);

// 文章頁
const artmagazineRouter = require('./routers/artmagazineRouter')
app.use('/api/artmagazine', artmagazineRouter);

const courseRouter = require('./routers/courseRouter')
app.use('/api/course', courseRouter);

const exhibitionRouter = require('./routers/exhibitionRouter')
app.use('/api/exhibition', exhibitionRouter);

const activitypaymentRouter = require('./routers/activitypaymentRouter')
app.use('/api/activitypayment', activitypaymentRouter);

const activityRouter = require('./routers/activityRouter')
app.use('/api/activity', activityRouter);

// const signupRouter = require('./routers/signupRouter')
// app.use('/api/signup', signupRouter);
// 購物車
const cartRouter = require('./routers/cartRouter');
app.use('/api/cart', cartRouter);

// 訂單
const productOrderRouter = require('./routers/productOrderRouter');
app.use('/api/productorder', productOrderRouter);

// 收藏
<<<<<<< HEAD
const favRouter = require('./routers/favRouter');
app.use('/api/fav', favRouter);
=======
const favRouter = require ('./routers/favRouter')
app.use('/api/fav', favRouter)
>>>>>>> f5d31828c68d0d52d146d7c06d19619fa9e28881

// 評論
const commentRouter = require('./routers/commentRouter');
app.use('/api/comment', commentRouter);

// 登入註冊
const AuthRouter = require('./routers/authRouter');
app.use('/api/auth', AuthRouter);

// 會員
const memberRouter = require('./routers/memberRouter');
app.use('/api/member', memberRouter);

// Email
const emailRouter = require('./routers/emailRouter');
app.use('/api/email', emailRouter);

// 優惠券
const couponRouter = require('./routers/couponRouter');
app.use('/api/coupons', couponRouter);

app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
