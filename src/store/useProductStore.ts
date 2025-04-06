import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useProductStore = defineStore("product", {
  state() {
    return {
      
    }
  },
  actions: {
   
  },
  persist: {
    key: "productInfos", // 自定义存储键名
    storage: localStorage,
  },
})