import instance from "@/http/index"

interface DeleteData {
  id: number
}
interface OperData {
  operate_account: string
  operate_content: string
  operate_level: string
}

// 获取操作日志列表
export const getOperLog = (params:any) => {
  return instance({
    url: "/operate_log/getOperLog",
    method: "GET",
    params
  })
}

// 删除操作记录
export const deleteOperLog = (data: DeleteData) => {
  return instance({
    url: "/operate_log/deleteOperLog",
    method: "DELETE",
    data,
  })
}

// 插入操作记录
export const recordOper = (data: OperData) => {
  return instance({
    url: "/operate_log/recordOper",
    method: "POST",
    data,
  })
}

// 清空记录
export const clearOperLog = () => {
  return instance({
    url: "/operate_log/clearOperLog",
    method: "POST",
  })
}