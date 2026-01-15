import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
// thư viện popup
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'

import { useCategoryStore } from '@/stores/categories'
const app = createApp(App)

app.use(createPinia())

const categoryStore = useCategoryStore()
await categoryStore.ensureLoaded()

app.use(router)
app.use(Toast, {
  position: 'top-right',
  timeout: 2500,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
})
app.mount('#app')

