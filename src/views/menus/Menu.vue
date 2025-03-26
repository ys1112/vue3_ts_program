<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">
        <h4 class="mb-2 menu-title">通用后台管理系统</h4>
        <el-menu active-text-color="#ffd04b" background-color="#545c64" class="el-menu-vertical-demo"
          default-active="home" text-color="#fff" @open="handleOpen" @close="handleClose" router>
          <el-menu-item index="home">
            <template #title>
              <el-icon>
                <House />
              </el-icon>
              <span>首页</span>
            </template>
          </el-menu-item>

          <el-menu-item index="system">
            <el-icon>
              <Document />
            </el-icon>
            <span>系统概览</span>
          </el-menu-item>

          <el-sub-menu index="3">
            <template #title>
              <el-icon>
                <User />
              </el-icon>
              <span>用户管理</span>
            </template>
            <el-menu-item-group title="管理员管理">
              <el-menu-item index="3-1">产品管理员</el-menu-item>
              <el-menu-item index="3-2">用户管理员</el-menu-item>
              <el-menu-item index="3-3">消息管理员</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="员工管理">
              <el-menu-item index="3-4">员工列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="4">
            <template #title>
              <el-icon>
                <Box />
              </el-icon>
              <span>产品管理</span>
            </template>
            <el-menu-item-group title="入库管理">
              <el-menu-item index="4-1">产品列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="出库管理">
              <el-menu-item index="4-2">出库列表</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-sub-menu index="5">
            <template #title>
              <el-icon>
                <ChatLineSquare />
              </el-icon>
              <span>消息管理</span>
            </template>
            <el-menu-item-group title="消息管理">
              <el-menu-item index="5-1">消息列表</el-menu-item>
            </el-menu-item-group>
            <el-menu-item-group title="回收站">
              <el-menu-item index="5-2">回收站</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>

          <el-menu-item index="6">
            <el-icon>
              <Files />
            </el-icon>
            <span>合同管理</span>
          </el-menu-item>

          <el-menu-item index="7">
            <el-icon>
              <DocumentCopy />
            </el-icon>
            <span>操作日志</span>
          </el-menu-item>

          <el-menu-item index="8">
            <el-icon>
              <Memo />
            </el-icon>
            <span>登录日志</span>
          </el-menu-item>

          <el-menu-item index="system">
            <el-icon>
              <setting />
            </el-icon>
            <span>系统设置</span>
          </el-menu-item>

        </el-menu>
      </el-aside>
      <el-container>
        <el-header>
          <div class="header-left">{{ userStore.userName || '————'  }} 欢迎您登录本系统</div>
          <div class="header-right">
            <el-icon size="20">
              <Message />
            </el-icon>
            <div class="block">
              <el-avatar :size="24" :src="circleUrl" />
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
        <el-main>
          <RouterView></RouterView>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script lang="ts" setup name="Menu">
import { reactive, toRefs, ref} from 'vue'
import { useRouter } from 'vue-router'
import { useInfoStore } from '@/store/userInfo'

const userStore = useInfoStore()
const router = useRouter()
const state = reactive({
  circleUrl:
    'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
})

const { circleUrl } = toRefs(state)

const handleOpen = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const handleClose = (key: string, keyPath: string[]) => {
  console.log(key, keyPath)
}
const LogOut = () => {
  localStorage.removeItem('token')
  router.replace('/login')
}
</script>

<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #4a5057;
  color: #fff;

  .header-left {
    font-size: 14px;
  }

  .header-right {
    display: flex;
    align-items: center;

    .block {
      margin: 0 20px;
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

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}
</style>