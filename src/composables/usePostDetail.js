import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from '../../API/axios'

/**
 * Composable quản lý logic chi tiết bài viết
 * - Fetch post data
 * - Upvote/Downvote
 * - Follow author
 * - Suggested posts
 */
export function usePostDetail() {
  const route = useRoute()
  const apiUrl = import.meta.env.VITE_API_BASE
  
  const post = ref({})
  const postSuggested = ref([])
  const loading = ref(false)
  const isLoading = ref(false)
  
  const isLoadingPage = computed(() => !(post.value && post.value.data && post.value.data.id))

  // Fetch post detail
  async function fetchPost(postId) {
    try {
      const res = await api.get(`${apiUrl}/api/posts/${postId}`)
      post.value = res.data
      return res.data
    } catch (error) {
      console.error('Error fetching post:', error)
      throw error
    }
  }

  // Fetch suggested posts
  async function fetchSuggestedPosts(categoryId, currentPostId) {
    try {
      const res = await api.get(`${apiUrl}/api/posts`, {
        params: { limit: 5, sort: 'hot', category: categoryId }
      })
      postSuggested.value = res.data.data.filter(item => item.id !== currentPostId)
    } catch (error) {
      console.error('Error fetching suggested posts:', error)
    }
  }

  // Upvote bài viết
  async function upvote(postId) {
    loading.value = true
    try {
      const res = await api.post(`${apiUrl}/api/posts/${postId}/upvote`)
      if (res.status === 200) {
        const next = Number(res.data?.vote_score ?? 0)
        post.value.data.vote_score = next

        if (res.data?.user_vote != null) {
          post.value.data.user_vote = Number(res.data.user_vote)
        }
      }
    } catch (e) {
      post.value.data.vote_score = Math.max(0, Number(post.value?.data?.vote_score ?? 1) - 1)
      post.value.data.user_vote = 0
      console.error(e)
      alert('Bạn cần đăng nhập')
    } finally {
      loading.value = false
    }
  }

  // Downvote bài viết
  async function downvote(postId) {
    loading.value = true
    try {
      const res = await api.post(`${apiUrl}/api/posts/${postId}/downvote`)
      if (res.status === 200) {
        const next = Number(res.data?.vote_score ?? 0)
        post.value.data.vote_score = next

        if (res.data?.user_vote != null) {
          post.value.data.user_vote = Number(res.data.user_vote)
        }
      }
    } catch (e) {
      post.value.data.vote_score = Math.max(0, Number(post.value?.data?.vote_score ?? 1) - 1)
      post.value.data.user_vote = 0
      console.error(e)
      alert('Bạn cần đăng nhập')
    } finally {
      loading.value = false
    }
  }

  // Follow/Unfollow author
  async function followHandler() {
    try {
      isLoading.value = true
      const res = await api.post(`/api/users/${post.value?.data?.author?.id}/follow`)

      if (post.value?.data) {
        post.value.data = { ...post.value.data, is_following_author: res.data.is_following }
      }
    } catch (error) {
      console.error(error)
    } finally {
      isLoading.value = false
    }
  }

  // Watch route changes
  watch(() => route.query.id, async (newId) => {
    if (!newId) return
    await fetchPost(newId)
  })

  return {
    post,
    postSuggested,
    loading,
    isLoading,
    isLoadingPage,
    fetchPost,
    fetchSuggestedPosts,
    upvote,
    downvote,
    followHandler
  }
}

