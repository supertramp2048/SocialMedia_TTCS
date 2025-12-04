import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import tailwind from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwind(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  server: {
    port: 5174,
    host: 'localhost', // Chỉ expose trên localhost, không expose ra network
    strictPort: false, // Tự động chuyển port nếu 5174 bị chiếm
    open: false, // Không tự động mở browser
    cors: true,
  }
})

