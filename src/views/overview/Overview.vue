<template>
  <div class="common-wrapper">
    <!-- 顶部 -->
    <div class="overview-content overview-content-top">
      <el-row :gutter="16">
        <!-- 用户信息 -->
        <el-col :span="12">
          <div class="bg user-info">
            <!-- 用户信息左侧 -->
            <div class="user-info-belongs">
              <el-image style="width: 100px; height: 100px;border-radius: 50%;" :src="userInfo.image_url || circleUrl"
                fit="cover" />
              <p>所属部门：{{ userInfo.department }}</p>
              <p>所属公司：{{ conmapyData[0].set_value }}</p>
            </div>
            <!-- 用户信息右侧 -->
            <div class="user-info-detail">
              <p>姓名：{{ userInfo.name }}</p>
              <p>性别：{{ userInfo.gender }}</p>
              <p>身份：{{ userInfo.identity }}</p>
              <p>分管领域：{{ userInfo.department }}</p>
              <p>权限：{{ getPermission(userInfo.identity) }}</p>
            </div>
          </div>
        </el-col>
        <!-- 管理与用户对比图 -->
        <el-col :span="12">
          <div class="bg">
            <div ref="manageUserRef" style="width: 100%; height: 240px; padding: 8px;"></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 中间 -->
    <div class="overview-content overview-content-body">
      <el-row :gutter="16">
        <!-- 产品类别库存总价图 -->
        <el-col :span="14">
          <div class="bg">
            <div ref="productCategoryRef" style="width: 100%; height: 240px; padding: 8px;"></div>
          </div>
        </el-col>
        <!-- 常用管理 -->
        <el-col :span="10">
          <div class="bg common-manage">
            <div class="title">
              常用管理
            </div>
            <div class="common-manage-content">
              <div class="manage-item" v-for="item in commonManages" :key="item.id" @click="goCommonManage(item.path)">
                <SvgIcon :icon-name="item.svgName" size="24" color="#303133"></SvgIcon>
                <div class="manage-item-name">{{ item.title }}</div>
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <!-- 底部 -->
    <div class="overview-content overview-content-bottom">
      <el-row :gutter="16">
        <!-- 公告等级分布图 -->
        <el-col :span="7">
          <div class="bg">
            <div ref="announcementLevelRef" style="width: 100%; height: 280px; padding: 8px;"></div>
          </div>
        </el-col>
        <!-- 每日登录人数图 -->
        <el-col :span="17">
          <div class="bg">
            <div ref="loginCountRef" style="width: 100%; height: 280px; padding: 8px;"></div>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script lang="ts" setup name="Overview">
import { ref, reactive, onMounted, toRefs } from 'vue'
import { useCommonStore } from '@/store/commonStore'
import { useUserInfoStore } from '@/store/userInfoStore'
import { useSettingStore } from '@/store//settingInfoStore'
import { useRouter } from 'vue-router'
import { MENU_CONFIG } from '@/contants/menuStructure'
import { getUserData, getMsgLvData, getPriceData, getLoginCount } from "@/api/setting";
import SvgIcon from "@/components/SvgIcon.vue"
import * as echarts from 'echarts'
const { activeMenuItem, getBread } = reactive(useCommonStore())
const menus = MENU_CONFIG.MENU.menus

const router = useRouter()

const manageUserRef = ref(null)
const productCategoryRef = ref(null)
const loginCountRef = ref(null)
const announcementLevelRef = ref(null)

// 用户类别数据[{ value: 1, name: '超级管理员' }],
const userData = ref([])
// 产品类别库存总价数据
// [
// 12000,
//   8300,
//   25000,
// {
//   value: 15200,
//   itemStyle: {
//     color: '#a90000'
//   }
// },
// ],

let categoryData = ref([] as any[])
let allPriceData = ref([] as any[])

// 公告等级数据
// data: [
//         { value: 12, name: '一般' },
//         { value: 2, name: '重要' },
//         { value: 1, name: '必要' },
//       ],
const msgLevelData = ref([])
// 登录人数数据 data: [12, 5, 3, 11, 7, 16, 8],
let loginTimeyData = ref([] as any[])
let loginCountData = ref([] as any[])
const infoStore = useUserInfoStore()
const settingStore = useSettingStore()
const { userInfo } = reactive(infoStore)
const { companyInfo: { conmapyData } } = reactive(settingStore)
const commonManages = reactive([
  {
    id: 1,
    svgName: 'userManage',
    title: '用户管理',
    path: 'productManager'

  },
  {
    id: 2,
    svgName: 'productManage',
    title: '产品管理',
    path: 'productList'
  },
  {
    id: 3,
    svgName: 'systemInform',
    title: '系统消息',
    path: 'messageList'
  },
  {
    id: 4,
    svgName: 'userInfo',
    title: '个人信息',
    path: 'setting'
  },
  {
    id: 5,
    svgName: 'departmentMessage',
    title: '部门信息',
    path: 'messageList'
  },
  {
    id: 6,
    svgName: 'systemSetting',
    title: '系统设置',
    path: 'setting'
  }
])
const getPermission = (identity: string) => {
  if (identity == '系统管理员') {
    return '最高权限'
  } else {
    return identity
  }
}

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})
const { circleUrl } = toRefs(state)
const goCommonManage = (path: string) => {
  // 保存面包屑
  getBread(menus, path)
  router.push({
    path
  })
}

