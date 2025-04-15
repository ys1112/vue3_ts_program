<template>
  <!-- <div class="container">
    <h1>404 - Page Not Found</h1>
    <p>您访问的页面不存在</p>
    <router-link to="/home">返回首页</router-link>
    </div> -->
  <div class="not-found">
    <el-result title="404 - Page Not Found" sub-title="您访问的页面不存在">
      <template #icon>
        <el-image src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png" />
      </template>
      <template #extra>
        <el-button type="primary" @click="toHome">返回首页</el-button>
      </template>
    </el-result>
  </div>
</template>
<script lang="ts" setup name="404">
import { onMounted, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCommonStore } from '@/store/commonStore'
import { MENU_CONFIG } from '@/contants/menuStructure'
const router = useRouter()
const menus = MENU_CONFIG.MENU.menus
const {  getBread,breadItems,activeMenuItem } = useCommonStore()
onMounted(()=>{
  breadItems.first=''
  breadItems.second=''
  activeMenuItem.activeMenu=''
})
const toHome = ()=>{
  router.replace({
    path:'/home'
  })
  getBread(menus, 'home')
}
</script>
<style scoped>
.not-found {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>