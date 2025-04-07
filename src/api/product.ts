import instance from "@/http/index"
interface searchData {
  search_value?: string
}
interface createProductData {
  product_id: string
  product_name: string
  product_category: string
  product_unit: string
  product_inwarehouse_number: string
  product_single_price: string
  product_create_person: string
  in_memo: string
}
interface updateProductData {
  id: string
  product_name: string
  product_category: string
  product_unit: string
  product_inwarehouse_number: string
  product_single_price: string
  in_memo: string
}
interface applyOutData {
  id: string
  product_out_id: string
  product_out_number: string
  product_out_apply_person: string
  apply_memo: string
}
interface auditData {
  id:string
  product_out_audit_person:string
  audit_memo:string
}
interface deleteProductData {
  id: number
}
interface operateData {
  id: number
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

// 新建产品 createProduct post
export const createProduct = (data: createProductData) => {
  const {
    product_id,
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    product_create_person,
    in_memo,
  } = data
  return instance({
    url: "/pro/createProduct",
    method: "POST",
    data: {
      product_id,
      product_name,
      product_category,
      product_unit,
      product_inwarehouse_number,
      product_single_price,
      product_create_person,
      in_memo,
    },
  })
}

// 申请出库 post
export const applyDelivery = (data: applyOutData) => {
  const {
    id,
    product_out_id,
    product_out_number,
    product_out_apply_person,
    apply_memo,
  } = data
  return instance({
    url: "/pro/applyDelivery",
    method: "POST",
    data: {
      id,
      product_out_id,
      product_out_number,
      product_out_apply_person,
      apply_memo,
    },
  })
}

// 编辑产品 editProduct post
export const updateProduct = (data: updateProductData) => {
  const {
    id,
    product_name,
    product_category,
    product_unit,
    product_inwarehouse_number,
    product_single_price,
    in_memo,
  } = data
  return instance({
    url: "/pro/updateProduct",
    method: "PUT",
    params: { id: id },
    data: {
      product_name,
      product_category,
      product_unit,
      product_inwarehouse_number,
      product_single_price,
      in_memo,
    },
  })
}

// 删除产品 post
export const deleteProduct = (data: deleteProductData) => {
  const {
    id,
  } = data
  return instance({
    url: "/pro/deleteProduct",
    method: "DELETE",
    data: {
      id
    },
  })
}

// 获取申请出库产品信息
export const getApplyProducts = () => {
  return instance({
    url: "/pro/getApplyProducts",
    method: "GET",
  })
}
// 搜索申请出库产品信息
export const searchApplyProducts = (data?: searchData) => {
  return instance({
    url: "/pro/searchApplyProducts",
    method: "POST",
    data,
  })
}
// 同意申请
export const approveApply = (data: auditData) => {
  return instance({
    url: "/pro/approveApply",
    method: "POST",
    data,
  })
}
// 驳回申请
export const rejectApply = (data: auditData) => {
  return instance({
    url: "/pro/rejectApply",
    method: "POST",
    data,
  })
}
// 撤销申请
export const cancelApply = (data: operateData) => {
  const { id } = data
  return instance({
    url: "/pro/cancelApply",
    method: "POST",
    data:{
      id
    },
  })
}
// 再次提交申请
export const resubmit = (data: operateData) => {
  const { id } = data
  return instance({
    url: "/pro/resubmit",
    method: "POST",
    data:{
      id
    },
  })
}

// 获取已出库产品信息
export const getOutProducts = () => {
  return instance({
    url: "/pro/getOutProducts",
    method: "GET",
  })
}
// 搜索已出库产品信息
export const searchOutProduct = (data?: searchData) => {
  return instance({
    url: "/pro/searchOutProduct",
    method: "POST",
    data,
  })
}

// 删除已出库产品
export const deleteDelivery = (data: deleteProductData) => {
  const {
    id,
  } = data
  return instance({
    url: "/pro/deleteDelivery",
    method: "DELETE",
    data: {
      id
    },
  })
}