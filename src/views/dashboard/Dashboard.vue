<template>
  <div>
<<<<<<< HEAD
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Trang chính</h1>
=======
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
>>>>>>> oldrepo/adminFrontOnly

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
      <StatsCard
        label="Total Users"
        :value="stats.total_users || 0"
        :icon="UsersIcon"
        icon-bg-class="bg-blue-100"
        icon-class="text-blue-600"
      />
      <StatsCard
        label="Total Posts"
        :value="stats.total_posts || 0"
        :icon="DocumentTextIcon"
        icon-bg-class="bg-green-100"
        icon-class="text-green-600"
      />
      <StatsCard
        label="Total Reports"
        :value="stats.total_reports || 0"
        :icon="FlagIcon"
        icon-bg-class="bg-red-100"
        icon-class="text-red-600"
      />
      <StatsCard
        label="Banned Users"
        :value="stats.banned_users || 0"
        :icon="UserGroupIcon"
        icon-bg-class="bg-yellow-100"
        icon-class="text-yellow-600"
      />
    </div>

    <!-- Recent Reports -->
    <div class="bg-white rounded-lg shadow mb-6">
      <div class="px-6 py-4 border-b border-gray-200">
<<<<<<< HEAD
        <h2 class="text-lg font-semibold text-gray-900">Báo cáo gần đây </h2>
=======
        <h2 class="text-lg font-semibold text-gray-900">Recent Reports</h2>
>>>>>>> oldrepo/adminFrontOnly
      </div>
      <div class="p-6">
        <LoadingSpinner v-if="loadingReports" />
        <div v-else-if="reports.length === 0" class="text-center text-gray-500 py-8">
<<<<<<< HEAD
          Không có báo cáo nào
=======
          No reports found
>>>>>>> oldrepo/adminFrontOnly
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
<<<<<<< HEAD
                Báo cáo bởi {{ report.reporter?.name }} • {{ formatDate(report.created_at) }}
=======
                Reported by {{ report.reporter?.name }} • {{ formatDate(report.created_at) }}
>>>>>>> oldrepo/adminFrontOnly
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
<<<<<<< HEAD
            Xem tất cả →
=======
            View all reports →
>>>>>>> oldrepo/adminFrontOnly
          </router-link>
        </div>
      </div>
    </div>

    <!-- Recent Posts -->
    <div class="bg-white rounded-lg shadow">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Recent Posts</h2>
      </div>
      <div class="p-6">
        <LoadingSpinner v-if="loadingPosts" />
        <div v-else-if="posts.length === 0" class="text-center text-gray-500 py-8">
<<<<<<< HEAD
          Không có post nào
=======
          No posts found
>>>>>>> oldrepo/adminFrontOnly
        </div>
        <div v-else class="space-y-4">
          <div
            v-for="post in posts.slice(0, 5)"
            :key="post.id"
            class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
          >
            <div class="flex-1">
              <router-link
                :to="`/admin/posts/${post.id}`"
                class="text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                {{ post.title }}
              </router-link>
              <p class="text-xs text-gray-500 mt-1">
                By {{ post.user?.name }} • {{ formatDate(post.created_at) }}
              </p>
            </div>
            <Badge :label="post.status" :variant="getStatusVariant(post.status)" />
          </div>
        </div>
        <div v-if="posts.length > 0" class="mt-4 text-center">
          <router-link
            to="/admin/posts"
            class="text-sm text-blue-600 hover:text-blue-800"
          >
<<<<<<< HEAD
            Xem tất cả →
=======
            View all posts →
>>>>>>> oldrepo/adminFrontOnly
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { usePostsStore } from '@/stores/posts'
import StatsCard from '@/components/admin/StatsCard.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/components/common/Badge.vue'
import {
  UsersIcon,
  DocumentTextIcon,
  FlagIcon,
  UserGroupIcon,
} from '@heroicons/vue/24/outline'

const reportsStore = useReportsStore()
const postsStore = usePostsStore()

const stats = ref({
  total_users: 0,
  total_posts: 0,
  total_reports: 0,
  banned_users: 0,
})

const reports = ref([])
const posts = ref([])
const loadingReports = ref(false)
const loadingPosts = ref(false)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
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

onMounted(async () => {
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

  // Fetch recent posts
  loadingPosts.value = true
  try {
    await postsStore.fetchPosts({ limit: 10, sort: 'newest' })
    posts.value = postsStore.posts
  } catch (error) {
    console.error('Failed to fetch posts:', error)
  } finally {
    loadingPosts.value = false
  }
})
</script>

