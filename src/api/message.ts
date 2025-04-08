import instance from "@/http/index"

interface filterData {
  message_publish_department: string
  message_level: string
}
interface publishData {
  message_title: string
  message_category: string
  message_publish_department?: string
  message_publish_name: string
  message_receipt_object?: string
  message_level?: string
  message_content: string
}

interface updateCorpData {
  id: number
  message_title: string
  message_publish_department: string
  message_receipt_object: string
  message_level: string
  message_content: string
}
interface updateSysData {
  id: number
  message_title: string
  message_content: string
}
interface operateData {
  id: number
}
interface departmentData {
  message_publish_department:string
}
// 获取公司消息列表
export const getCorpMsg = () => {
  return instance({
    url: "/msg/getCorpMsg",
    method: "GET",
  })
}

// 获取系统消息列表
export const getSysMsg = () => {
  return instance({
    url: "/msg/getSysMsg",
    method: "GET",
  })
}

// 筛选公司消息
export const filterMsg = (data: filterData) => {
  return instance({
    url: "/msg/filterMsg",
    method: "POST",
    data,
  })
}

// 发布消息
export const publishMsg = (data: publishData) => {
  return instance({
    url: "/msg/publishMsg",
    method: "POST",
    data,
  })
}

// 编辑公司消息
export const updateCorpMsg = (data: updateCorpData) => {
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
export const deleteMsg = (data: operateData) => {
  return instance({
    url: "/msg/deleteMsg",
    method: "POST",
    data,
  })
}

// 获取系统消息列表
export const getRecycleMsg = () => {
  return instance({
    url: "/msg/getRecycleMsg",
    method: "GET",
  })
}

// 编辑系统消息
export const updateSysMsg = (data: updateSysData) => {
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
export const restoreMsg = (data: operateData) => {
  return instance({
    url: "/msg/restoreMsg",
    method: "POST",
    data,
  })
}

// 删除消息
export const deleteRecycleMsg = (data: operateData) => {
  return instance({
    url: "/msg/deleteRecycleMsg",
    method: "DELETE",
    data,
  })
}


// 获取部门消息
export const getDepartmentMsg = (data: departmentData) => {
  return instance({
    url: "/msg/getDepartmentMsg",
    method: "POST",
    data,
  })
}