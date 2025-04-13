import instance from "@/http/index"
interface LoginData {
  account: string
  password: string
}
interface VerifyAccountData {
  account: string
  email: string
}
interface VerifyResetData {
  id: string
  newPassword: string
}
// 注册接口
export const register = (data:LoginData)=>{
  const { account, password } = data
  return instance({
    url:'/api/register',
    method:'POST',
    data: {
      account, 
      password
    }
  })
}

// 登录接口
export const login = (data:LoginData)=>{
  const { account, password } = data
  return instance({
    url:'/api/login',
    method:'POST',
    data: {
      account, 
      password
    }
  })
}

// 验证账号和邮箱
export const verifyAccount = (data:VerifyAccountData)=>{
  const { account, email } = data
  return instance({
    url:'/user/verifyAccount',
    method:'POST',
    data: {
      account, 
      email
    }
  })
}

// 重置密码
export const resetPassword = (data:VerifyResetData)=>{
  const { id, newPassword } = data
  return instance({
    url:'/user/resetPassword',
    method:'POST',
    data: {
      id, 
      newPassword
    }
  })
}
