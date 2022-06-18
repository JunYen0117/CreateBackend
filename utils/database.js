require('dotenv').config();
const mysql = require('mysql2');

let pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // 加上連線數限制
  connectionLimit: 10,
  // 讓mySQL2不要把date轉成js物件
  dateStrings: true,
});

module.exports = pool.promise();