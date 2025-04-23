/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_URL: string;  // 你的环境变量
  readonly VITE_API_URL: string;  // 你的环境变量
  readonly VITE_API_URL1: string;  // 你的环境变量
  // 其他变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;  // 绑定到 ImportMeta 类型
}