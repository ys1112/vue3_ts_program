import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { getUserInfo } from "@/api/user"
import { ElMessage } from "element-plus"
export const useInfoStore = defineStore(
  "userInfo",
  () => {
    // userName，imageUrl就是state
    const userInfo = reactive({
      account: "",
      name: "",
      gender: "",
      identity: "",
      department: "",
      email: "",
      image_url: "",
      id: "",
    })

    // getUserInfo函数相当于action
    async function getInfo(id: string) {
      const res = await getUserInfo({ id: id })
      if (res.data.status == 0) {
        Object.keys(userInfo).forEach((key) => {
          if (res.data.hasOwnProperty(key)) {
            userInfo[key as keyof typeof userInfo] = res.data[key]
          }
        })
        ElMessage({
          message: "获取用户信息成功",
          type: "success",
        })
      } else {
        ElMessage({
          message: "获取用户信息失败",
          type: "success",
        })
      }
    }
    return { userInfo, getInfo }
  },
  {
    persist: true,
  }
)
