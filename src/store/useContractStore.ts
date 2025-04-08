import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useContractStore = defineStore("contract", {
  state() {
    return {
      isContractUpdate:ref(false)
    }
  },
  actions: {
   
  },
  persist: {
    key: "contractInfos", // 自定义存储键名
    storage: localStorage,
  },
})