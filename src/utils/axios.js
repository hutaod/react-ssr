import axios from 'axios'
import isNode from 'detect-node'

// const isDev = process.env.NODE_ENV === 'development'

// 1. 创建axios实例
const axiosInstance = axios.create({
  // url基础地址，解决不同数据源url变化 服务端渲染必须配置, 否则在nodejs中请求会定位到80端口
  baseURL: isNode ? 'http://localhost:8091/' : '/',
  // 请求超时时间
  timeout: 5000
})

// 2. 请求拦截
axiosInstance.interceptors.request.use(
  (config) => {
    return config
  },
  (error) => {
    // 请求错误预处理
    // console.log(error)
    return Promise.reject(error)
  }
)

// 3. 相应拦截
axiosInstance.interceptors.response.use(
  (response) => {
    // 仅返回数据部分
    const res = response.data
    return res
  },
  (error) => {
    // console.error(error)
    return Promise.reject(error)
  }
)

export default {
  get: (url, data, others = {}) => {
    return axiosInstance({
      ...others,
      url,
      method: 'GET',
      params: data,
      data: undefined
    })
  },
  post: (url, data, others) => {
    return axiosInstance({
      ...others,
      url,
      method: 'POST',
      data: data
    })
  }
}
