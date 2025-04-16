import axios from "axios"
import { ElMessage } from "element-plus"
import { clearStore } from "@/utils/clearStore"
import { io } from "socket.io-client"
const socket = io("http://127.0.0.1:3002", {
  path: "/my-socket-path",
})
// 自定义配置新建一个 axios 实例
const instance = axios.create({
  baseURL: "http://127.0.0.1:3001",
  timeout: 6000,
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
})

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    const token = localStorage.getItem("token")
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = token
    }
    return config
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    // if(response?.data?.status == 0) {
    //   ElMessage({
    //     type:"success",
    //     message:response.data.message
    //   })
    // } else {
    //   ElMessage.error(response.data.message)
    // }
    
    // 对响应数据做点什么
    return response
  },
  function (error) {
    // 对响应错误做点什么
    if (error.response?.status === 401) {
      ElMessage.error("登录已过期，请重新登录")
      clearStore()
      localStorage.clear()
      socket.disconnect()
      window.location.href = "/login" // 跳转到登录页
    } else {
      ElMessage.error(error.response?.data?.message || "请求失败")
    }
    return Promise.reject(error)
  }
)

export default instance
