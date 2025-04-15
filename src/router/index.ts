import { createRouter, createWebHistory } from "vue-router"
import { getCachedRoutes } from "@/utils/auth"
import { ref } from "vue"
import { formatRoutes } from "./asyncRoute"

const adminMenu = [
  {
    path: "/home",
    name: "Home",
    meta: {
      title: "首页",
      icon: "house",
    },
    component: "home/Home",
    hidden: 0,
  },
  {
    path: "/overview",
    name: "Overview",
    meta: {
      title: "系统概览",
      icon: "document",
    },
    component: "overview/Overview",
    hidden: 0,
  },
  {
    path: "userManage",
    meta: {
      title: "用户管理",
      icon: "user",
    },
    hidden: 1,
    children: [
      {
        path: "/productManager",
        name: "ProductManager",
        meta: {
          title: "产品管理员",
          icon: "",
        },
        component: "userManage/ProductManager",
      },
      {
        path: "/userManager",
        name: "UserManager",
        meta: {
          title: "用户管理员",
          icon: "",
        },
        component: "userManage/UserManager",
      },
      {
        path: "/messageManager",
        name: "MessageManager",
        meta: {
          title: "消息管理员",
          icon: "",
        },
        component: "userManage/MessageManager",
      },
      {
        path: "/userList",
        name: "UserList",
        meta: {
          title: "用户列表",
          icon: "",
        },
        component: "userManage/UserList",
      },
    ],
  },
  {
    path: "productManage",
    hidden: 1,
    meta: {
      title: "产品管理",
      icon: "box",
    },
    children: [
      {
        path: "/productList",
        name: "ProductList",
        meta: {
          title: "产品列表",
          icon: "",
        },
        component: "productManage/ProductList",
      },
      {
        path: "/deliveryList",
        name: "DeliveryList",
        meta: {
          title: "出库列表",
          icon: "",
        },
        component: "productManage/DeliveryList",
      },
    ],
  },
  {
    path: "messageManage",
    hidden: 1,
    meta: {
      title: "消息管理",
      icon: "chatLineSquare",
    },
    children: [
      {
        path: "/messageList",
        name: "MessageList",
        meta: {
          title: "消息列表",
          icon: "",
        },
        component: "messageManage/MessageList",
      },
      {
        path: "/recycleBin",
        name: "RecycleBin",
        meta: {
          title: "回收站",
          icon: "",
        },
        component: "messageManage/RecycleBin",
      },
    ],
  },
  {
    path: "/contractManage",
    name: "ContractManage",
    meta: {
      title: "合同管理",
      icon: "files",
    },
    component: "contractManage/ContractManage",
    hidden: 0,
  },
  {
    path: "/operateLog",
    name: "OperateLog",
    meta: {
      title: "操作日志",
      icon: "documentCopy",
    },
    component: "operateLog/OperateLog",
    hidden: 0,
  },
  {
    path: "/loginLog",
    name: "LoginLog",
    meta: {
      title: "登录日志",
      icon: "memo",
    },
    component: "loginLog/LoginLog",
    hidden: 0,
  },
  {
    path: "/setting",
    name: "Setting",
    meta: {
      title: "系统设置",
      icon: "setting",
    },
    component: "setting/Setting",
    hidden: 0,
  },
]
const routes = ref(formatRoutes(adminMenu))

// createRouter创建路由
const router = createRouter({
  // 创建路由历史模式
  history: createWebHistory(),
  routes: [
    {
      path:"/404",
      name:"404",
      component:import("@/views/error/404.vue")
    },
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
      component: () => import("@/views/menus/Menu.vue"),
      children: [],
      // children: routes.value,
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/404'
    }
  ],
})
// 全局前置守卫
router.beforeEach((to, from) => {
  try {
    // 检查目标路由是否需要认证
    // 登录状态检查
    const isAuthenticated = localStorage.getItem("token") // 假设存在token
    // 情况1：需要登录但未登录
    if (
      !isAuthenticated &&
      // 避免无限重定向
      to.name !== "Login"
    ) {
      localStorage.clear()
      // 未登录，重定向到登录页并携带原路径
      return {
        path: "/login",
      }
    }

    // 情况2：已登录时禁止访问登录页
    if (to.path === "/login" && isAuthenticated) {
      return { name: "Home" } // 重定向到首页
      // return { path: '/home' } // 重定向到首页
    }

    // 情况4：正常放行
    return true
  } catch (err) {
    console.error("路由加载失败:", err)
    return {
      path: "/login",
    }
  }
})
export default router
