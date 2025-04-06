import instance from "@/http/index"
interface departmentData {
  department: string
}
interface productData {
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
export const setDepartment = (data: departmentData) => {
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
export const setProduct = (data: productData) => {
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

