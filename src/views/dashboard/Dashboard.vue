<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Trang chính</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <!-- <StatsCard
        label="Total Users"
        :value="dashBoard?.dashboardData?.counts?.users"
        :icon="UsersIcon"
        icon-bg-class="bg-blue-100"
        icon-class="text-blue-600"
      /> -->
      <!-- thong ke user -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col ">
          <p class="text-lg text-gray-600 font-bold">Người dùng</p>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Tổng số người dùng : <span>{{dashBoard?.dashboardData?.counts?.users}}</span></p>
            <p class="text-sm font-medium text-gray-600">Tổng số tài khoản đang khóa : <span>{{dashBoard?.dashboardData?.counts?.banned_users}}</span></p>
          </div>
        </div>
        </div>

      <!-- thong ke Bài viết -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col ">
          <p class="text-lg text-gray-600 font-bold">Bài viết</p>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Số bài viết : <span>{{dashBoard?.dashboardData?.counts?.posts_total}}</span></p>
            <p class="text-sm font-medium text-gray-600">Số bài viết đang hoạt động: <span>{{dashBoard?.dashboardData?.counts?.posts_published}}</span></p>
            <p class="text-sm font-medium text-gray-600">Số bài viết đang khóa : <span>{{dashBoard?.dashboardData?.counts?.posts_removed}}</span></p>
          </div>
        </div>
        </div>

      <!-- thong ke báo cáo  -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col ">
          <p class="text-lg text-gray-600 font-bold">Báo cáo</p>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Số báo cáo bài viết : <span>{{dashBoard?.dashboardData?.counts?.reports_post}}</span></p>
            <p class="text-sm font-medium text-gray-600">Số báo cáo bình luận : <span>{{dashBoard?.dashboardData?.counts?.reports_comment}}</span></p>
            <p class="text-sm font-medium text-gray-600">Số báo cáo người dùng : <span>{{dashBoard?.dashboardData?.counts?.reports_user}}</span></p>
          </div>
        </div>
        </div>
      <!-- thong ke tháng  -->
      <div class="bg-white rounded-lg shadow p-6">
        <div class="flex flex-col ">
          <p class="text-lg text-gray-600 font-bold">Thống kê tháng qua</p>
          <div class="ml-4 flex-1">
            <p class="text-sm font-medium text-gray-600">Số bài viết mới : <span>{{dashBoard?.dashboardData?.growth?.new_posts_30d}}</span></p>
            <p class="text-sm font-medium text-gray-600">Số người dùng mới : <span>{{dashBoard?.dashboardData?.growth?.new_users_30d}}</span></p>
          </div>
        </div>
        </div>
    </div>

    <!-- Top Posts Section -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Bài viết nổi bật</h2>
      </div>
      <div class="p-6">
        <LoadingSpinner v-if="dashBoard.loading" />
        <div v-else-if="topPosts.length === 0" class="text-center text-gray-500 py-8">
          Chưa có dữ liệu top posts
        </div>
        <div v-else class="space-y-4">
          <router-link
            v-for="post in topPosts"
            :key="post.id"
            :to="`/admin/posts/${post.id}`"
            class="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <!-- Thumbnail -->
            <div v-if="post.thumbnail_url" class="flex-shrink-0">
              <img
                :src="post.thumbnail_url"
                :alt="post.title"
                class="w-20 h-20 object-cover rounded-lg"
              />
            </div>
            <div
              v-else
              class="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center"
            >
              <DocumentTextIcon class="w-8 h-8 text-gray-400" />
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-blue-600 block truncate">
                {{ post.title }}
              </p>
              <div class="flex flex-wrap items-center gap-2 mt-2 text-xs text-gray-500">
                <span v-if="post.user">Bởi {{ post.user.name || 'Unknown' }}</span>
                <span v-if="post.category">• {{ post.category.name || 'Uncategorized' }}</span>
                <span v-if="post.created_at">• {{ formatDate(post.created_at) }}</span>
              </div>
            </div>
          </router-link>
        </div>
        <div v-if="topPosts.length > 0" class="mt-4 text-center">
          <router-link
            to="/admin/posts"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Xem tất cả bài viết →
          </router-link>
        </div>
      </div>
    </div>

    <!-- Top Users Section -->
      <div class="bg-white rounded-lg shadow mb-6">
        <div class="px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-gray-900">Người dùng nổi bật</h2>
        </div>
        <div class="p-6">
          <LoadingSpinner v-if="dashBoard.loading" />
          <div v-else-if="topUsers.length === 0" class="text-center text-gray-500 py-8">
            Chưa có dữ liệu người dùng nổi bật
          </div>

          <div v-else class="space-y-4">
            <!-- THAY div BẰNG router-link Ở ĐÂY -->
            <router-link
              v-for="user in topUsers"
              :key="user.id"
              :to="`/admin/users/${user.id}`"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <!-- User Info -->
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ user.name }}
                </p>
                <p class="text-xs text-gray-500 mt-1 truncate">
                  {{ user.email }}
                </p>
                <div class="flex items-center gap-2 mt-2">
                  <Badge
                    :label="getRoleLabel(user.role)"
                    :variant="getRoleVariant(user.role)"
                  />
                  <span
                    v-if="user.created_at"
                    class="text-xs text-gray-400"
                  >
                    Tham gia {{ formatDate(user.created_at) }}
                  </span>
                </div>
              </div>

              <!-- Verification Status -->
              <div class="flex-shrink-0 ml-4">
                <Badge
                  v-if="user.email_verified_at"
                  label="Đã xác thực"
                  variant="success"
                />
                <Badge
                  v-else
                  label="Chưa xác thực"
                  variant="warning"
                />
              </div>
            </router-link>
          </div>
        </div>
      </div>


    <!-- Recent Reports -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Báo cáo gần đây</h2>
      </div>
      <div class="p-6">
        <LoadingSpinner v-if="loadingReports" />
        <div v-else-if="reports.length === 0" class="text-center text-gray-500 py-8">
          Không có báo cáo nào
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="report in reports.slice(0, 5)"
            :key="report.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900">{{ report.reason }}</p>
              <p class="text-xs text-gray-500 mt-1">
                Báo cáo bởi {{ report.reporter?.name }} • {{ formatDate(report.created_at) }}
              </p>
            </div>
            <Badge :label="report.type || 'Post'" variant="warning" />
          </div>
        </div>
        <div v-if="reports.length > 0" class="mt-4 text-center">
          <router-link
            to="/admin/reports"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
            Xem tất cả →
          </router-link>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { usePostsStore } from '@/stores/posts'
