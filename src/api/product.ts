import instance from "@/http/index"
interface CreateProductData {
  product_id: string
  product_name: string
  product_category: string
  product_unit: string
  product_in_warehouse_number: string
  product_single_price: string
  product_create_person: string
  in_memo: string
}
interface UpdateProductData {
  id: string
  product_name: string
  product_category: string
  product_unit: string
  product_in_warehouse_number: string
  product_single_price: string
  in_memo: string
}
interface ApplyOutData {
  id: string
  product_out_id: string
  product_out_number: string
  product_out_apply_person: string
  apply_memo: string
}
interface AuditData {
  id:string
  product_out_audit_person:string
  audit_memo:string
}
interface DeleteProductData {
  id: number
}
interface OperateData {
  id: number
}
// 获取产品信息
export const getProductInfo = (params:any) => {
  return instance({
    url: "/api/products/getProducts",
    method: "GET",
    params
  })
}

// 新建产品 createProduct post
export const createProduct = (data: CreateProductData) => {
  const {
    product_id,
    product_name,
    product_category,
    product_unit,
    product_in_warehouse_number,
    product_single_price,
    product_create_person,
    in_memo,
  } = data
  return instance({
    url: "/api/products/createProduct",
    method: "POST",
    data: {
      product_id,
      product_name,
      product_category,
      product_unit,
      product_in_warehouse_number,
      product_single_price,
      product_create_person,
      in_memo,
    },
  })
}

// 申请出库 post
export const applyDelivery = (data: ApplyOutData) => {
  const {
    id,
    product_out_id,
    product_out_number,
    product_out_apply_person,
    apply_memo,
  } = data
  return instance({
    url: "/api/products/applyDelivery",
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
export const updateProduct = (data: UpdateProductData) => {
  const {
    id,
    product_name,
    product_category,
    product_unit,
    product_in_warehouse_number,
    product_single_price,
    in_memo,
  } = data
  return instance({
    url: "/api/products/updateProduct",
    method: "PUT",
    params: { id: id },
    data: {
      product_name,
      product_category,
      product_unit,
      product_in_warehouse_number,
      product_single_price,
      in_memo,
    },
  })
}

// 删除产品 post
export const deleteProduct = (data: DeleteProductData) => {
  const {
    id,
  } = data
  return instance({
    url: "/api/products/deleteProduct",
    method: "DELETE",
    data: {
      id
    },
  })
}

// 获取申请出库产品信息
export const getApplyProducts = (params:any) => {
  return instance({
    url: "/api/products/getApplyProducts",
    method: "GET",
    params
  })
}

// 同意申请
export const approveApply = (data: AuditData) => {
  return instance({
    url: "/api/products/approveApply",
    method: "POST",
    data,
  })
}
// 驳回申请
export const rejectApply = (data: AuditData) => {
  return instance({
    url: "/api/products/rejectApply",
    method: "POST",
    data,
  })
}
// 撤销申请
export const cancelApply = (data: OperateData) => {
  const { id } = data
  return instance({
    url: "/api/products/cancelApply",
    method: "POST",
    data:{
      id
    },
  })
}
// 再次提交申请
export const resubmit = (data: OperateData) => {
  const { id } = data
  return instance({
    url: "/api/products/resubmit",
    method: "POST",
    data:{
      id
    },
  })
}

// 获取已出库产品信息
export const getOutProducts = (params:any) => {
  return instance({
    url: "/api/products/getOutProducts",
    method: "GET",
    params
  })
}

// 删除已出库产品
export const deleteDelivery = (data: DeleteProductData) => {
  const {
    id,
  } = data
  return instance({
    url: "/api/products/deleteDelivery",
    method: "DELETE",
    data: {
      id
    },
  })
}