import { createRouter, createWebHistory } from "vue-router"
// createRouter创建路由
import Login from "@/views/login/Login.vue"
import Menu from "@/views/menus/Menu.vue"
import Home from "@/views/home/Home.vue"
import Overview from "@/views/overview/Overview.vue";
import Setting from "@/views/setting/SysSetting.vue";
import ProductManager from "@/views/user_manage/product_manage/ProductManager.vue";
import UserManager from "@/views/user_manage/user_manage/UserManager.vue";
import MessageManager from "@/views/user_manage/message_manage/MessageManager.vue";
import UserList from "@/views/user_manage/user_list/UserList.vue";
import ProductList from "@/views/product_manage/product_list/ProductList.vue";
import MessageList from "@/views/message_manage/message_list/MessageList.vue";
import RecycleBin from "@/views/message_manage/recycle_bin/RecycleBin.vue";
import DeliveryList from "@/views/product_manage/delivery_list/DeliveryList.vue";
import ContractManage from "@/views/contract_manage/ContractManage.vue";
import OperateLog from "@/views/operate_log/OperateLog.vue";
import LoginLog from "@/views/login_log/LoginLog.vue";
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
          name: "overview",
          path: "/overview",
          component: Overview,
        },
        {
          name: "product_manager",
          path: "/product_manager",
          component: ProductManager,
        },
        {
          name: "user_manager",
          path: "/user_manager",
          component: UserManager,
        },
        {
          name: "message_manager",
          path: "/message_manager",
          component: MessageManager,
        },
        {
          name: "user_list",
          path: "/user_list",
          component: UserList,
        },
        {
          name: "product_list",
          path: "/product_list",
          component: ProductList,
        },
        {
          name: "delivery_list",
          path: "/delivery_list",
          component: DeliveryList,
        },
        {
          name: "message_list",
          path: "/message_list",
          component: MessageList,
        },
        {
          name: "recycle_bin",
          path: "/recycle_bin",
          component: RecycleBin,
        },
        {
          name: "contract_manage",
          path: "/contract_manage",
          component: ContractManage,
        },
        {
          name: "operate_log",
          path: "/operate_log",
          component: OperateLog,
        },
        {
          name: "login_log",
          path: "/login_log",
          component: LoginLog,
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