onMounted(async () => {
  const userRes = await getUserData()
  if (userRes.data.status == 0) {
    userData.value = userRes.data.results
  }
  const msgRes = await getMsgLvData()
  if (msgRes.data.status == 0) {
    msgLevelData.value = msgRes.data.results
  }
  const priceRes = await getPriceData()
  if (priceRes.data.status == 0) {
    if (priceRes.data.results.length > 0) {
      // 创建有数序的Map键值对
      let catePriceMap = new Map(priceRes.data.results.map((row: any) => [row.category, row.total]))
      // 获取keys作为柱状图的X轴坐标
      categoryData.value = [...catePriceMap.keys()] as any
      // 获取values作为柱状图的Y轴数据
      allPriceData.value = [...catePriceMap.values()] as any
      // 给最大值添加样式
      const max = Math.max(...allPriceData.value)
      allPriceData.value = allPriceData.value.map(item => item == max ? {
        value: item,
        itemStyle: {
          color: '#a90000'
        }
      } : item)
    }
  }
  const loginRes = await getLoginCount()
    if (loginRes.data.status == 0) {
      let countMap = new Map(loginRes.data.results.map((row: any) => [row.date, row.count]))
      loginTimeyData.value = [...countMap.keys()] as any
      loginCountData.value = [...countMap.values()] as any
  }

  // 管理与用户饼图
  const manageUserPie = echarts.init(manageUserRef.value);
  manageUserPie.setOption({
    title: {
      text: '管理与用户管理图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item'
    },
    // 数据类别分组示例
    legend: {
      orient: 'vertical',
      left: 'left'
    },
    series: [
      {
        // name: 'Access From',
        type: 'pie',
        top: '15%',
        radius: '70%',
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: userData.value,
      }
    ]
  });
  // 产品类别柱状图 
  const productCategoryBar = echarts.init(productCategoryRef.value);
  productCategoryBar.setOption({
    title: {
      text: '产品类别库存总价图',
    },
    tooltip: {
      trigger: 'item'
    },
    // 数据类别分组示例
    xAxis: {
      type: 'category',
      data: categoryData.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'bar',
        // 柱条宽度
        barWidth: '20%',

        // 柱条样式
        itemStyle: {
          borderRadius: 5,
          borderWidth: 1,
          borderType: 'solid',
          borderColor: '#73c0de',
          shadowColor: '#5470c6',
          shadowBlur: 3
        },
        // 鼠标悬浮高亮的样式
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: allPriceData.value,
      }
    ]
  });
  // 登陆人数折线图
  const loginCountBar = echarts.init(loginCountRef.value);
  loginCountBar.setOption({
    title: {
      text: '每日登录人数图',
    },
    tooltip: {
      trigger: 'item'
    },
    // 数据类别分组示例
    xAxis: {
      type: 'category',
      data: loginTimeyData.value
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        type: 'line',
        smooth: true,
        // 鼠标悬浮高亮的样式
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: loginCountData.value,
      }
    ]
  });
  // 公告等级环状图
  const announcementLevelPie = echarts.init(announcementLevelRef.value);
  announcementLevelPie.setOption({
    title: {
      text: '公告等级分布图',
      left: 'left'
    },
    tooltip: {
      trigger: 'item'
    },
    // 小标题
    legend: {
      top: '2%',
      left: '32%',
    },
    series: [
      {
        name: 'Access From',
        type: 'pie',
        // 第一个值是内半径，第二个值是外半径
        radius: ['35%', '65%'],
        avoidLabelOverlap: false,
        // 环状块间距
        padAngle: 2,
        itemStyle: {
          // 环状块圆角
          borderRadius: 5,
        },
        // 环周围鼠标悬浮提示文本
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          // 环中间选中提示
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        data: msgLevelData.value,
      }
    ]
  });
})
</script>

<style lang="scss" scoped>
.overview-content {
  margin: 13px 16px 0px;
  border-radius: 10px;

  .bg {
    background-color: #fafafa;
    border-radius: 10px;
    height: 100%;
  }

}

.overview-content-top {
  // height: 100%;
  height: 240px;

  .user-info {
    display: flex;
    padding: 24px;

    .user-info-belongs {
      width: 50%;
      text-align: center;
      border-right: 2px solid #ccc;

      p {
        color: #303133;
        font-size: 14px;
      }
    }

    .user-info-detail {
      flex: 1;
      padding-left: 48px;

      p {
        color: #303133;
        font-size: 14px;
      }
    }
  }
}

.overview-content-body {
  // height: 100%;
  height: 240px;

  .common-manage {
    padding: 8px;
    cursor: pointer;

    .title {
      font-size: 16px;
      font-weight: 700;
      color: #303133;
    }

    .common-manage-content {
      height: calc(100% - 22px);
      display: grid;
      /* 设置四列列宽 宽度都为22%*/
      grid-template-columns: repeat(4, 22%);
      /* 设置两行行高 高度都为50% */
      grid-template-rows: 85px 85px;
      grid-column-gap: 16px;
      grid-row-gap: 16px;
      padding: 8px;

      .manage-item {
        background-color: #E6E8EB;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border-radius: 8px;

        &:hover {
          background-color: #d9ecff;
        }

        .manage-item-name {
          margin-top: 4px;
          font-size: 14px;
          color: #303133;
        }
      }
    }
  }
}

.overview-content-bottom {
  // height: 100%;
  height: 280px;
}

.el-row {
  height: 100%;
}
</style>