import instance from "@/http/index"

interface CommonData {
  id: number
}

// 获取公司消息列表
export const getContract = (params:any) => {
  return instance({
    url: "/api/files/getFiles",
    method: "GET",
    params
  })
}

// 删除文件
export const deleteContract = (data: CommonData) => {
  return instance({
    url: "/api/files/deleteFile",
    method: "DELETE",
    data,
  })
}

// 更新下载量
export const updateDownload = (data: CommonData) => {
  return instance({
    url: "/api/files/updateDownload",
    method: "POST",
    data,
  })
}

