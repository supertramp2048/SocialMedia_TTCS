import apiClient from './apiClient'

export const commentsApi = {
  getComment: async (id) => {
    const response = await apiClient.get(`/api/comments/${id}`)
    return response.data
  },

  deleteComment: async (id) => {
    const response = await apiClient.delete(`/api/comments/${id}`)
    return response.data
  },
}

