import { defineStore } from "pinia"
import { reactive, ref } from "vue"
import { MenusEnum } from "@/contants/MenusEnum"

export const useCommonStore = defineStore("common", {
  state() {
    return {
      activeMenuItem: reactive({
        activeMenu: "home",
      }),
      breadItems: reactive(
        JSON.parse(sessionStorage.getItem("breadItems") as string) || {
          first: "首页",
          second: "",
        }
      ),
    }
  },
  actions: {
    // 路由编程式跳转时更新面包屑导航
    getBread(menu: any, path: string) {
      this.activeMenuItem.activeMenu = path
      for (const key in menu) {
        if (
          key == path &&
          !(menu[key as keyof typeof menu] instanceof Object)
        ) {
          this.breadItems.first = menu[key as keyof typeof menu] || ""
          break
        } else {
          for (const key1 in menu[key]) {
            if (key1 == path) {
              this.breadItems.first = MenusEnum[key as keyof typeof MenusEnum]
              this.breadItems.second = MenusEnum[key1 as keyof typeof MenusEnum]
            }
          }
        }
      }
      sessionStorage.setItem("breadItems", JSON.stringify(this.breadItems))
    },
  },
  persist: {
    key: "commonInfos", // 自定义存储键名
    storage: localStorage,
  },
})

// export const useCommonStore = defineStore(
//   "common",
//   () => {
//     // userInfo就是state
//     const commonInfo = reactive({
//       activeMenu: "首页",
//     })
//     const breadItems = reactive(
//       JSON.parse(sessionStorage.getItem("breadItems") as string) || {
//         first: "首页",
//         second: "",
//       }
//     )
//     // 路由编程式跳转时更新面包屑导航
//     function getBread(menu: any, path: string) {
//       const bread = {
//         first: "",
//         second: "",
//       }
//       for (const key in menu) {
//         if (
//           key == path &&
//           !(menu[key as keyof typeof menu] instanceof Object)
//         ) {
//           bread.first = menu[key as keyof typeof menu] || ""
//           breadItems.first = menu[key as keyof typeof menu] || ""
//           break
//         } else {
//           for (const key1 in menu[key]) {
//             if (key1 == path) {
//               bread.first = MenusEnum[key as keyof typeof MenusEnum]
//               breadItems.first = MenusEnum[key as keyof typeof MenusEnum]
//               bread.second = MenusEnum[key1 as keyof typeof MenusEnum]
//               breadItems.second = MenusEnum[key1 as keyof typeof MenusEnum]
//             }
//           }
//         }
//       }
//       return bread
//     }
//     function renderBread() {}
//     return { commonInfo, getBread, breadItems }
//   },
//   {
//     persist: {
//       key: "commonInfos", // 自定义存储键名
//       storage: localStorage,
//     },
//   }
// )
