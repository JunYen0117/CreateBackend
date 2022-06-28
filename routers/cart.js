const express = require("express");
const router = express.Router();
const pool = require('../utils/database');

// localhost:3003/api/cart/orderDetails
router.post('/orderDetails', async (req, res, next) => {
  // shippingData
  console.log(req.body);

  res.json({message: 'OK'})
})


module.exports = router;