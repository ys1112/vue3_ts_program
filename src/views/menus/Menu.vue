<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <h4 class="mb-2 menu-title">通用后台管理系统</h4>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
          :default-active="activeMenuItem.activeMenu" text-color="#fff" @select="selectedItem" router
          :unique-opened="true">
          <MenuItem v-for="route in menuData" :key="route.path" :item="route" />
        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">{{ userInfo.name || 'Undefined' }} 欢迎您登录本系统</div>
          <div class="header-right">
            <el-icon size="20" @click="viewDepartmentInfo">
              <el-badge :value="unreadNum" :max="99" :show-zero="false" class="item">
                <Message />
              </el-badge>
            </el-icon>
            <div class="block">
              <el-avatar :size="24" :src="userInfo.image_url || circleUrl" />
            </div>
            <el-dropdown>
              <span class="el-dropdown-link">
                设置
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="setAccount">
                    设置账号
                  </el-dropdown-item>
                  <el-dropdown-item @click="setAvatar">
                    更改头像
                  </el-dropdown-item>
                  <el-dropdown-item @click="LogOut">退出登录</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>
        <div class="bread">
          <Breadcrumb :breadItems="breadItems"></Breadcrumb>
        </div>
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
  <ShowMsgDialog ref="msgDialogRef"></ShowMsgDialog>
  <SetAvatarDialog ref="setAvatarDialogRef"></SetAvatarDialog>
  <SetAccountDialog ref="setAccountDialogRef"></SetAccountDialog>
</template>
<script lang="ts" setup name="Menu">
import MenuItem from "./components/MenuItem.vue";
import Breadcrumb from "@/components/BreadCrumb.vue";
import SetAvatarDialog from "./components/SetAvatarDialog.vue";
import SetAccountDialog from "./components/SetAccountDialog.vue";
import { reactive, toRefs, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useUserInfoStore } from '@/store/userInfoStore'
import { useCommonStore } from '@/store/commonStore'
import { MenusEnum } from '@/contants/MenusEnum'
import ShowMsgDialog from "./components/ShowMsgDialog.vue";
import { MENU_CONFIG } from '@/contants/menuStructure'
import { getCachedRoutes } from "@/utils/auth"
import { io } from 'socket.io-client';

const menus = MENU_CONFIG.MENU.menus
const router = useRouter()
const route = useRoute()
const infoStore = useUserInfoStore()
const { userInfo, departmentMsgData, unreadNum, menuList } = toRefs(infoStore)
const { getUnreadNum } = useUserInfoStore()

const currentDeptId = userInfo.value.department;
// 编码部门名称
const encodedDeptName = encodeURIComponent(currentDeptId);
const msgDialogRef = ref()
const setAvatarDialogRef = ref()
const setAccountDialogRef = ref()
const commonStore = useCommonStore()
let { activeMenuItem, breadItems, getBread } = reactive(commonStore)
const menuData = ref<any[]>([])
// 创建 Socket 实例（替换为实际后端地址）
const socket = io(import.meta.env.VITE_API_URL1, {
  path: '/my-socket-path',
  auth: { token: localStorage.getItem('token') },
  reconnectionAttempts: 3
});
// 实际后端地址,反向代理也需配置
// const socket = io('https://www.gmbksys.xyz', {
//   autoConnect: true,       // 自动连接
//   reconnection: true,      // 自动重连
//   // auth: { 
//   //   token: '用户令牌'      // 认证信息（如 JWT）
//   // }
// });

onMounted(async () => {
  getBread(menus, route.path.slice(1))
  await getUnreadNum()
  menuData.value = JSON.parse(getCachedRoutes())
  // 连接后立即加入部门房间
  socket.emit('joinDeptRoom', encodedDeptName);
  // 监听本部门的新消息
  socket.on('newMessage', async (msg) => {
    console.log('收到部门消息:', msg);
    if (msg) {
      await getUnreadNum()
    }
  });
  // 监听认证失败事件
  socket.on('connect_error', (err) => {
    console.log(err.message);

    // if (err.message === 'Authentication failed') {
    //   ElMessage.error('Token 无效，请重新登录')
    //   window.location.href = '/login';
    // }
  });
  //   socket.on('connect_error', async (err) => {
  //   if (err.message === 'Token expired') {
  //     try {
  //       // 刷新 Token 并重新连接
  //       const { accessToken } = await refreshToken();
  //       socket.auth.token = accessToken;
  //       socket.connect();
  //     } catch {
  //       window.location.href = '/login';
  //     }
  //   }
  // });
  // 保证刷新activeName位置
  for (const key in MenusEnum) {
    if (breadItems.second == MenusEnum[key as keyof typeof MenusEnum]) {
      activeMenuItem.activeMenu = key
      break
    }
    if (breadItems.first == MenusEnum[key as keyof typeof MenusEnum]) {
      activeMenuItem.activeMenu = key
    }
  }
})


const viewDepartmentInfo = () => {
  msgDialogRef.value.open()
}

const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})

const { circleUrl } = toRefs(state)
const selectedItem = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  breadItems.second = ''
  activeMenuItem.activeMenu = key
}
// const getUnreadNum = async () => {
//   if (localStorage.getItem('userId')) {
//     const params = {
//       id: +(localStorage.getItem('userId') as unknown as string)
//     }
//     // 获取用户未读信息read_list
//     const res = await getReadMsg(params)
//     if (res.data.status == 0 && res.data.results.read_status) {
//       userInfo.value.read_list = JSON.stringify(JSON.parse(res.data.results.read_list))
//       unreadNum.value = JSON.parse(res.data.results.read_list).length
//     }
//   }
// }
// 定时器轮询（保底方案）
// const getNum = setInterval(async() => {
//   await getUnreadNum()
// }, 60000);
// 设置头像
const setAvatar = () => {
  setAvatarDialogRef.value.open()
}
const setAccount = () => {
  setAccountDialogRef.value.open()
}
const LogOut = () => {
  // 写在上面，不然重置时会去读取storage里面的值，导致清除不干净
  localStorage.clear()
  sessionStorage.clear()
  // const stores = [useCommonStore(),useSettingStore(), useUserInfoStore()]
  // stores.forEach((store) => {
  //   store.$reset(); // 重置状态到初始值
  //   localStorage.removeItem(store.$id);
  // });
  socket.disconnect()
  router.replace('/login')
}
onUnmounted(() => {
  // clearInterval(getNum)
  socket.disconnect();
})
watch(() => route.path, (newPath) => {
  // 保存面包屑
  getBread(menus, newPath.slice(1))
})
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2a303a;
  color: #fff;

  .header-left {
    font-size: 14px;
  }

  .header-right {
    display: flex;
    align-items: center;

    .block {
      margin: 0 18px;
      cursor: pointer;
    }

    .el-dropdown {
      margin-right: 12px;
    }

    .el-dropdown-link {
      display: flex;
      align-items: center;
      color: #fff;
      cursor: pointer;
      font-size: 16px;
    }
  }
}

.menu-title {
  text-align: center;
  color: #fff;
}

.el-aside {
  background-color: #2a303a;
}

.el-menu {
  height: calc(100vh - 65px);
  border-color: #555c64;
}

.el-main {
  padding: 0;
  background-color: #e6e6e6;
  overflow: auto;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.item {
  margin-right: 12px;
  font-style: normal;
  cursor: pointer;
}

// .el-menu {
//   background-color: #2a303a;
// }
// :deep(.el-menu-item-group__title) {
//   background-color: #2a303a;
// }
.el-menu,
:deep(.el-menu-item),
:deep(.el-menu-item-group__title) {
  background-color: #2a303a;
}
</style>