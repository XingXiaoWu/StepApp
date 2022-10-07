// 注册使用
const express = require('express');
const router = express.Router();
const fs = require("fs-extra")
const dayjs = require("dayjs")

const { registActiveCode } = require("../services/registService")
// 注册
router.post('/', (req, res, next) => {
    // 获取请求内容
    const { phone, code } = req.body
    if (!code) {
        res.send({
            status: "-1",
            message: "注册失败，未获取到激活码",
        })
        return
    }
    registActiveCode(code, phone, res)
});
// 一日激活码注册
router.post('/oneday', (req, res, next) => {
    // 获取请求内容
    const { phone } = req.body
    // 此码为测试码
    const code = 'b51f6279c86ac7d48aef4add21e3388c'
    registActiveCode(code, phone, res)
});
// 获取账号情况
router.get('/getAccount', (req, res, next) => {
    const { admin } = req.body
    if (admin !== '329106954') {
        res.send({
            status: "-1",
            message: "管理员码不对，无法获取账号情况",
        })
        return
    }
    const result = fs.readJSONSync("./assets/account.json")
    res.send({
        status: "0",
        message: "获取成功",
        data: result
    })
})
// 获取激活码情况
router.get('/getCodeState', (req, res, next) => {
    const { admin } = req.body
    if (admin !== '329106954') {
        res.send({
            status: "-1",
            message: "管理员码不对，无法获取激活码情况",
        })
        return
    }
    const result = fs.readJSONSync("./assets/activeCode.json")
    res.send({
        status: "0",
        message: "获取成功",
        data: result
    })
})
// TODO：通过web-hook自动备份

module.exports = router;
