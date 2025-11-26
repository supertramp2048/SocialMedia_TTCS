import apiClient from './apiClient'

export const postsApi = {
  getAllPosts: async (params) => {
    const res = await apiClient.get('/api/posts',{params })
    return res.data
  },
  getPost: async (id) => {
    const response = await apiClient.get(`/api/posts/${id}`)
    return response.data
  },
  getRemovedPosts: async (params) => {
    const res = await apiClient.get('/api/moderator/content/removed-posts',{params})
    return res.data
  },
  restorePost: async (params) => {
    const res = await apiClient.post(`/api/moderator/posts/${params}/restore`)
    return res
  },
  deletePost: async (id) => {
    const response = await apiClient.delete(`/api/posts/${id}`)
    return response.data
  },
}

