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
          component: () => import('@/views/dashboard/Dashboard.vue'),
        },
        {
          path: 'users',
          name: 'admin-users',
          component: () => import('@/views/users/UserList.vue'),
        },
        {
          path: 'users/locked',
          name: 'admin-users-locked',
          component: () => import('@/views/users/LockedUsers.vue'),
        },
        {
          path: 'users/:id',
          name: 'admin-user-detail',
          component: () => import('@/views/users/UserDetail.vue'),
        },
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
        {
          path: 'posts',
          name: 'admin-posts',
          component: () => import('@/views/posts/PostList.vue'),
        },
        {
          path: 'posts/locked',
          name: 'admin-posts-locked',
          component: () => import('@/views/posts/LockedPosts.vue'),
        },
        {
          path: 'posts/:id',
          name: 'admin-post-detail',
          component: () => import('@/views/posts/PostDetail.vue'),
        },
        {
          path: 'comments/hidden',
          name: 'admin-comments-hidden',
          component: () => import('@/views/comments/HiddenComments.vue'),
        },
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
        {
          path: 'categories',
          name: 'admin-categories',
          component: () => import('@/views/categories/CategoryList.vue'),
        },
        {
          path: 'appearance',
          name: 'admin-appearance',
          component: () => import('@/views/appearance/Appearance.vue'),
        },
      ],
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: (to) => {
        // Redirect 404 to login instead of dashboard to avoid infinite loop
        return '/admin/login'
      },
    },
  ],
})

// Route guards
router.beforeEach(async (to, from, next) => {
  try {
    const authStore = useAuthStore()

    // Prevent infinite redirects - if same path, just continue
    if (to.path === from.path && to.name === from.name) {
      next()
      return
    }

    // Load user from storage if not loaded (non-blocking)
    if (!authStore.user && authStore.token) {
      // Don't await - let it load in background to avoid blocking navigation
      authStore.fetchCurrentUser().catch((error) => {
        console.warn('Failed to fetch current user:', error)
        authStore.logout()
      })
    }

    // Check if route requires guest (not authenticated)
    if (to.meta.requiresGuest) {
      if (authStore.isAuthenticated) {
        // User is logged in, redirect to dashboard
        if (to.name !== 'admin-dashboard') {
          next({ name: 'admin-dashboard' })
        } else {
          next()
        }
        return
      }
      // User is not logged in, allow access to login page
      next()
      return
    }

    // Check if route requires authentication
    if (to.meta.requiresAuth) {
      if (!authStore.isAuthenticated) {
        // User is not logged in, redirect to login
        if (to.name !== 'admin-login' && to.name !== 'admin-login-form') {
          next({ name: 'admin-login', query: { redirect: to.fullPath } })
        } else {
          next()
        }
        return
      }

      // User is authenticated, check roles
      // Check if route requires admin role
      if (to.meta.requiresAdmin && !authStore.isAdmin) {
        if (to.name !== 'admin-dashboard') {
          next({ name: 'admin-dashboard' })
        } else {
          next()
        }
        return
      }

      // Check if route requires moderator role
      if (to.meta.requiresModerator && !authStore.isModerator) {
        if (to.name !== 'admin-dashboard') {
          next({ name: 'admin-dashboard' })
        } else {
          next()
        }
        return
      }

      // Check if route requires superadmin role
      if (to.meta.requiresSuperAdmin && !authStore.isSuperAdmin) {
        if (to.name !== 'admin-dashboard') {
          next({ name: 'admin-dashboard' })
        } else {
          next()
        }
        return
      }
    }

    // No restrictions, allow navigation
    next()
  } catch (error) {
    console.error('Router error:', error)
    // Fallback to login page on error, but prevent loop
    if (to.name !== 'admin-login' && to.name !== 'admin-login-form') {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  }
})

export default router

