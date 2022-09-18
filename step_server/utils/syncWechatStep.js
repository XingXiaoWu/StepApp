const axios = require('../utils/http') 
// import axios from "@xing.wu/axios"
const dayjs = require('dayjs')
const { get_data_json } = require('./dataJson.js')

const get_login_code = async (user,password) => {
    let url1 = "https://api-user.huami.com/registrations/+86" + user + "/tokens"
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2",
    }
    let data = {
        "client_id": "HuaMi",
        "password": password,
        "redirect_uri": "https://s3-us-west-2.amazonaws.com/hm-registration/successsignin.html",
        "token": "access"
    }
    let location = ''
    try {
        await axios.POSTFORM(url1,data,{
            headers,
            // 禁止重定向
            maxRedirects: 0
        })    
    } catch (error) {
        let response = error.response
        // 理论上这里的error才是需要的内容，预期这里会获得一个303
        location = response.headers.location
    }
    // 根据location获取code
    const code = get_access_code(location)
    console.log("access_code:"+code);
    return code
}

const get_login_token = async (code)=> {
    let headers = {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.2",
    }
    // 进行第二次登录
    let url2 = "https://account.huami.com/v2/client/login"
    let data2 = {
        "app_name": "com.xiaomi.hm.health",
        "app_version": "4.6.0",
        "code": code,
        "country_code": "CN",
        "device_id": "2C8B4939-0CCD-4E94-8CBA-CB8EA6E613A1",
        "device_model": "phone",
        "grant_type": "access_token",
        "third_name": "huami_phone",
    }
    // 登录

    let r2 = await axios.POSTFORM(url2,data2,{
        headers,
    }).catch(error=>{
        console.log(error);
    })
    const login_token = r2["token_info"]["login_token"]
    console.log('login_token:'+login_token);
    const userId = r2["token_info"]["user_id"]
    console.log("userId:"+userId);
    return {
        login_token,
        userId
    }
}
const get_access_code = (location) => {
    let reg = /(?<=access=).*?(?=&)/
    const code = reg.exec(location)?.[0].trim()
    return code
}
const get_time = async () => {
    // 从手淘获取时间戳，这个api可以白嫖
    let url = 'http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp'
    let headers = {
        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; MI 6 MIUI/20.6.18)'
    }
    const response = await axios.GET(url,{},{
        headers
    })
    const t = response.t
    return t

}

const get_app_token = async (login_token) =>{
    const url = "https://account-cn.huami.com/v1/client/app_tokens?app_name=com.xiaomi.hm.health&dn=api-user.huami.com%2Capi-mifit.huami.com%2Capp-analytics.huami.com&login_token="+login_token+"&os_version=4.1.0"
    let headers = {
        'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 9; MI 6 MIUI/20.6.18)'
    }
    const response = await axios.GET(url,{},{
        headers
    })
    let app_token = response?.['token_info']?.['app_token']
    return app_token
}

const set_step = async (t,today,app_token,userId,step) => {
    const url = "https://api-mifit-cn.huami.com/v1/data/band_data.json?&t="+ t
    const headers = {
        "apptoken": app_token,
        "Content-Type": "application/x-www-form-urlencoded"
    }
    const data_json = get_data_json(today, step)
    const data  = 'userid='+userId+'&last_sync_data_time=1597306380&device_type=0&last_deviceid=DA932FFFFE8816E7&data_json='+data_json;
    try {
        const response = await axios.POSTJSON(url, data, {headers})    
        const result = response['message'] + "修改步数:"+ step; 
        return result
    } catch (error) {
        console.log(error);
        return "修改步数失败，请联系管理员"
    }    
}
const syncStep = async (account = '',password = '', step = 15000,)=>{
    const code = await get_login_code(account,password)
    if (!code) return '未能获取code，登录失败'
    const {login_token, userId} = await get_login_token(code);
    if (login_token === 0) return '未能获取login_token，登录失败'
    const t = await get_time()

    const app_token = await get_app_token(login_token)
    if (!app_token) return '未能获取app_token，登录失败'
    const today = dayjs().format('YYYY-MM-DD')
    const result = await set_step(t,today,app_token,userId,step)
    return result
}

// main()
module.exports = {
    syncStep
}