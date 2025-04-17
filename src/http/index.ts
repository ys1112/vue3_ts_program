import axios from "axios"
import { ElMessage } from "element-plus"
import { useRouter} from 'vue-router'
const router = useRouter()

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
    // 统一处理请求响应 此处不做修改，因为未修改后端返回信息，如做修改需整体修改前后端响应消息提示
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
    console.log(123);
    
    const { response } = error
    if (response) {
      // 根据状态码处理
      switch (response.status) {
        case 400:
          error.message = "请求参数错误"
          break
        case 401:
          error.message = "登录已过期，请重新登录"
          // 清除 token 等认证信息
          localStorage.clear()
          sessionStorage.clear()
          // 跳转到登录页
          router.replace("/login")
          break
        case 403:
          error.message = "拒绝访问"
          break
        case 404:
          error.message = "请求资源未找到"
          break
        case 500:
          error.message = "服务器内部错误"
          break
        case 502:
          error.message = "网关错误"
          break
        default:
          error.message = `连接错误 ${response.status}`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      error.message = "服务器未响应"
    } else {
      // 初始化请求时发生错误
      error.message = "网络错误，请检查网络连接"
    }

    // 显示错误提示
    ElMessage({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    })

    return Promise.reject(error)
  }
)

export default instance
