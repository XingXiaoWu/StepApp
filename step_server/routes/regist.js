// 注册使用
const express = require('express');
const router = express.Router();
const fs = require("fs-extra")
const dayjs = require("dayjs")

// 注册
router.post('/', (req, res, next) => {
    // 获取请求内容
    const { phone, code } = req.body
    if (!code) {
        res.send({
            status: "-1",
            message: "注册失败，未获取到激活码",
        })
    }
    const activeJson = fs.readJSONSync("./assets/activeCode.json")
    // 比对激活码的值是否存在，如果存在，修改为-1
    if (activeJson[code] === "0") {
        // 存在。激活
        activeJson[code] = "1"
        const account = {
            [phone]:{
                code,
                expirationTime: dayjs().add(30,'day').format("YYYY-MM-DD")
            }
        }
        console.log(account);
        fs.writeJsonSync("./assets/activeCode.json",activeJson)
        const registeredJson = fs.readJSONSync("./assets/account.json")
        fs.writeJsonSync("./assets/account.json",{
            ...registeredJson,
            ...account,
        })
        res.send({
            status: "0",
            message: "注册成功，手机号有效期至" + account[phone].expirationTime,
        })
    } else if (activeJson[code] === "1") {
        res.send({
            status: "-1",
            message: "注册失败，此激活码已经激活过了",
        })
    } else {
        // 不存在
        res.send({
            status: "-1",
            message: "注册失败，未获取到激活码",
        })
    }
});
// 获取账号情况
router.get('/getAccount',(req, res, next) => {
    const {admin} = req.body
    if (admin !== '329106954') {
        res.send({
            status: "-1",
            message: "管理员码不对，无法获取账号情况",
        })
    }
    const result = fs.readJSONSync("./assets/account.json")
    res.send({
        status:"0",
        message:"获取成功",
        data: result
    })
})
// 获取激活码情况
router.get('/getCodeState',(req, res, next) => {
    const {admin} = req.body
    if (admin !== '329106954') {
        res.send({
            status: "-1",
            message: "管理员码不对，无法获取激活码情况",
        })
    }
    const result = fs.readJSONSync("./assets/activeCode.json")
    res.send({
        status:"0",
        message:"获取成功",
        data: result
    })
})
// TODO：通过web-hook自动备份

module.exports = router;
