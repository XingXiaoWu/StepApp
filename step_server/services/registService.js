const fs = require("fs-extra")
const dayjs = require("dayjs")

const registActiveCode = (code, phone) => {
    const activeJson = fs.readJSONSync("./assets/activeCode.json")
    // 比对激活码的值是否存在，如果存在，修改为1
    if (activeJson[code] === "0") {
        writeAccount(code, phone, 30)
        res.send({
            status: "0",
            message: "注册成功，手机号有效期至" + account[phone].expirationTime,
        })
    } else if (activeJson[code] === "1") {
        res.send({
            status: "-1",
            message: "注册失败，此激活码已经激活过了",
        })
    } else if (activeJson[code] === "2") {
        // 激活过测试码的列表
        const testArray = fs.readJSONSync('./assets/testUsers.json')
        if (testArray.includes(phone)) {
            res.send({
                status: "-1",
                message: "已经激活过一次测试码了,请使用其他激活码",
            })
        } else {
            // 判断此用户是否激活过测试码
            writeAccount(code, phone, 1)
            // 测试码
            res.send({
                status: "0",
                message: "注册成功，手机号有效期至" + account[phone].expirationTime,
            })
        }
    } else {
        // 不存在
        res.send({
            status: "-1",
            message: "注册失败，未获取到激活码",
        })
    }
}

const writeAccount = (code, phone, day) => {
    const activeJson = fs.readJSONSync("./assets/activeCode.json")
    const account = {
        [phone]: {
            code,
            expirationTime: dayjs().add(day, 'day').format("YYYY-MM-DD"),
        }
    }
    // 是否为测试激活码
    if (day === 1) {
        activeJson[code] = "2"
    } else {
        activeJson[code] = "1"
    }

    fs.writeJsonSync("./assets/activeCode.json", activeJson)
    const registeredJson = fs.readJSONSync("./assets/account.json")
    fs.writeJsonSync("./assets/account.json", {
        ...registeredJson,
        ...account,
    })
}

module.exports = {
    registActiveCode
}