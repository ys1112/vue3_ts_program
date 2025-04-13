import instance from "@/http/index"
interface DepartmentData {
  department: string
}
interface ProductData {
  product: string
}
// 获取所有轮播图
export const getAllSwiper = ()=>{
  return instance({
    url:'/set/getAllSwiper',
    method:'GET',
  })
}
// 设置公司信息
export const setCompanyInfo = (data:object)=>{
  return instance({
    url:'/set/setCompanyInfo',
    method:'POST',
    data
  })
}
// 获取所有公司信息
export const getCompanyInfo = ()=>{
  return instance({
    url:'/set/getCompanyInfo',
    method:'GET',
  })
}
 
// 修改部门  post
export const setDepartment = (data: DepartmentData) => {
  const { department } = data
  return instance({
    url: "/user/setDepartment",
    method: "POST",
    data: {
      department,
    },
  })
}
// 修改部门 setDepartment post
export const getDepartment = () => {
  return instance({
    url: "/user/getDepartment",
    method: "GET",
  })
}

// 修改部门 setProduct post
export const setProduct = (data: ProductData) => {
  const { product } = data
  return instance({
    url: "/user/setProduct",
    method: "POST",
    data: {
      product,
    },
  })
}
// 修改部门 getProduct post
export const getProduct = () => {
  return instance({
    url: "/user/getProduct",
    method: "GET",
  })
}

// 用户类别数据
export const getUserData = () => {
  return instance({
    url: "/set/getUserData",
    method: "GET",
  })
}
// 获取公告等级数据
export const getMsgLvData = () => {
  return instance({
    url: "/set/getMsgLvData",
    method: "GET",
  })
}
// 产品类别库存总价数据 
export const getPriceData = () => {
  return instance({
    url: "/set/getPriceData",
    method: "GET",
  })
}
export const getLoginCount = () => {
  return instance({
    url: "/set/getLoginCount",
    method: "GET",
  })
}