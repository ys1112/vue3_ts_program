export const MENU_CONFIG = {
  MENU: {
    menus: {
      home: "首页",
      overview: "系统概览",
      user_manage: {
        product_manager: "产品管理员",
        user_manager: "用户管理员",
        message_manager: "消息管理员",
        user_list: "用户列表",
      },
      product_manage: {
        product_list: "产品列表",
        delivery_list: "出库列表",
      },
      message_manage: {
        message_list: "消息列表",
        recycle_bin: "回收站",
      },
      contract_manage: "合同管理",
      operate_log: "操作日志",
      login_log: "登录日志",
      setting: "系统设置",
    },
  },
} as const
