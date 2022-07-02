const express = require('express');
const app = express();
require('dotenv').config();
const path = require('path');
const cors = require('cors');

let port = process.env.SERVER_PORT || 3003;

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

// 品牌圖片
// http://localhost:3003/images/brand/red.jpg
app.use('/images/brand', express.static(path.join(__dirname, 'public', 'img', 'brands')));

// 雜誌圖片
// http://localhost:3003/images/artmagzs/
app.use('/images/artmagzs', express.static(path.join(__dirname, 'public', 'img', 'artmagzs')));

// Routers
const productRouter = require('./routers/productRouter')
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



app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
