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

// Routers
const productRouter = require('./routers/productRouter')
app.use('/api/product', productRouter);

const productOrderRouter = require('./routers/productOrderRouter')
app.use('/api/productorder', productOrderRouter);

const poCancelRouter = require('./routers/poCancelRouter')
app.use('/api/pocancel', poCancelRouter);

const poShippedRouter = require('./routers/poShippedRouter')
app.use('/api/poshipped', poShippedRouter);




app.use((req, res, next) => {
  res.status(404).send('404 not found');
});

app.use((err, req, res, next) => {
  res.status(500).send('Server Error');
});

app.listen(port, () => {
  console.log(`Server running at port ${port}`);
});
