import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import QS from 'qs';

// 这里有两种类型可能作为入参数
declare interface ResponseX<T = any> {
	success: boolean;
	code: string;
	message: string;
	data?: T;
}

// 默认配置
let defaults = {
	baseURL: 'http://step-server-fc.step-server-framework.1251296805112027.cn-hangzhou.fc.devsapp.net/',
	withCredentials: true,
	timeout: 50000
}

// 此处不可使用解构，否则返回的不是axios.defaults实例，而是单独的对象
// axios.defaults = {
// 	...axios.defaults,
// 	...defaults,
// }
// 写入配置
axios.defaults = Object.assign(axios.defaults, defaults)

// 请求拦截器，后添加的先执行，先添加的后执行
const xingwuDefaultInterceptorsRequest = axios.interceptors.request.use(
	(config: AxiosRequestConfig): AxiosRequestConfig => {
		// 写入默认需求
		return config;
	},
	(error: Error): Promise<never> => {
		// 出错
		return Promise.reject(error);
	}
)

// 响应拦截器，先添加的先执行，后添加的后执行
const xingwuDefaultInterceptorsResponse = axios.interceptors.response.use(
	(response: AxiosResponse<ResponseX>): AxiosResponse<ResponseX> => {
		return response
	},
	(error: any): Promise<never> | {} => {
		// 判断是否前端请求就直接挂掉了，没到后台
		if (!error.response) {
			return Promise.reject(error)
		}
		// code 不为200出错
		// 有几种情况是不需要外抛的,直接此处处理
		const { status } = error.response
		// 401
		// if (status === 401) {
		// 	//   如果是web端，则跳转
		// 	if (process.env.VUE_APP_PLATFORM === 'PCWEB') {
		// 		window.location.href = `/login/?service=${encodeURIComponent(window.location.href)}`
		// 	}else if (process.env.VUE_APP_PLATFORM === 'h5') {
		// 		window.location.href = 
		// 			`${window.location.origin}/login/?service=${encodeURIComponent(
		// 			  `${window.location.href}`,
		// 			)}`
		// 	}
		// 	// 如果是小程序，还有其他操作要做
		// 	// return {}
		// }
		// // 403
		// if (status === 403) {
		// 	// 如果是pcweb或者h5
		// 	if (process.env.VUE_APP_PLATFORM === 'PCWEB' || process.env.VUE_APP_PLATFORM === 'h5') {
		// 		window.location.href = '/noAuth' // 无权限页面路由地址
		// 	}
		// 	// 如果是小程序，还有其他操作要做
		// 	// return {}
		// }
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
let errorHandle: Function | null = null;
const setErrorHandle = (handle: Function): void => {
	errorHandle = handle;
}

// 如果不需要默认拦截器，可以移除
const removeDefaultInterceptors = () => {
	axios.interceptors.request.eject(xingwuDefaultInterceptorsRequest);
	axios.interceptors.response.eject(xingwuDefaultInterceptorsResponse);
}


// 相关请求封装9
const GET = async <T = any>(url: string, params: any, config: AxiosRequestConfig = {}): Promise<T> => {
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
const POSTJSON = async <T = any>(url: string, params: any, config: AxiosRequestConfig = {}): Promise<T> => {
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

const POSTFORM = async <T = any>(url: string, params: any, config: AxiosRequestConfig = {}): Promise<T> => {
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

const PUT = async <T = any>(url: string, params: any, config: AxiosRequestConfig = {}): Promise<T> => {
	try {
		const response = await axios.put(url, params, config);
		return Promise.resolve(response.data?.data ?? response.data);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const DELETE = async <T = any>(url: string, params: any, config: AxiosRequestConfig = {}): Promise<T> => {
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

const PATCH = async <T = any>(url: string, params: any, config: AxiosRequestConfig = {}): Promise<T> => {
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
const DOWNLOAD = async <T = any>(url: string, params: any, config: AxiosRequestConfig = { responseType: 'blob' }): Promise<T> => {
	// 注意先解构config，避免params被覆盖
	try {
		const response = await axios
			.get(url, { ...config, params: params });
		// TODO: 修正类型
		return Promise.resolve(response as any);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}

const DOWNLOADPOST = async <T = any>(url: string, params: any, config: AxiosRequestConfig = { responseType: 'blob' }): Promise<T> => {
	// 注意先解构config，避免params被覆盖
	try {
		const response = await axios.post(url, params, config);
		// TODO: 修正类型
		return Promise.resolve(response as any);
	} catch (error) {
		if (errorHandle)
			errorHandle(error);
		return Promise.reject(error);
	}
}


export default {
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
	DOWNLOADPOST,
}