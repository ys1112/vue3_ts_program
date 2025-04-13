import instance from "@/http/index"

interface CommonData {
  id: number
}

// 获取公司消息列表
export const getContract = (params:any) => {
  return instance({
    url: "/file/getFiles",
    method: "GET",
    params
  })
}

// 删除文件
export const deleteContract = (data: CommonData) => {
  return instance({
    url: "/file/deleteFile",
    method: "DELETE",
    data,
  })
}

// 更新下载量
export const updateDownload = (data: CommonData) => {
  return instance({
    url: "/file/updateDownload",
    method: "POST",
    data,
  })
}

