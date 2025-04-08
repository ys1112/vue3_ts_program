// 封装下载方法,可以实现保存位置选择

// 文件类型配置接口
interface FileTypeConfig {
  mime: string
  ext: string
  desc: string
}

declare global {
  interface FilePickerAcceptType {
    description?: string
    accept: Record<string, string | string[]>
  }
}

// 文件类型映射
const FILE_TYPES: Record<string, FileTypeConfig> = {
  pdf: {
    mime: "application/pdf",
    ext: ".pdf",
    desc: "PDF文件",
  },
  xls: {
    mime: "application/vnd.ms-excel",
    ext: ".xls",
    desc: "Excel文件",
  },
  xlsx: {
    mime: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ext: ".xlsx",
    desc: "Excel文件",
  },
  doc: {
    mime: "application/msword",
    ext: ".doc",
    desc: "Word文档",
  },
  docx: {
    mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ext: ".docx",
    desc: "Word文档",
  },
}

// 获取文件类型配置
function getFileTypes(fileName: string): FilePickerAcceptType[] {
  const ext = fileName.split(".").pop()?.toLowerCase() || ""
  const typeConfig = FILE_TYPES[ext]

  return typeConfig
    ? [
        {
          description: typeConfig.desc,
          accept: { [typeConfig.mime]: [typeConfig.ext] },
        },
      ]
    : []
}

// 主下载函数
export async function downloadFile(
  url: string,
  fileName: string,
  isSuccess: boolean
): Promise<boolean> {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
    const blob = await response.blob()

    // 使用 File System Access API
    if ("showSaveFilePicker" in window) {
      try {
        const handle = await (window as any).showSaveFilePicker({
          suggestedName: fileName,
          types: getFileTypes(fileName),
        })

        const writable = await handle.createWritable()
        await writable.write(blob)
        await writable.close()
        return isSuccess
      } catch (error) {
        // 判断错误是否为 AbortError（用户取消）
        if (error instanceof DOMException && error.name === "AbortError") {
          // 可以在此处添加取消后的逻辑，如不提示错误
          return isSuccess = false
        }
        throw new Error('')
      }
    } else {
      // 传统下载方式
      const a = document.createElement("a")
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      a.target = "_blank"
      a.click()
      setTimeout(() => URL.revokeObjectURL(a.href), 1000)
      return isSuccess
    }
  } catch (error) {
    console.error("下载失败:", error)
    return isSuccess
  }
}
