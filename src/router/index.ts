import { createRouter, createWebHistory } from "vue-router"
// createRouter创建路由
import Menu from "@/views/menus/Menu.vue"

const router = createRouter({
  // 创建路由历史模式
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      redirect: "/login",
    },
    {
      path: "/login",
      component: () => import("@/views/login/Login.vue"),
      name: "Login",
    },
    {
      name: "Menu",
      path: "/menu",
      component: Menu,
      children: [
        {
          name: "Home",
          path: "/home",
          component: () => import("@/views/home/Home.vue"),
        },
        {
          name: "Overview",
          path: "/overview",
          component: () => import("@/views/overview/Overview.vue"),
        },
        {
          name: "ProductManager",
          path: "/product_manager",
          component: () => import("@/views/user_manage/product_manage/ProductManager.vue"),
        },
        {
          name: "UserManager",
          path: "/user_manager",
          component: () => import("@/views/user_manage/user_manage/UserManager.vue"),
        },
        {
          name: "MessageManager",
          path: "/message_manager",
          component: () => import("@/views/user_manage/message_manage/MessageManager.vue"),
        },
        {
          name: "UserList",
          path: "/user_list",
          component: () => import("@/views/user_manage/user_list/UserList.vue"),
        },
        {
          name: "ProductList",
          path: "/product_list",
          component: () => import("@/views/product_manage/product_list/ProductList.vue"),
        },
        {
          name: "DeliveryList",
          path: "/delivery_list",
          component: () => import("@/views/product_manage/delivery_list/DeliveryList.vue"),
        },
        {
          name: "MessageList",
          path: "/message_list",
          component: () => import("@/views/message_manage/message_list/MessageList.vue"),
        },
        {
          name: "RecycleBin",
          path: "/recycle_bin",
          component: () => import("@/views/message_manage/recycle_bin/RecycleBin.vue"),
        },
        {
          name: "ContractManage",
          path: "/contract_manage",
          component: () => import("@/views/contract_manage/ContractManage.vue"),
        },
        {
          name: "OperateLog",
          path: "/operate_log",
          component: () => import("@/views/operate_log/OperateLog.vue"),
        },
        {
          name: "LoginLog",
          path: "/login_log",
          component: () => import("@/views/login_log/LoginLog.vue"),
        },
        {
          name: "Setting",
          path: "/setting",
          component: () => import("@/views/setting/SysSetting.vue"),
        },
      ],
    },
  ],
})

export default router
