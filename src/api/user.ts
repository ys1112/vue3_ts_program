import instance from "@/http/index"
// bindAccount
interface bindAccountData {
  only_id:string
  url:string
  account:string
}
interface id {
  id:string
}
interface uName {
  name:string
}
interface email {
  email:string
}
interface gender {
  gender:string
}
interface resetData {
  password:string
  newPassword:string
}
export const getUserInfo = (id:id)=>{
  return instance({
    url:'/user/getUserInfo',
    method:'GET',
    params: id
  })
}

export const bindAccount = (data:bindAccountData)=>{
  const { only_id, url,account } = data
  return instance({
    url:'/user/bindAccount',
    method:'POST',
    data: {
      account, 
      only_id,
      url
    }
  })
}

export const updatePassword = (id:id,data:resetData)=>{
  const { password,newPassword } = data
  return instance({
    url:'/user/updatePassword',
    method:'PUT',
    params:id,
    data: {
      password,
      newPassword
    }
  })
}

export const updateName = (id:id,uName:uName)=>{
  return instance({
    url:'/user/updateName',
    method:'PUT',
    params:id,
    data: uName
  })
}

export const updateGender = (id:id,gender:gender)=>{
  return instance({
    url:'/user/updateGender',
    method:'PUT',
    params:id,
    data: gender
  })
}

export const updateEmail = (id:id,email:email)=>{
  return instance({
    url:'/user/updateEmail',
    method:'PUT',
    params:id,
    data: email
  })
}