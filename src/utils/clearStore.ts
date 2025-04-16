import { useUserInfoStore } from "@/store/userInfoStore"
import { useSettingStore } from "@/store/settingInfoStore"
import { useCommonStore } from "@/store/commonStore"
import { useDepartMsgStore } from "@/store/useDepartmentMsgStore"
const stores = [
  useCommonStore(),
  useSettingStore(),
  useUserInfoStore(),
  useDepartMsgStore(),
]

export const clearStore = () => {
  stores.forEach((store) => {
    store.$reset() // 重置状态到初始值    
    localStorage.removeItem(store.$id)
  })
}
