import instance from "@/http/index"

interface deleteData {
  id: number
}
interface insertData {
  name: string
  account: string
  email: string
}
// 获取登录日志列表
export const getLoginLog = (params: any) => {
  return instance({
    url: "/login_log/getLoginLog",
    method: "GET",
    params,
  })
}

// 删除操作记录
export const deleteLoginLog = (data: deleteData) => {
  return instance({
    url: "/login_log/deleteLoginLog",
    method: "DELETE",
    data,
  })
}

// 插入操作记录
export const recordLogin = (data: insertData) => {
  return instance({
    url: "/login_log/recordLogin",
    method: "POST",
    data,
  })
}

// 清空记录
export const clearLoginLog = () => {
  return instance({
    url: "/login_log/clearLoginLog",
    method: "POST",
  })
}
