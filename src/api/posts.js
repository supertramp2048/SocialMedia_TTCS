import apiClient from './apiClient'

export const postsApi = {
  getPosts: async (params) => {
    const response = await apiClient.get('/api/posts', { params })
    return response.data
  },

  getPost: async (id) => {
    const response = await apiClient.get(`/api/posts/${id}`)
    return response.data
  },

  deletePost: async (id) => {
    const response = await apiClient.delete(`/api/posts/${id}`)
    return response.data
  },
}

