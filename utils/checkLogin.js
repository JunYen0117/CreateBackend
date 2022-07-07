const checkLogin = (req, res, next) => {
    if(req.session.customer){
        next();
    }else{
        return res.json({
            code: 30010,
            msg: "您尚未登入，無法使用此功能"
        })
    }
}

module.exports = {checkLogin};