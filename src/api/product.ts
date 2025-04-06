import instance from "@/http/index"
interface searchData {
  search_value?:string
}

// 获取产品信息
export const getProductInfo = () => {
  return instance({
    url: "/pro/getProducts",
    method: "GET",
  })
}
// 搜索
export const searchProductInfo = (data?: searchData) => {
  return instance({
    url: "/pro/searchProducts",
    method: "POST",
    data,
  })
}

// 获取产品信息
export const getApplyProducts = () => {
  return instance({
    url: "/pro/getApplyProducts",
    method: "GET",
  })
}
// 搜索
export const searchApplyProducts = (data?: searchData) => {
  return instance({
    url: "/pro/searchApplyProducts",
    method: "POST",
    data,
  })
}

// 获取产品信息
export const getOutProducts = () => {
  return instance({
    url: "/pro/getOutProducts",
    method: "GET",
  })
}
// 搜索
export const searchOutProducts = (data?: searchData) => {
  return instance({
    url: "/pro/searchOutProducts",
    method: "POST",
    data,
  })
}