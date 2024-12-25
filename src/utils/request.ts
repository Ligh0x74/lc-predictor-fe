import axios from 'axios'

// 配置请求, 携带 cookie (用于 session)
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
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
