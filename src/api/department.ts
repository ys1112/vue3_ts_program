import instance from "@/http/index"
interface DepartmentData {
  id:number
  department:string
}
interface UpdateReadData {
  read_id:number
  user_id:string
}
interface OperateData {
  id: number
}
interface DepartData {
  department:string
}
// 获取部门消息
export const getDepartMsg = (data: DepartmentData) => {
  return instance({
    url: "/api/dpm/getDepartMsg",
    method: "POST",
    data,
  })
}
export const getAllDepartMsg = (data: DepartData) => {
  return instance({
    url: "/api/dpm/getAllDepartMsg",
    method: "POST",
    data,
  })
}
// 获取用户未读信息read_list
export const getReadMsg = (data: OperateData) => {
  return instance({
    url: "/api/dpm/getReadMsg",
    method: "POST",
    data,
  })
}

// 用户点击未读消息更新用户未读信息
export const deleteReadMsg = (data: UpdateReadData) => {
  return instance({
    url: "/api/dpm/deleteReadMsg",
    method: "POST",
    data,
  })
}

// 新增信息时修改所属部门成员的未读消息
export const addUnreadMsg = (data: DepartmentData) => {
  return instance({
    url: "/api/dpm/addUnreadMsg",
    method: "POST",
    data,
  })
}
// 删除信息时修改所属部门成员的未读消息
export const deleteUnreadMsg = (data: DepartmentData) => {
  return instance({
    url: "/api/dpm/deleteUnreadMsg",
    method: "POST",
    data,
  })
}

// 更新点击数
export const updateClick = (data: OperateData) => {
  return instance({
    url: "/api/dpm/updateClick",
    method: "POST",
    data,
  })
}