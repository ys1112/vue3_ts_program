import { useUserInfoStore } from "@/store/userInfoStore"
import { reactive, ref } from "vue"
import { recordOper } from "@/api/operate_log"
export const trackRecord = async (
  module: string, //模块
  action: string, //动作
  target: string, // 目标
  other?: string
) => {
  const infoStore = useUserInfoStore()
  const {
    userInfo: { account, identity },
  } = reactive(infoStore)
  const params = {
    operate_account: account,
    operate_content: identity,
    operate_level: "",
  }
  // operate_content 操作内容
  switch (module) {
    case "user":
      switch (action) {
        case "create":
          params.operate_content += ` '${account}' 创建了 '${other}' '${target}'`
          break
        case "delete":
          params.operate_content += ` '${account}' 删除了用户 '${target}'`
          break
        case "downgrade":
          params.operate_content += ` '${account}对 '${target}' 降级为用户`
          break
        case "upgrade":
          params.operate_content += ` '${account}'对 '${target}' 赋权为 '${other}'`
          break
        case "freeze":
          params.operate_content += ` '${account}' 对 '${target}' 进行了冻结操作`
          break
        case "thaw":
          params.operate_content += ` '${account}' 对 '${target}' 进行了解冻操作`
          break
        default:
          break
      }
      break
    case "product":
      switch (action) {
        case "create":
          params.operate_content += ` '${account}' 创建了产品 '${target}'`
          break
        case "delete":
          params.operate_content += ` '${account}' 删除了产品 '${target}'`
          break
        case "apply":
          params.operate_content += ` '${account}' 对产品 '${target}' 申请出库`
          break
        case "cancel":
          params.operate_content += ` '${account}' 对产品 '${target}' 撤销出库申请`
          break
        case "resubmit":
          params.operate_content += ` '${account}' 对产品 '${target}' 重新提交出库申请`
          break
        case "agree":
          params.operate_content += ` '${account}' 通过了产品 '${target}' 的出库申请`
          break
        case "reject":
          params.operate_content += ` '${account}' 驳回产品 '${target}' 的出库申请`
          break
        default:
          break
      }
      break
    case "message":
      switch (action) {
        case "publish":
          params.operate_content += ` '${account}' 发布了 '${other}' 主题: '${target}'`
          break
        case "delete":
          params.operate_content += ` '${account}' 删除了 '${other}' 主题: '${target}'`
          break
        default:
          break
      }
      break
    case "contract":
      switch (action) {
        case "delete":
          params.operate_content += ` '${account}' 删除了文件 '${target}'`
          break
        case "upload":
          params.operate_content += ` '${account}' 上传了文件 '${target}'`
          break
        default:
          break
      }
      break
    case "setting":
      switch (action) {
        case "corp":
          params.operate_content += ` '${account}' 编辑了 '${target}'`
          break
        case "swiper":
          params.operate_content += ` '${account}' 更换了 '${target}'`
          break
        default:
          break
      }
      break
    default:
      break
  }
  // operate_level 等级
  if (action == "create" || action == "delete") {
    params.operate_level = "高级"
  } else {
    params.operate_level = "一般"
  }
  try {
    await recordOper(params)
  } catch (error) {
    console.error("日志记录失败:", error)
  }
}
