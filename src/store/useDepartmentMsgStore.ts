import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { getUserInfo, getUserList } from "@/api/user"
import { ElMessage } from "element-plus"
export const useDepartMsgStore = defineStore("departMsgInfo", {
  state() {
    return {
      departMsg: ref(),
      isDataUpdate: ref(false),
    }
  },
  actions: {
    
  },
  persist: {
    key: "departmentMsgInfos", // 自定义存储键名
    storage: localStorage,
  },
})
