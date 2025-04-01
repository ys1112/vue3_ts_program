// 修改密码对话框
import { reactive, ref } from "vue"
import { type UploadProps, ElMessage } from "element-plus"
// pinia存储的公司信息和首页轮播图数据
import { useSettingStore } from "@/store/settingInfoStore"
// 修改用户数据的接口
import { setCompanyInfo } from "@/api/setting"

export default function () {
  const settingStore = useSettingStore()
  // pinia存储的数据
  const { swipers, companyInfo } = reactive(settingStore)
  
  // 向外部提供东西
  return {}
}
