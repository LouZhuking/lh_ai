import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:5173/api'

// 请求响应拦截
axios.interceptors.request.use((config) => {
  // token 
  return config
})

// 配置 axios 响应拦截器，成功响应处理
axios.interceptors.response.use((data) => {
  return data.data
})

export default axios