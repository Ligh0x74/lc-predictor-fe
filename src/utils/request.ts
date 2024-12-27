import axios from 'axios'

// 配置请求
// https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
const request = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

// 添加请求拦截器
request.interceptors.request.use((config) => {
  const user = localStorage.getItem('user')
  if (user) {
    config.headers.Authorization = JSON.parse(user).token
  }
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
