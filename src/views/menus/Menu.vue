<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <h4 class="mb-2 menu-title">通用后台管理系统</h4>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
          :default-active="activeMenuItem.activeMenu" text-color="#fff" @select="selectedItem" router :unique-opened="true">
          <el-menu-item index="home">
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <span>首页</span>
            </template>
          </el-menu-item>

          <el-menu-item index="overview">
            <el-icon>
              <Document />
            </el-icon>
            <span>系统概览</span>
          </el-menu-item>

          <el-sub-menu index="user_manage">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item-group title="管理员管理">
              <el-menu-item index="product_manager">产品管理员</el-menu-item>
              <el-menu-item index="user_manager">用户管理员</el-menu-item>
              <el-menu-item index="message_manager">消息管理员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="员工管理">
              <el-menu-item index="user_list">用户列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="product_manage">
            <template #title>
              <el-icon>
                <Box />
              </el-icon>
              <span>产品管理</span>
            </template>
            <el-menu-item-group title="入库管理">
              <el-menu-item index="product_list">产品列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="出库管理">
              <el-menu-item index="delivery_list">出库列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="message_manage">
            <template #title>
              <el-icon>
                <ChatLineSquare />
              </el-icon>
              <span>消息管理</span>
            </template>
            <el-menu-item-group title="消息管理">
              <el-menu-item index="message_list">消息列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="回收站">
              <el-menu-item index="recycle_bin">回收站</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-menu-item index="contract_manage">
            <el-icon>
              <Files />
            </el-icon>
            <span>合同管理</span>
          </el-menu-item>

          <el-menu-item index="operate_log">
            <el-icon>
              <DocumentCopy />
            </el-icon>
            <span>操作日志</span>
          </el-menu-item>

          <el-menu-item index="login_log">
            <el-icon>
              <Memo />
            </el-icon>
            <span>登录日志</span>
          </el-menu-item>

          <el-menu-item index="setting">
            <el-icon>
              <setting />
            </el-icon>
            <span>系统设置</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">{{ userInfo.name || 'Undefined' }} 欢迎您登录本系统</div>
          <div class="header-right">
            <el-icon size="20">
              <Message />
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
                  <el-dropdown-item>设置账号</el-dropdown-item>
                  <el-dropdown-item>更改头像</el-dropdown-item>
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
</template>
<script lang="ts" setup name="Menu">
import Breadcrumb from "@/components/BreadCrumb.vue";
import { reactive, toRefs, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserInfoStore } from '@/store/userInfoStore'
import { useCommonStore } from '@/store/commonStore'
import { useSettingStore } from '@/store/settingInfoStore'
import { MenusEnum } from '@/contants/MenusEnum'

onMounted(() => {
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
const commonStore = useCommonStore()
let { activeMenuItem, breadItems, getBread } = reactive(commonStore)
const infoStore = useUserInfoStore()
const { userInfo } = reactive(infoStore)

const router = useRouter()
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})

const { circleUrl } = toRefs(state)
const selectedItem = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
  breadItems.first = ''
  breadItems.second = ''
  activeMenuItem.activeMenu = key
  if(keyPath.length>1) {
    breadItems.first = MenusEnum[keyPath[0] as keyof typeof MenusEnum]
    breadItems.second = MenusEnum[keyPath[1] as keyof typeof MenusEnum]
  } else {
    breadItems.first = MenusEnum[keyPath[0] as keyof typeof MenusEnum]
  }
  
  sessionStorage.setItem('breadItems', JSON.stringify(breadItems))
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
  router.replace('/login')
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #303133;
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
      color: #a0a5af;
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
  background-color: #555c64;
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
</style>