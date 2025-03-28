import { createRouter, createWebHistory } from "vue-router"
// createRouter创建路由
import Login from "@/views/login/Login.vue"
import Menu from "@/views/menus/Menu.vue"
import Home from "@/views/home/Home.vue"
import System from "@/views/system/System.vue";
import Setting from "@/views/setting/SysSetting.vue";
import ProductManager from "@/views/user_manage/ProductManager.vue";
const router = createRouter({
  // 创建路由历史模式
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      name: "login",
      path: "/login",
      component: Login,
    },
    {
      name: "menu",
      path: "/menu",
      component: Menu,
      children: [
        {
          name: "home",
          path: "/home",
          component: Home,
        },
        {
          name: "system",
          path: "/system",
          component: System,
        },
        {
          name: "product_manager",
          path: "/product_manager",
          component: ProductManager,
        },
        {
          name: "setting",
          path: "/setting",
          component: Setting,
        },
        
      ],
    },
  ],
})

export default router
