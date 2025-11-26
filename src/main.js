import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import 'vue-loading-overlay/dist/css/index.css'
import App from './App.vue'
import router from './router'
import echo from './plugins/echo'

try {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(Toast, {
    position: 'top-right',
    timeout: 3000,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  })

  // Make echo available globally
  app.config.globalProperties.$echo = echo
  app.provide('echo', echo)
  window.Echo = echo

  app.mount('#app')
} catch (error) {
  console.error('Failed to initialize app:', error)
  document.body.innerHTML = `
    <div style="display: flex; align-items: center; justify-content: center; height: 100vh; font-family: sans-serif;">
      <div style="text-align: center; padding: 20px;">
        <h1 style="color: #ef4444; margin-bottom: 10px;">Application Error</h1>
        <p style="color: #666;">Failed to initialize the application.</p>
        <p style="color: #999; font-size: 12px; margin-top: 10px;">Check the browser console for details.</p>
      </div>
    </div>
  `
}

