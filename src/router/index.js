import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/client/Home/index.vue'
import { useCategoryStore } from '@/stores/categories'
import Cookies from "js-cookie";
import { useToast } from 'vue-toastification';
import { useAuthStore } from '@/stores/auth';
const toast = useToast()
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
      meta: { requiresAuth: true, requiresVerify: true }
    },
    {
      path: '/verify-email/:id/:hash',
      name: 'Xác thực',
      component: () => import('../views/client/verifyEmail/index.vue'),
      meta: { requiresAuth: true  }
    },
    {
      path: '/bai-dang/sua-bai',
      name: 'Sửa bài đăng',
      component: () => import('../views/client/fixArtical/index.vue'),
      meta: { requiresAuth: true, requiresVerify: true }
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
      meta: { requiresAuth: true, requiresVerify: true }
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
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const token = Cookies.get('token')

  // Nếu route cần đăng nhập
  if (to.meta.requiresAuth) {
    // Không có token -> đá về login
    if (!token) {
      auth.resetAuth() // dọn localStorage, cookie, state
      return next()
    }

    // Có token nhưng store chưa có user -> load lại từ local
    if (!auth.user) {
      auth.getUserFromLocal()
      return next()
    }
  }
  if(to.meta.requiresVerify){
    if(!auth.user.email_verified_at){
      toast.error("Bạn cần xác minh tài khoản email để sử dụng tính năng này")
      return next(false)
    }
    else{
      return next()
    }
  }
  // Nếu đã đăng nhập rồi mà vào /login hoặc /dang-ky thì cho về home
  if ((to.path === '/login' || to.path === '/dang-ky') && token) {
    return next('/')
  }

  next()
})
export default router
