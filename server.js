const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const expressSession = require('express-session');

let FileStore = require('session-file-store')(expressSession);
let port = process.env.SERVER_PORT || 3003;


// 啟用 session，會存到CreateBackEnd 的外面
// app.use(
//   expressSession({
//     store: new FileStore({
//       path: path.join(__dirname, '..', 'sessions'), 
//     }),
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   })
// );

// 讓cors可以允許cookie跨源
app.use(
  cors({
    origin: ['http://localhost:3000'],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res, next) => {
  res.send('首頁');
});

// 商品圖片
// http://localhost:3003/images/product/1_1咖啡壺.jpg
app.use('/images/product', express.static(path.join(__dirname, 'public', 'img', 'products')));
//展覽圖片
app.use('/images/exhibition', express.static(path.join(__dirname, 'public', 'img', 'exhibition')));

// Routers
const productRouter = require('./routers/productRouter')
app.use('/api/product', productRouter);

const courseRouter = require('./routers/courseRouter')
app.use('/api/course', courseRouter);

const exhibitionRouter = require('./routers/exhibitionRouter')
app.use('/api/exhibition', exhibitionRouter);

const activitypaymentRouter = require('./routers/activitypaymentRouter')
app.use('/api/activitypayment', activitypaymentRouter);

const activityRouter = require('./routers/activityRouter')
app.use('/api/activity', activityRouter);

const signupRouter = require('./routers/signupRouter')
app.use('/api/signup', signupRouter);

const loginRouter = require('./routers/loginRouter')
app.use('/api/login', loginRouter);

const memberRouter = require('./routers/memberRouter');
app.use('/api/member', memberRouter);

app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
