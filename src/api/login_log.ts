import instance from "@/http/index"

interface DeleteData {
  id: number
}
interface InsertData {
  name: string
  identity:string
  account: string
  email: string
}
// 获取登录日志列表
export const getLoginLog = (params: any) => {
  return instance({
    url: "/api/signin-records/getLoginLog",
    method: "GET",
    params,
  })
}

// 删除操作记录
export const deleteLoginLog = (data: DeleteData) => {
  return instance({
    url: "/api/signin-records/deleteLoginLog",
    method: "DELETE",
    data,
  })
}

// 插入操作记录
export const recordLogin = (data: InsertData) => {
  return instance({
    url: "/api/signin-records/recordLogin",
    method: "POST",
    data,
  })
}

// 清空记录
export const clearLoginLog = () => {
  return instance({
    url: "/api/signin-records/clearLoginLog",
    method: "POST",
  })
}
