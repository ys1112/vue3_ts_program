import instance from "@/http/index"
// bindAccount
interface BindAccountData {
  only_id: string
  url: string
  account: string
}
interface Id {
  id: string
}
interface UName {
  name: string
}
interface Email {
  email: string
}
interface Gender {
  gender: string
}
interface ResetData {
  password: string
  newPassword: string
}

interface CreateAdminData {
  account: string
  password: string
  name: string
  gender: string
  email: string
  identity: string
  department: string
}
interface DowngradeAdminData {
  id: number
}
interface UpdateUserData {
  id: string
  name: string
  gender: string
  email: string
  department: string
}
interface SetAccountData {
  id: string
  name: string
  gender: string
  email: string
}
// interface searchUserListData {
//   identity: string
//   keyword: string
// }
interface FreezeUserData {
  id: number
}
interface UnfreezeUserData {
  id: number
}
interface EmpowerUserData {
  id: number
  identity: string
}
interface DeleteUserData {
  id: number
  account: string
}

// 获取用户信息
export const getUserInfo = (id: Id) => {
  return instance({
    url: "/api/users/getUserInfo",
    method: "GET",
    params: id,
  })
}

// 绑定头像和账号
export const bindAccount = (data: BindAccountData) => {
  const { only_id, url, account } = data
  return instance({
    url: "/api/users/bindAccount",
    method: "POST",
    data: {
      account,
      only_id,
      url,
    },
  })
}

// 登录后修改密码
export const updatePassword = (id: Id, data: ResetData) => {
  const { password, newPassword } = data
  return instance({
    url: "/api/users/updatePassword",
    method: "PUT",
    params: id,
    data: {
      password,
      newPassword,
    },
  })
}

// 修改姓名
export const updateName = (id: Id, uName: UName) => {
  return instance({
    url: "/api/users/updateName",
    method: "PUT",
    params: id,
    data: uName,
  })
}

// 修改性别
export const updateGender = (id: Id, gender: Gender) => {
  return instance({
    url: "/api/users/updateGender",
    method: "PUT",
    params: id,
    data: gender,
  })
}

// 修改邮箱
export const updateEmail = (id: Id, email: Email) => {
  return instance({
    url: "/api/users/updateEmail",
    method: "PUT",
    params: id,
    data: email,
  })
}

// --------------------用户管理
// 新建管理员 createAdmin post
export const createAdmin = (data: CreateAdminData) => {
  const { account, password, name, gender, email, identity, department } = data
  return instance({
    url: "/api/users/createAdmin",
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
export const downgradeAdmin = (data: DowngradeAdminData) => {
  const { id } = data
  return instance({
    url: "/api/users/downgradeAdmin",
    method: "POST",
    data: {
      id,
    },
  })
}
// 编辑用户账号信息 updateUser put
export const updateUser = (data: UpdateUserData) => {
  const { id, name, gender, email, department } = data
  return instance({
    url: "/api/users/updateUser",
    method: "PUT",
    params: { id: id },
    data: {
      name,
      gender,
      email,
      department,
    },
  })
}
// 获取用户列表 getUserList get
export const getUserList = (params: any) => {
  return instance({
    url: "/api/users/getUserList",
    method: "GET",
    params,
  })
}
// // 搜索用户列表 searchUserList get
// export const searchUserList = (data: searchUserListData) => {
//   return instance({
//     url: "/api/users/searchUserList",
//     method: "GET",
//     params: data,
//   })
// }
// 根据id冻结用户 freezeUser post
export const freezeUser = (data: FreezeUserData) => {
  const { id } = data
  return instance({
    url: "/api/users/freezeUser",
    method: "POST",
    data: {
      id,
    },
  })
}
// 根据id解冻用户 unfreezeUser post
export const unfreezeUser = (data: UnfreezeUserData) => {
  const { id } = data
  return instance({
    url: "/api/users/unfreezeUser",
    method: "POST",
    data: {
      id,
    },
  })
}
// 根据id和identity赋权为用户管理员或产品管理员 empowerUser post
export const empowerUser = (data: EmpowerUserData) => {
  const { id, identity } = data
  return instance({
    url: "/api/users/empowerUser",
    method: "POST",
    data: {
      id,
      identity,
    },
  })
}
// 删除用户 deleteUser delete
export const deleteUser = (data: DeleteUserData) => {
  const { id, account } = data
  return instance({
    url: "/api/users/deleteUser",
    method: "DELETE",
    data: {
      id,
      account,
    },
  })
}

// 编辑用户账号信息 updateUser put
export const setAccount = (data: SetAccountData) => {
  const { id, name, gender, email } = data
  return instance({
    url: "/api/users/setAccount",
    method: "PUT",
    params: { id: id },
    data: {
      name,
      gender,
      email,
    },
  })
}