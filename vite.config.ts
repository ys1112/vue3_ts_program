import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import vueDevTools from "vite-plugin-vue-devtools"
// vite-plugin-vue-setup-extend 修改组件名的插件
import VueNameExtend from 'vite-plugin-vue-setup-extend'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), vueDevTools(),VueNameExtend()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 8080, // 手动配置端口号
    open: true, // 自动打开默认浏览器
    cors:true  // 允许跨域
  },
})
