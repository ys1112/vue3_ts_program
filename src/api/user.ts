import instance from "@/http/index"
// bindAccount
interface bindAccountData {
  only_id: string
  url: string
  account: string
}
interface id {
  id: string
}
interface uName {
  name: string
}
interface email {
  email: string
}
interface gender {
  gender: string
}
interface resetData {
  password: string
  newPassword: string
}

interface createAdminData {
  account: string
  password: string
  name: string
  gender: string
  email: string
  identity: string
  department: string
}
interface downgradeAdminData {
  id: number
}
interface updateUserData {
  name: string
  gender: string
  email: string
  department: string
}
interface getUserListData {
  identity: string
  department?: string
  status?: string
  search_value?: string
}
// interface searchUserListData {
//   identity: string
//   search_value: string
// }
interface freezeUserData {
  id: number
}
interface unfreezeUserData {
  id: number
}
interface empowerUserData {
  id: number
  identity: string
}
interface deleteUserData {
  id: number
  account: string
}

// 获取用户信息
export const getUserInfo = (id: id) => {
  return instance({
    url: "/user/getUserInfo",
    method: "GET",
    params: id,
  })
}

// 绑定头像和账号
export const bindAccount = (data: bindAccountData) => {
  const { only_id, url, account } = data
  return instance({
    url: "/user/bindAccount",
    method: "POST",
    data: {
      account,
      only_id,
      url,
    },
  })
}

// 登录后修改密码
export const updatePassword = (id: id, data: resetData) => {
  const { password, newPassword } = data
  return instance({
    url: "/user/updatePassword",
    method: "PUT",
    params: id,
    data: {
      password,
      newPassword,
    },
  })
}

// 修改姓名
export const updateName = (id: id, uName: uName) => {
  return instance({
    url: "/user/updateName",
    method: "PUT",
    params: id,
    data: uName,
  })
}

// 修改性别
export const updateGender = (id: id, gender: gender) => {
  return instance({
    url: "/user/updateGender",
    method: "PUT",
    params: id,
    data: gender,
  })
}

// 修改邮箱
export const updateEmail = (id: id, email: email) => {
  return instance({
    url: "/user/updateEmail",
    method: "PUT",
    params: id,
    data: email,
  })
}

// --------------------用户管理
// 新建管理员 createAdmin post
export const createAdmin = (data: createAdminData) => {
  const { account, password, name, gender, email, identity, department } = data
  return instance({
    url: "/user/createAdmin",
    method: "POST",
    data: {
      account,
      password,
      name,
      gender,
      email,
      identity,
      department,
    },
  })
}
// 删除管理员（降级为普通用户） downgradeAdmin post
export const downgradeAdmin = (data: downgradeAdminData) => {
  const { id } = data
  return instance({
    url: "/user/downgradeAdmin",
    method: "POST",
    data: {
      id,
    },
  })
}
// 编辑用户账号信息 updateUser put
export const updateUser = (id: id, data: updateUserData) => {
  const { name, gender, email, department } = data
  return instance({
    url: "/user/updateUser",
    method: "PUT",
    params: id,
    data: {
      name,
      gender,
      email,
      department,
    },
  })
}
// 获取用户列表 getUserList get
export const getUserList = (data: getUserListData) => {
  return instance({
    url: "/user/getUserList",
    method: "GET",
    params: data,
  })
}
// // 搜索用户列表 searchUserList get
// export const searchUserList = (data: searchUserListData) => {
//   return instance({
//     url: "/user/searchUserList",
//     method: "GET",
//     params: data,
//   })
// }
// 根据id冻结用户 freezeUser post
export const freezeUser = (data: freezeUserData) => {
  const { id } = data
  return instance({
    url: "/user/freezeUser",
    method: "POST",
    data: {
      id,
    },
  })
}
// 根据id解冻用户 unfreezeUser post
export const unfreezeUser = (data: unfreezeUserData) => {
  const { id } = data
  return instance({
    url: "/user/unfreezeUser",
    method: "POST",
    data: {
      id,
    },
  })
}
// 根据id和identity赋权为用户管理员或产品管理员 empowerUser post
export const empowerUser = (data: empowerUserData) => {
  const { id, identity } = data
  return instance({
    url: "/user/empowerUser",
    method: "POST",
    data: {
      id,
      identity,
    },
  })
}
// 删除用户 deleteUser delete
export const deleteUser = (data: deleteUserData) => {
  const { id, account } = data
  return instance({
    url: "/user/deleteUser",
    method: "DELETE",
    data: {
      id,
      account,
    },
  })
}
