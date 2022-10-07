import axios from './axios'
declare interface ResponseX<T = any> {
	success: boolean;
	code: string;
	message: string;
	data?: T;
}

declare global {
    interface Error {
        response : ResponseX
    }
}

// 兜底处理
axios.defaults.baseURL = '/api'
const errorHandle = (error: Error) => {
    // 处理错误,尝试获取error的message展示
    const { message } = error
    // showFailToast(message);
}
axios.setErrorHandle(errorHandle)

// 业务自定义拦截器，先执行
axios.interceptors.request.use((config) => config)

// 后执行
axios.interceptors.response.use(
    (response) => {
        // 判断是否为blob类型
        if (response.config.responseType === 'blob') {
            return response
        }
        // 添加自己业务的格式判定业务成功
        if (response.data.success || response.data.success === undefined) {
            return response
        }
        //   不是blob，且success不为true，意味着业务出错
        const error = new Error(response.data.msg || '')
        error.response = response.data || {}
        return Promise.reject(error)
    },
    (error) => Promise.reject(error),
)

export default axios