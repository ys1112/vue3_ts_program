import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { getUserInfo, getUserList } from "@/api/user"
import { ElMessage } from "element-plus"
import { setCachedRoutes } from "@/utils/auth"
import { getReadMsg } from "@/api/department"
interface GetUserListData {
  identity: string
  department?: string
  status?: string
  keyword?: string
}

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
        read_list: "[]",
        read_status: 0,
      } as any),
      isDataUpdate: ref(false),
      unreadNum: ref(),
      departmentMsgData: ref(),
      menuList: ref(),
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
        setCachedRoutes(res.data.menus)
        this.unreadNum = JSON.parse(res.data.read_list).length
        this.menuList = JSON.parse(res.data.menus)
      } else {
        ElMessage.error("获取用户信息失败")
      }
    },
    async getList(params: GetUserListData) {
      const res = await getUserList(params)
      if (res.data.status == 0) {
        if (res.data.results.length == 0) ElMessage.error("查询用户列表为空")
        if (res.data.results.length > 0) {
          ElMessage({
            message: "获取用户列表成功",
            type: "success",
          })
        }
        return res.data.results
      } else {
        ElMessage.error("获取用户列表失败")
      }
    },
    async getUnreadNum() {
      if (localStorage.getItem("userId")) {
        const params = {
          id: +(localStorage.getItem("userId") as unknown as string),
        }
        // 获取用户未读信息read_list
        const res = await getReadMsg(params)
        if (res.data.status == 0 && res.data.results.read_status) {
          this.userInfo.read_list = JSON.stringify(
            JSON.parse(res.data.results.read_list)
          )
          this.unreadNum = JSON.parse(res.data.results.read_list).length
        }
      }
    },
  },
  // getters:{
  //   unreadNum():number{
  //     return JSON.parse(this.userInfo.read_list).length
  //   }
  // },
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
