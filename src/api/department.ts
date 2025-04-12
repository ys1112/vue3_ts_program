import instance from "@/http/index"
interface departmentData {
  id:number
  department:string
}
interface updateReadData {
  read_id:number
  user_id:string
}
interface operateData {
  id: number
}
interface departData {
  department:string
}
// 获取部门消息
export const getDepartMsg = (data: departmentData) => {
  return instance({
    url: "/dpm/getDepartMsg",
    method: "POST",
    data,
  })
}
export const getAllDepartMsg = (data: departData) => {
  return instance({
    url: "/dpm/getAllDepartMsg",
    method: "POST",
    data,
  })
}
// 获取用户未读信息read_list
export const getReadMsg = (data: operateData) => {
  return instance({
    url: "/dpm/getReadMsg",
    method: "POST",
    data,
  })
}

// 用户点击未读消息更新用户未读信息
export const deleteReadMsg = (data: updateReadData) => {
  return instance({
    url: "/dpm/deleteReadMsg",
    method: "POST",
    data,
  })
}

// 新增信息时修改所属部门成员的未读消息
export const addUnreadMsg = (data: departmentData) => {
  return instance({
    url: "/dpm/addUnreadMsg",
    method: "POST",
    data,
  })
}
// 删除信息时修改所属部门成员的未读消息
export const deleteUnreadMsg = (data: departmentData) => {
  return instance({
    url: "/dpm/deleteUnreadMsg",
    method: "POST",
    data,
  })
}

// 更新点击数
export const updateClick = (data: operateData) => {
  return instance({
    url: "/dpm/updateClick",
    method: "POST",
    data,
  })
}