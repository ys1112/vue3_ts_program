export const MENU_CONFIG = {
  MENU: {
    menus: {
      home: "首页",
      overview: "系统概览",
      userManage: {
        productManager: "产品管理员",
        userManager: "用户管理员",
        messageManager: "消息管理员",
        userList: "用户列表",
      },
      productManage: {
        productList: "产品列表",
        deliveryList: "出库列表",
      },
      messageManage: {
        messageList: "消息列表",
        recycleBin: "回收站",
      },
      contractManage: "合同管理",
      operateLog: "操作日志",
      loginLog: "登录日志",
      setting: "系统设置",
    },
  },
} as const
