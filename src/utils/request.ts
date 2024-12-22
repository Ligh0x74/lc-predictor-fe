import axios from 'axios'

// 配置请求
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
  return config
})

// 添加响应拦截器
request.interceptors.response.use(
  (res) => {
    return res.data
  },
  (err) => {
    return Promise.reject(err)
  },
)

export default request
