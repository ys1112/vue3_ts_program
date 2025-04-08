import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useMessageStore = defineStore("message", {
  state() {
    return {
      isMessageUpdate:ref(false)
    }
  },
  actions: {
   
  },
  persist: {
    key: "messageInfos", // 自定义存储键名
    storage: localStorage,
  },
})