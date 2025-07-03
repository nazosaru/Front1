import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 3030,  // 前端运行的端口
    proxy: {
      // 将所有以 /api 开头的请求转发到后端服务器
      '/api': {
        target: 'http://192.168.202.239:8000',
        changeOrigin: true,  // 允许代理跨域
        rewrite: (path) => path.replace(/^\/api/, '')  // 重写路径，将 /api 去掉
      }
    }
  }
})

