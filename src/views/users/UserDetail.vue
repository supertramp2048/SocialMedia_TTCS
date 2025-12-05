<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/admin/users"
        class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Users
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">User Details</h1>
    </div>

    <LoadingSpinner v-if="loading" />

    <!-- Dùng userData thay vì user -->
    <div v-else-if="userData" class="bg-white rounded-lg shadow p-6">
      <!-- Cover photo -->
      <div v-if="userData.cover_photo_url" class="mb-6">
        <div class="h-40 w-full rounded-lg overflow-hidden">
          <img
            :src="userData.cover_photo_url"
            :alt="`Cover of ${userData.name}`"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- Avatar + info cơ bản -->
      <div class="flex items-start space-x-6 mb-6">
        <img
          v-if="userData.avatar"
          :src="userData.avatar"
          :alt="userData.name"
          class="h-24 w-24 rounded-full object-cover flex-shrink-0"
        />
        <div v-else class="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
          <UserIcon class="h-12 w-12 text-gray-600" />
        </div>

        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">
            {{ userData.name }}
          </h2>

          <p class="text-sm text-gray-500 mt-1">
            ID: {{ userData.id }}
          </p>

          <div class="mt-3 flex items-center flex-wrap gap-2">
            <Badge
              :label="userData.role"
              :variant="getRoleVariant(userData.role)"
            />

            <Badge
              v-if="moderationHistory?.user_info?.banned_until != null"
              label="Banned"
              variant="danger"
            />

            <Badge
              v-if="userData.is_following !== undefined"
              :label="userData.is_following ? 'Đang được bạn theo dõi' : 'Chưa được bạn theo dõi'"
              :variant="userData.is_following ? 'info' : 'default'"
            />
          </div>
        </div>
      </div>

      <!-- Thông tin thời gian & thống kê -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Tham gia
          </label>
          <p class="mt-1 text-sm text-gray-900">
            {{ formatDate(userData.created_at) }}
          </p>
        </div>

        <div v-if="moderationHistory?.user_info?.banned_until">
          <label class="block text-sm font-medium text-gray-700">
            Banned Until
          </label>
          <p class="mt-1 text-sm text-red-600">
            {{ formatDate(moderationHistory.user_info.banned_until) }}
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Số người theo dõi</p>
          <p class="mt-1 text-xl font-semibold text-gray-900">
            {{ userData.followers_count }}
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Đang theo dõi</p>
          <p class="mt-1 text-xl font-semibold text-gray-900">
            {{ userData.following_count }}
          </p>
        </div>
        <div class="p-4 bg-gray-50 rounded-lg">
          <p class="text-sm text-gray-500">Số bài viết</p>
          <p class="mt-1 text-xl font-semibold text-gray-900">
            {{ userData.posts_count }}
          </p>
        </div>
      </div>

      <!-- Lịch sử vi phạm -->
      <div v-if="moderationHistory" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          Lịch sử vi phạm
        </h3>

        <div class="space-y-4">
          <div v-if="moderationHistory.violations?.removed_posts?.length > 0">
            <h4 class="font-medium text-gray-700 mb-2">
              Removed Posts ({{ moderationHistory.violations.removed_posts.length }})
            </h4>
            <div class="space-y-2">
              <div
                v-for="post in moderationHistory.violations.removed_posts"
                :key="post.id"
                class="p-3 bg-red-50 border border-red-200 rounded"
              >
                <p class="font-medium">
                  {{ post.title }}
                </p>
                <p class="text-sm text-gray-600">
                  {{ formatDate(post.updated_at) }}
                </p>
              </div>
            </div>
          </div>

          <div v-else>
            User chưa có vi phạm nào
          </div>
        </div>
      </div>
    </div>

    <!-- Trường hợp không có user -->
    <div v-else class="text-gray-500">
      Không tìm thấy thông tin user.
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usersApi } from '@/api/users'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/components/common/Badge.vue'
import { UserIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const user = ref(null)               // sẽ chứa { data: {...} }
const moderationHistory = ref(null)
const loading = ref(true)

// computed để truy cập data cho tiện
const userData = computed(() => user.value?.data ?? null)

const getRoleVariant = (role) => {
  if (role === 'superadmin' || role === 'admin') return 'info'
  if (role === 'moderator') return 'warning'
  return 'default'
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const userId = parseInt(route.params.id)
  try {
    // Giả sử usersApi.getUser trả về nguyên response { data: {...} }
    user.value = await usersApi.getUser(userId)
    moderationHistory.value = await usersApi.getModerationHistory(userId)
    // console.log('user detail:', user.value)
    // console.log('moderation history:', moderationHistory.value)
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  } finally {
    loading.value = false
  }
})
</script>