import { useDashboardStore } from '@/stores/dashBoard'
import StatsCard from '@/components/admin/StatsCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/components/common/Badge.vue'
import {
  UsersIcon,
  DocumentTextIcon,
  FlagIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

const dashBoard = useDashboardStore()
const reportsStore = useReportsStore()
const postsStore = usePostsStore()

const reports = ref([])
const posts = ref([])
const loadingReports = ref(false)
const loadingPosts = ref(false)

// Computed properties for dashboard data
const dashboardStats = computed(() => {
  const data = dashBoard.counts
  if (!data || !data.stats) {
    return {
      total_users: 0,
      total_posts: 0,
      total_reports: 0,
      banned_users: 0,
    }
  }
  return {
    data
  }
})

const topPosts = computed(() => {
  const data = dashBoard.dashboardData
  if (!data || !data.top_content || !data.top_content.posts) {
    return []
  }
  return data.top_content.posts.slice(0, 8)
})

const topUsers = computed(() => {
  const data = dashBoard.dashboardData
  if (!data || !data.top_content || !data.top_content.users) {
    return []
  }
  return data.top_content.users.slice(0, 8)
})

// Helper functions
const formatDate = (date) => {
  if (!date) return 'N/A'
  return new Date(date).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

const getStatusVariant = (status) => {
  if (status === 'published') return 'success'
  if (status === 'removed_by_mod') return 'danger'
  return 'warning'
}

const getRoleLabel = (role) => {
  const roleMap = {
    superadmin: 'Super Admin',
    admin: 'Admin',
    moderator: 'Moderator',
    user: 'User',
  }
  return roleMap[role] || role || 'User'
}

const getRoleVariant = (role) => {
  const variantMap = {
    superadmin: 'danger',
    admin: 'warning',
    moderator: 'info',
    user: 'success',
  }
  return variantMap[role] || 'success'
}

// Lifecycle
onMounted(async () => {
  // Fetch dashboard data
  await dashBoard.getDashboardIndex()
  console.log('Dashboard data:', dashBoard.dashboardData)

  // Fetch recent reports
  loadingReports.value = true
  try {
    await reportsStore.fetchPostReports({ limit: 10 })
    reports.value = reportsStore.postReports.map((r) => ({ ...r, type: 'Post' }))
    
    await reportsStore.fetchCommentReports({ limit: 5 })
    reports.value = [
      ...reports.value,
      ...reportsStore.commentReports.map((r) => ({ ...r, type: 'Comment' })),
    ]
    
    await reportsStore.fetchUserReports({ limit: 5 })
    reports.value = [
      ...reports.value,
      ...reportsStore.userReports.map((r) => ({ ...r, type: 'User' })),
    ]
    
    reports.value.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } catch (error) {
    console.error('Failed to fetch reports:', error)
  } finally {
    loadingReports.value = false
  }

})
</script>