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
      path: '/bai-dang/viet-bai',
      name: 'Viết bài đăng',
      component: () => import('../views/client/createNewArticale/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/bai-dang/sua-bai',
      name: 'Sửa bài đăng',
      component: () => import('../views/client/fixArtical/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/dang-ky',
      name: 'Đăng ký tài khoản',
      component: () => import('../views/client/register/index.vue')
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
      path: '/bai-dang',
      name: 'Chi tiết bài đăng',
      component: () => import('../views/client/postDetail/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/tim-kiem',
      name: 'Tìm kiếm',
      component: () => import('../views/client/searchPage/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/nhan-tin',
      name: 'chat',
      component: () => import('../views/client/chat/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/nguoi-dung/:name',
      name: 'Trang cá nhân',
      component: () => import('../views/client/profilePage/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/password-reset/:token',
      name: 'Đặt lại mật khẩu',
      component: () => import('../views/client/forgotPassword/resetPassword.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/quen-mat-khau',
      name: 'Quên mật khẩu',
      component: () => import('../views/client/forgotPassword/index.vue'),
      meta: { requiresAuth: true } 
    },
    {
      path: '/nguoi-dung/cai-dat',
      name: 'Trang tùy chỉnh tài khoản',
      component: () => import('../views/client/userSetting/index.vue'),
      meta: { requiresAuth: true } 
    }
  ],
  // scrollBehavior(to, from, savedPosition) {
  //   // Nếu người dùng bấm Back/Forward thì giữ nguyên vị trí cuộn
  //   if (savedPosition) {
  //     return savedPosition
  //   } else {
  //     // Khi điều hướng trang mới → cuộn lên đầu
  //     return { top: 0 }
  //   }
  // }
})
router.beforeEach(async (to, from, next)=>{
  //console.log("lấy user từ local");
  
  if (to.meta.requiresAuth){
  let token = Cookies.get('token')  
  if(token){
    const auth = useAuthStore()
    auth.getUserFromLocal()
  }
}
  next()
},
)
export default router
