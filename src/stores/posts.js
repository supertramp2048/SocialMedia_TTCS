import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postsApi } from '@/api/posts'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  const loading = ref(false)

  async function fetchPosts(params) {
    loading.value = true
    try {
      const response = await postsApi.getPosts(params)
      posts.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function deletePost(postId) {
    try {
      await postsApi.deletePost(postId)
      // Refresh posts list
      await fetchPosts()
    } catch (error) {
      throw error
    }
  }

  return {
    posts,
    pagination,
    loading,
    fetchPosts,
    deletePost,
  }
})

