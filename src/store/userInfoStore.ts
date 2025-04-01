import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { getUserInfo } from "@/api/user"
import { ElMessage } from "element-plus"
export const useUserInfoStore = defineStore("userInfo", {
  state() {
    return {
      userInfo: reactive({
        account: "",
        name: "",
        gender: "",
        identity: "",
        department: "",
        email: "",
        image_url: "",
        id: "",
      }),
    }
  },
  actions: {
    async getInfo(id: string) {
      const res = await getUserInfo({ id: id })
      if (res.data.status == 0) {
        Object.keys(this.userInfo).forEach((key) => {
          if (res.data.hasOwnProperty(key)) {
            this.userInfo[key as keyof typeof this.userInfo] = res.data[key]
          }
        })
      } else {
        ElMessage({
          message: "获取用户信息失败",
          type: "success",
        })
      }
    },
  },
  persist: {
    key: "userInfos", // 自定义存储键名
    storage: localStorage,
  },
})
// export const useInfoStore = defineStore(
//   "userInfo",
//   () => {
//     // userInfo就是state
//     const userInfo = reactive({
//       account: "",
//       name: "",
//       gender: "",
//       identity: "",
//       department: "",
//       email: "",
//       image_url: "",
//       id: "",
//     })

//     // getUserInfo函数相当于action
//     async function getInfo(id: string) {
//       const res = await getUserInfo({ id: id })
//       if (res.data.status == 0) {
//         Object.keys(userInfo).forEach((key) => {
//           if (res.data.hasOwnProperty(key)) {
//             userInfo[key as keyof typeof userInfo] = res.data[key]
//           }
//         })
//       } else {
//         ElMessage({
//           message: "获取用户信息失败",
//           type: "success",
//         })
//       }
//     }
//     return { userInfo, getInfo }
//   },
//   {
//     persist: {
//       key: "userInfos", // 自定义存储键名
//       storage: localStorage,
//     },
//   }
// )
