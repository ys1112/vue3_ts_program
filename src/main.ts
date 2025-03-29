import { createApp } from 'vue'
import App from './App.vue'
// 导入element Plus
import ElementPlus from 'element-plus'
// 导入element样式
import 'element-plus/dist/index.css'
// 导入全局公共样式
import '@/assets/styles/common.scss'
// 导入element图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// 全局配置国际化的配置
import zhCn from 'element-plus/es/locale/lang/zh-cn'
// 引入pinia
import { createPinia } from 'pinia'
// pinia持久化工具
import persistedState from "pinia-plugin-persistedstate";

import 'virtual:svg-icons-register'
import router from './router'
const app = createApp(App)
// 导入所有图标并进行全局注册
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
// 挂载路由
app.use(router)
app.use(createPinia().use(persistedState))
app.use(ElementPlus, {
  locale: zhCn,
})
app.mount('#app')
