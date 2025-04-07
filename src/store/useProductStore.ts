import { defineStore } from "pinia"
import { reactive, ref } from "vue"

export const useProductStore = defineStore("product", {
  state() {
    return {
      isProductUpdate:ref(false)
    }
  },
  actions: {
   
  },
  persist: {
    key: "productInfos", // 自定义存储键名
    storage: localStorage,
  },
})