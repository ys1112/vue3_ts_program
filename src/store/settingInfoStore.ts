import { defineStore } from "pinia"
import { reactive, ref, toRef, toRefs } from "vue"
import {
  getAllSwiper,
  getCompanyInfo,
  getDepartment,
  getProduct,
} from "@/api/setting"
import { ElMessage } from "element-plus"

export const useSettingStore = defineStore("settingInfo", {
  state() {
    return {
      swipers: reactive({
        swiperData: [
          {
            id: 1,
            set_name: "swiper1",
            set_value: "",
          },
          {
            id: 2,
            set_name: "swiper2",
            set_value: "",
          },
          {
            id: 3,
            set_name: "swiper3",
            set_value: "",
          },
          {
            id: 4,
            set_name: "swiper4",
            set_value: "",
          },
          {
            id: 5,
            set_name: "swiper5",
            set_value: "",
          },
          {
            id: 6,
            set_name: "swiper6",
            set_value: "",
          },
        ],
      }),
      companyInfo: reactive({
        conmapyData: [
          {
            id: 1,
            set_name: "company_name",
            set_value: "",
          },
          {
            id: 2,
            set_name: "company_introduce",
            set_value: "",
          },
          {
            id: 3,
            set_name: "company_structure",
            set_value: "",
          },
          {
            id: 4,
            set_name: "company_strategy",
            set_value: "",
          },
          {
            id: 5,
            set_name: "company_senior",
            set_value: "",
          },
        ],
        mainContent: [] as { [key: string]: any },
      }),
      departmentInfo: ref([] as string[]),
      productInfo: ref([] as string[]),
    }
  },
  actions: {
    async getSettingInfo() {
      const res = await getAllSwiper()
      const res1 = await getCompanyInfo()
      if (res.data.status == 0) {
        this.swipers.swiperData = res.data.results
      } else {
        ElMessage.error("获取轮播图失败")
      }
      if (res1.data.status == 0) {
        ;(this.companyInfo.conmapyData = res1.data.results),
          ((<{ [key: string]: any }>this.companyInfo.mainContent) =
            this.companyInfo.conmapyData.filter((item: any, index: any) => {
              return index > 0
            }))
      } else {
        ElMessage.error("获取公司信息失败")
      }
    },
    async getDepartmentInfo() {
      const res = await getDepartment()
      if (res.data.status == 0) {
        this.departmentInfo = JSON.parse(res.data.results.set_value)
      } else {
        ElMessage.error("获取部门信息失败")
      }
    },
    async getProductInfo() {
      const res = await getProduct()
      if (res.data.status == 0 && res.data.results.set_value) {
        if (!res.data.results.set_value) return
        this.productInfo = JSON.parse(res.data.results.set_value)
      } else {
        ElMessage.error("获取商品信息失败")
      }
    },
  },
  persist: {
    key: "settingInfos", // 自定义存储键名
    storage: localStorage,
  },
})
// export const useSettingStore = defineStore(
//   "settingInfo",
//   () => {
//     // swipers，companyInfo就是state
//     const swipers = reactive({
//       swiperData: [
//         {
//           id: 1,
//           set_name: "swiper1",
//           set_value: "",
//         },
//         {
//           id: 2,
//           set_name: "swiper2",
//           set_value: "",
//         },
//         {
//           id: 3,
//           set_name: "swiper3",
//           set_value: "",
//         },
//         {
//           id: 4,
//           set_name: "swiper4",
//           set_value: "",
//         },
//         {
//           id: 5,
//           set_name: "swiper5",
//           set_value: "",
//         },
//         {
//           id: 6,
//           set_name: "swiper6",
//           set_value: "",
//         },
//       ],
//     })
//     const companyInfo: { [key: string]: any } = reactive({
//       conmapyData: [
//         {
//           id: 1,
//           set_name: "company_name",
//           set_value: "",
//         },
//         {
//           id: 2,
//           set_name: "company_introduce",
//           set_value: "",
//         },
//         {
//           id: 3,
//           set_name: "company_structure",
//           set_value: "",
//         },
//         {
//           id: 4,
//           set_name: "company_strategy",
//           set_value: "",
//         },
//         {
//           id: 5,
//           set_name: "company_senior",
//           set_value: "",
//         },
//       ],
//       mainContent: [],
//     })
//     // const mainContent = reactive({})
//     interface setInfoForm {
//       id?: number
//       set_name: string
//       set_value: string
//     }
//     // 公司名称 company_name
//     // 公司介绍 company_introduce
//     // 公司架构 company_structure
//     // 公司战略 company_strategy
//     // 公司高层 company_senior
//     // getSettingInfo
//     async function getSettingInfo() {
//       const res = await getAllSwiper()
//       const res1 = await getCompanyInfo()
//       if (res.data.status == 0) {
//         swipers.swiperData = res.data.results
//       } else {
// ElMessage.error("获取轮播图失败")
//       }
//       if (res1.data.status == 0) {
//         companyInfo.conmapyData = res1.data.results
//         companyInfo.mainContent = companyInfo.conmapyData.filter(
//           (item: any, index: number) => {
//             return index > 0
//           }
//         )
//       } else {
// ElMessage.error("获取公司信息失败")
//       }
//     }

//     return { swipers, companyInfo, getSettingInfo }
//   },
//   {
//     persist: {
//       key: "settingInfos", // 自定义存储键名
//       storage: localStorage,
//     },
//   }
// )
