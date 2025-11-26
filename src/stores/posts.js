import { defineStore } from 'pinia'
import { ref } from 'vue'
import { postsApi } from '@/api/posts'

export const usePostsStore = defineStore('posts', () => {
  const posts = ref([])
  const allPosts = ref([])
  const allRemovedPosts = ref([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  const loading = ref(false)
  async function  fetchAllPosts(params) {
    loading.value = true
    try {
      const response = await postsApi.getAllPosts(params)
      allPosts.value = response.data
      //console.log('all posts',response);
      pagination.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
      }
      return response
    } catch (error) {
      throw(error)
    }
    finally{
      loading.value = false
    }
  }
  async function fetchPosts(params) {
    loading.value = true
    try {
      const response = await postsApi.getPost(params)
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
  async function fetchRemovedPost(params) {
    loading.value = true
    try {
      const response = await postsApi.getRemovedPosts(params)      
      allRemovedPosts.value = response.data
      console.log('all posts',response);
      pagination.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
      }
      return response
    } catch (error) {
      throw(error)
    }
    finally{
      loading.value = false
    }
  }
  async function deletePost(postId) {
      loading.value = true
      try {
        await postsApi.deletePost(postId)

        const removedPost = allPosts.value.find(post => post.id === postId)
        allPosts.value = allPosts.value.filter(post => post.id !== postId)

        if (removedPost) {
          allRemovedPosts.value = [removedPost, ...allRemovedPosts.value]
        }
      } catch (error) {
        console.log(error)
        throw error
      } finally {
        loading.value = false
      }
    }


  async function restorePost(postId) {
    loading.value = true
    try {
      await postsApi.restorePost(postId)

      const index = allRemovedPosts.value.findIndex(post => post.id === postId)
      if (index !== -1) {
        const restoredPost = allRemovedPosts.value[index]

        allRemovedPosts.value.splice(index, 1)
        allPosts.value.unshift(restoredPost)
      }
    } catch (error) {
      console.log(error)
    } finally {
      loading.value = false
    }
  }

  return {
    posts,
    allPosts,
    allRemovedPosts,
    pagination,
    loading,
    fetchRemovedPost,
    fetchPosts,
    fetchAllPosts,
    deletePost,
    restorePost 
  }
})

