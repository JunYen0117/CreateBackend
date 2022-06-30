const express = require('express');
const router = express.Router();

router.get('/', (req, res, next)=>{
    if(req.session.customer){
        return res.json(req.session.customer)
    }else{
        return res.status(403).json({code: 3005, error: '狀態是沒有登入'});
    }
});

module.exports = router;