const express = require('express');
const router = express.Router();
const fs = require("fs-extra");
const dayjs = require("dayjs");
const {syncStep} = require("../utils/syncWechatStep")

/* GET home page. */
router.post('/', async (req, res, next)=> {
    // 解析手机号
    const {phone,password,step} = req.body
    // 同步数据
    const accountJson = fs.readJSONSync("./assets/account.json")
    const account = accountJson[phone]
    if (!account) {
        // 账号不存在
        res.send({
            status:"-1",
            message:"手机号未绑定激活码或激活码已过期"
        })
    }else if(dayjs().isAfter(account.expirationTime)){
        // 账号过期了
        res.send({
            status:"-1",
            message:"手机号未绑定激活码或激活码已过期"
        })
    }else{
        // 正常同步数据即可
        const result = await syncStep(phone,password,step)
        res.send({
            status:"0",
            message:result
        })
    }
});

module.exports = router;
