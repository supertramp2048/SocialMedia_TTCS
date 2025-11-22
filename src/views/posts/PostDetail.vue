<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/admin/posts"
        class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Posts
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">Post Details</h1>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="post" class="bg-white rounded-lg shadow p-6">
      <h2 class="text-2xl font-bold text-gray-900 mb-4">{{ post.title }}</h2>
      
      <div class="flex items-center space-x-4 mb-6">
        <Badge :label="post.status" :variant="getStatusVariant(post.status)" />
        <span class="text-sm text-gray-600">
          By {{ post.user?.name }} • {{ formatDate(post.created_at) }}
        </span>
      </div>

      <div
        v-html="post.content_html"
        class="prose max-w-none mb-6"
      ></div>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <button
          v-if="post.status === 'published'"
          @click="handleDelete"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
        >
          Remove Post
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { postsApi } from '@/api/posts'
import { useToast } from 'vue-toastification'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Badge from '@/components/common/Badge.vue'

const route = useRoute()
const toast = useToast()

const post = ref(null)
const loading = ref(true)

const getStatusVariant = (status) => {
  if (status === 'published') return 'success'
  if (status === 'removed_by_mod') return 'danger'
  return 'warning'
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleDelete = async () => {
  if (!post.value) return

  if (!confirm('Are you sure you want to remove this post?')) return

  try {
    await postsApi.deletePost(post.value.id)
    toast.success('Post removed successfully')
    post.value.status = 'removed_by_mod'
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove post')
  }
}

onMounted(async () => {
  const postId = parseInt(route.params.id)
  
  try {
    post.value = await postsApi.getPost(postId)
  } catch (error) {
    console.error('Failed to fetch post:', error)
  } finally {
    loading.value = false
  }
})
</script>

