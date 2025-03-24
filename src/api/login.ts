import instance from "@/http/index"
interface loginData {
  account: string
  password: string
}
// 注册接口
export const register = (data:loginData)=>{
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
export const login = (data:loginData)=>{
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
