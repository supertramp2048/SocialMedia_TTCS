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

    <div v-else-if="user" class="bg-white rounded-lg shadow p-6">
      <div class="flex items-start space-x-6 mb-6">
        <img
          v-if="user.avatar"
          :src="user.avatar"
          :alt="user.name"
          class="h-24 w-24 rounded-full"
        />
        <div v-else class="h-24 w-24 rounded-full bg-gray-300 flex items-center justify-center">
          <UserIcon class="h-12 w-12 text-gray-600" />
        </div>
        <div class="flex-1">
          <h2 class="text-2xl font-bold text-gray-900">{{ user.name }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <div class="mt-2">
            <Badge :label="user.role" :variant="getRoleVariant(user.role)" />
            <Badge
              v-if="user.banned_until"
              label="Banned"
              variant="danger"
              class="ml-2"
            />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Joined</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(user.created_at) }}</p>
        </div>
        <div v-if="user.banned_until">
          <label class="block text-sm font-medium text-gray-700">Banned Until</label>
          <p class="mt-1 text-sm text-red-600">{{ formatDate(user.banned_until) }}</p>
        </div>
      </div>

      <div v-if="moderationHistory" class="mt-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Moderation History</h3>
        <div class="space-y-4">
          <div v-if="moderationHistory.violations.removed_posts?.length > 0">
            <h4 class="font-medium text-gray-700 mb-2">Removed Posts ({{ moderationHistory.violations.removed_posts.length }})</h4>
            <div class="space-y-2">
              <div
                v-for="post in moderationHistory.violations.removed_posts"
                :key="post.id"
                class="p-3 bg-red-50 border border-red-200 rounded"
              >
                <p class="font-medium">{{ post.title }}</p>
                <p class="text-sm text-gray-600">{{ formatDate(post.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { usersApi } from '@/api/users'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/components/common/Badge.vue'
import { UserIcon } from '@heroicons/vue/24/outline'

const route = useRoute()

const user = ref(null)
const moderationHistory = ref(null)
const loading = ref(true)

const getRoleVariant = (role) => {
  if (role === 'superadmin' || role === 'admin') return 'info'
  if (role === 'moderator') return 'warning'
  return 'default'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

onMounted(async () => {
  const userId = parseInt(route.params.id)
  
  try {
    user.value = await usersApi.getUser(userId)
    moderationHistory.value = await usersApi.getModerationHistory(userId)
  } catch (error) {
    console.error('Failed to fetch user details:', error)
  } finally {
    loading.value = false
  }
})
</script>

