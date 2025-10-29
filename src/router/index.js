import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/client/Home/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/client/about/index.vue'),
    },
    {
      path: '/login',
      name: 'Đăng nhập',
      component: () => import('../views/client/login/index.vue'),
    },
  ],
})

export default router
