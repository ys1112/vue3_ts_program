import instance from "@/http/index"

interface commonData {
  id: number
}
interface filterData {
  file_name: string
}
// 获取公司消息列表
export const getContract = () => {
  return instance({
    url: "/file/getFiles",
    method: "GET",
  })
}

// 删除文件
export const deleteContract = (data: commonData) => {
  return instance({
    url: "/file/deleteFile",
    method: "DELETE",
    data,
  })
}

// 更新下载量
export const updateDownload = (data: commonData) => {
  return instance({
    url: "/file/updateDownload",
    method: "POST",
    data,
  })
}

// 筛选文件
export const filterFiles = (data: filterData) => {
  return instance({
    url: "/file/filterFiles",
    method: "POST",
    data,
  })
}
