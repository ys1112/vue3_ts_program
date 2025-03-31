import instance from "@/http/index"

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

