import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/admin/login',
    },
    {
      path: '/admin/login',
      name: 'admin-login',
      component: () => import('@/layouts/AuthLayout.vue'),
      meta: { requiresGuest: true },
      children: [
        {
          path: '',
          name: 'admin-login-form',
          component: () => import('@/views/auth/Login.vue'),
        },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/dashboard',
        },
        {
          path: 'dashboard',
          name: 'admin-dashboard',
          // dashboard: chỉ cần đăng nhập, mọi role (mod/admin/superadmin) đều vào được
          component: () => import('@/views/dashboard/Dashboard.vue'),
        },

        // ===== USERS - chỉ Admin trở lên =====
        {
          path: 'users',
          name: 'admin-users',
          meta: { requiresAdmin: true },
          component: () => import('@/views/users/UserList.vue'),
        },
        {
          path: 'users/locked',
          name: 'admin-users-locked',
          meta: { requiresAdmin: true },
          component: () => import('@/views/users/LockedUsers.vue'),
        },
        {
          path: 'users/:id',
          name: 'admin-user-detail',
          meta: { requiresAdmin: true },
          component: () => import('@/views/users/UserDetail.vue'),
        },

        // ===== STAFF - chỉ SuperAdmin =====
        {
          path: 'staff',
          name: 'admin-staff',
          component: () => import('@/views/staff/StaffList.vue'),
          meta: { requiresSuperAdmin: true },
        },
        {
          path: 'staff/create',
          name: 'admin-staff-create',
          component: () => import('@/views/staff/CreateStaff.vue'),
          meta: { requiresSuperAdmin: true },
        },

        // ===== POSTS / COMMENTS - Admin trở lên =====
        {
          path: 'posts',
          name: 'admin-posts',
          meta: { requiresAdmin: true },
          component: () => import('@/views/posts/PostList.vue'),
        },
        {
          path: 'posts/locked',
          name: 'admin-posts-locked',
          meta: { requiresAdmin: true },
          component: () => import('@/views/posts/LockedPosts.vue'),
        },
        {
          path: 'posts/:id',
          name: 'admin-post-detail',
          meta: { requiresAdmin: true },
          component: () => import('@/views/posts/PostDetail.vue'),
        },
        {
          path: 'comments/hidden',
          name: 'admin-comments-hidden',
          meta: { requiresAdmin: true },
          component: () => import('@/views/comments/HiddenComments.vue'),
        },

        // ===== REPORTS - Moderator trở lên (mod + admin + superadmin) =====
        {
          path: 'reports',
          name: 'admin-reports',
          component: () => import('@/views/reports/ReportList.vue'),
          meta: { requiresModerator: true },
        },
        {
          path: 'reports/:id',
          name: 'admin-report-detail',
          component: () => import('@/views/reports/ReportDetail.vue'),
          meta: { requiresModerator: true },
        },

        // ===== CATEGORIES - Admin trở lên =====
        {
          path: 'categories',
          name: 'admin-categories',
          meta: { requiresAdmin: true },
          component: () => import('@/views/categories/CategoryList.vue'),
        },

        // ===== APPEARANCE (setting trang) - Admin trở lên =====
        {
          path: 'appearance',
          name: 'admin-appearance',
          meta: { requiresAdmin: true },
          component: () => import('@/views/appearance/Appearance.vue'),
        },

        // ===== ADVERTISEMENTS (quảng cáo) - Admin trở lên =====
        {
          path: 'advertisements',
          name: 'admin-advertisements',
          meta: { requiresAdmin: true },
          component: () => import('@/views/advertisment/index.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: () => '/admin/login',
    },
  ],
})

// Route guards
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()

    // tránh loop vô hạn nếu cùng route
    if (to.path === from.path && to.name === from.name) {
      next()
      return
    }

    // Load user nếu có token mà chưa có user
    if (!authStore.user && authStore.token) {
      if (!localStorage.getItem('user')) {
        authStore.fetchCurrentUser().catch((error) => {
          console.warn('Failed to fetch current user:', error)
          authStore.logout()
        })
      } else {
        authStore.loadUserFromStorage()
      }
    }

    // Route dành cho guest (chưa đăng nhập)
    if (to.meta.requiresGuest) {
      if (authStore.isAuthenticated) {
        if (to.name !== 'admin-dashboard') {
          next({ name: 'admin-dashboard' })
        } else {
          next()
        }
        return
      }
      next()
      return
    }

    // Các route yêu cầu đăng nhập
    if (to.meta.requiresAuth) {
      if (!authStore.isAuthenticated) {
        if (to.name !== 'admin-login' && to.name !== 'admin-login-form') {
          next({ name: 'admin-login', query: { redirect: to.fullPath } })
        } else {
          next()
        }
        return
      }

      // ===== Phân quyền theo role =====
      // requiresAdmin: admin + superadmin
      if (to.meta.requiresAdmin) {
        if (!(authStore.isAdmin || authStore.isSuperAdmin)) {
          if (to.name !== 'admin-dashboard') {
            next({ name: 'admin-dashboard' })
          } else {
            next()
          }
          return
        }
      }

      // requiresModerator: moderator + admin + superadmin
      if (to.meta.requiresModerator) {
        if (!(authStore.isModerator || authStore.isAdmin || authStore.isSuperAdmin)) {
          if (to.name !== 'admin-dashboard') {
            next({ name: 'admin-dashboard' })
          } else {
            next()
          }
          return
        }
      }

      // requiresSuperAdmin: chỉ superadmin
      if (to.meta.requiresSuperAdmin) {
        if (!authStore.isSuperAdmin) {
          if (to.name !== 'admin-dashboard') {
            next({ name: 'admin-dashboard' })
          } else {
            next()
          }
          return
        }
      }
    }

    next()
  } catch (error) {
    console.error('Router error:', error)
    if (to.name !== 'admin-login' && to.name !== 'admin-login-form') {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  }
})

export default router
