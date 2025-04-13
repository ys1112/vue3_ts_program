import instance from "@/http/index"

interface PublishData {
  message_title: string
  message_category: string
  message_publish_department?: string
  message_publish_name: string
  message_receipt_object?: string
  message_level?: string
  message_content: string
}

interface UpdateCorpData {
  id: string
  message_title: string
  message_publish_department: string
  message_receipt_object: string
  message_level: string
  message_content: string
}
interface UpdateSysData {
  id: string
  message_title: string
  message_content: string
}
interface OperateData {
  id: number
}

// 获取公司消息列表
export const getCorpMsg = (params: any) => {
  return instance({
    url: "/msg/getCorpMsg",
    method: "GET",
    params,
  })
}

// 获取系统消息列表
export const getSysMsg = (params: any) => {
  return instance({
    url: "/msg/getSysMsg",
    method: "GET",
    params,
  })
}

// 发布消息
export const publishMsg = (data: PublishData) => {
  return instance({
    url: "/msg/publishMsg",
    method: "POST",
    data,
  })
}

// 编辑公司消息
export const updateCorpMsg = (data: UpdateCorpData) => {
  const {
    id,
    message_title,
    message_publish_department,
    message_receipt_object,
    message_level,
    message_content,
  } = data
  return instance({
    url: "/msg/updateCorpMsg",
    method: "PUT",
    params: { id },
    data: {
      message_title,
      message_publish_department,
      message_receipt_object,
      message_level,
      message_content,
    },
  })
}

// 删除公司消息到回收站
export const deleteMsg = (data: OperateData) => {
  return instance({
    url: "/msg/deleteMsg",
    method: "POST",
    data,
  })
}

// 获取系统消息列表
export const getRecycleMsg = (params: any) => {
  return instance({
    url: "/msg/getRecycleMsg",
    method: "GET",
    params,
  })
}

// 编辑系统消息
export const updateSysMsg = (data: UpdateSysData) => {
  const { id, message_title, message_content } = data
  return instance({
    url: "/msg/updateSysMsg",
    method: "PUT",
    params: { id },
    data: {
      message_title,
      message_content,
    },
  })
}

// 还原消息
export const restoreMsg = (data: OperateData) => {
  return instance({
    url: "/msg/restoreMsg",
    method: "POST",
    data,
  })
}

// 删除消息
export const deleteRecycleMsg = (data: OperateData) => {
  return instance({
    url: "/msg/deleteRecycleMsg",
    method: "DELETE",
    data,
  })
}

// 获取系统消息和全体成员的公司公告消息列表
export const getAllMemberMsg = () => {
  return instance({
    url: "/msg/getAllMemberMsg",
    method: "GET",
  })
}