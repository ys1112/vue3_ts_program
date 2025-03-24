import { createRouter, createWebHistory } from "vue-router"
// createRouter创建路由
import Login from "@/views/login/Login.vue"
import Menu from "@/views/menus/Menu.vue"
import Home from "@/views/home/Home.vue"
import System from "@/views/system/System.vue";
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
          path: "home",
          component: Home,
        },
        {
          name: "system",
          path: "system",
          component: System,
        },
      ],
    },
  ],
})

export default router
