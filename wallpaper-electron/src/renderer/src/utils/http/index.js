import axios from 'axios'
const http = axios.create({
  baseURL: 'http://127.0.0.1:8080', // 本地地址
  // baseURL: 'http://114.67.229.155:3000', // 服务器地址
  timeout: 10000
})

http.interceptors.request.use(
  (conifg) => {
    return conifg
  },
  (err) => {
    return Promise.reject(err)
  }
)

http.interceptors.response.use(
  (response) => {
    return response.data
  },
  (err) => {
    return Promise.reject(err)
  }
)
export default http