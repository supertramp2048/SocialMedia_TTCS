import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/client/Home/index.vue'
import { useCategoryStore } from '@/stores/categories'
import Cookies from "js-cookie";
import { useAuthStore } from '@/stores/auth';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true } 
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/client/about/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/login',
      name: 'Đăng nhập',
      component: () => import('../views/client/login/index.vue'),
    },
    {
      path: '/posts',
      name: 'Tất cả bài viết',
      component: () => import('../views/client/AllPosts/index.vue'),
      meta: { requiresAuth: true } 
    },
  ],
})
router.beforeEach(async (to, from, next)=>{
  console.log('Đi từ:', from.fullPath, '-> tới:', to.fullPath)
  if (to.meta.requiresAuth){
  let token = Cookies.get('token')
  console.log('token ben route', token);
  
  if(token){
    const auth = useAuthStore()
    console.log("token",token);
    let res = await auth.fetchUser()
    console.log(res);
    
  }
}
  next()
})
export default router
