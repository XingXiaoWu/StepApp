const axios = require("axios");
const QS = require("qs");

// 默认配置
let defaults = {
	baseURL: process.env.VUE_APP_BASE_API || '',
	withCredentials: true,
	timeout: 50000
}

// 写入配置
axios.defaults = Object.assign(axios.defaults, defaults)

// 请求拦截器，后添加的先执行，先添加的后执行
const xingwuDefaultInterceptorsRequest = axios.interceptors.request.use(
	(config) => {
		// 写入默认需求
		return config;
	},
	(error) => {
		// 出错
		return Promise.reject(error);
	}
)

// 响应拦截器，先添加的先执行，后添加的后执行
const xingwuDefaultInterceptorsResponse = axios.interceptors.response.use(
	(response) => {
		return response
	},
	(error) => {
		// 判断是否前端请求就直接挂掉了，没到后台
		if (!error.response) {
			return Promise.reject(error)
		}
		// code 不为200出错
		// 有几种情况是不需要外抛的,直接此处处理
		const { status } = error.response
		// 以下兼容某些后端团队，设置http status不正确，并返回response
		const errorMsg = error?.response?.data?.message || error?.response?.data?.msg || '服务端请求出错，请稍后重试！'
		const notFindMsg = error?.response?.data?.message || '请求地址错误！'
		if (status === 404) {
			error.message = notFindMsg
		} else {
			error.message = errorMsg
		}
		return Promise.reject(error);
	}
)
// 设置统一错误处理
let errorHandle = null;
const setErrorHandle = (handle) => {
	errorHandle = handle;
}

// 如果不需要默认拦截器，可以移除
const removeDefaultInterceptors = () => {
	axios.interceptors.request.eject(xingwuDefaultInterceptorsRequest);
	axios.interceptors.response.eject(xingwuDefaultInterceptorsResponse);
}


// 相关请求封装9
const GET = async(url, params, config = {})=> {
	// 注意先解构config，避免params被覆盖
	// 添加noche时间戳，避免IE缓存get请求
	try {
		const response = await axios
			.get(url, {
				...config,
				params: {
					...params,
					noche: new Date().getTime()
				}
			});
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}
const POSTJSON = async(url, params, config = {})=> {
	try {
		const response = await axios.post(url, params, config);
		if (response.config.responseType === 'blob') {
			return Promise.resolve(response.data?.data ?? response.data);
		}
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const POSTFORM = async(url, params, config = {})=> {
	// 这里的header设置可能存在被覆盖的风险
	try {
		const response = await axios.post(url, QS.stringify(params), {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
			},
			...config
		});
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const PUT = async(url, params, config = {})=> {
	try {
		const response = await axios.put(url, params, config);
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const DELETE = async(url, params, config = {})=> {
	try {
		const response = await axios.delete(url, {
			...config,
			params: params
		});
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const PATCH = async(url, params, config = {})=> {
	try {
		const response = await axios.patch(url, params, config);
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

// 下载
const DOWNLOAD = async(url, params, config = { responseType: 'blob' })=> {
	// 注意先解构config，避免params被覆盖
	try {
		const response = await axios
			.get(url, { ...config, params: params });
		// TODO: 修正类型
		return Promise.resolve(response);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const DOWNLOADPOST = async(url, params, config = { responseType: 'blob' })=> {
	// 注意先解构config，避免params被覆盖
	try {
		const response = await axios.post(url, params, config);
		// TODO: 修正类型
		return Promise.resolve(response);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}


module.exports = {
    ...axios,
	setErrorHandle,
	removeDefaultInterceptors,
	POSTJSON,
	POSTFORM,
	GET,
	PUT,
	DELETE,
	PATCH,
	DOWNLOAD,
	DOWNLOADPOST
}
