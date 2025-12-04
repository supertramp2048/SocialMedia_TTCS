import apiClient from './apiClient'

export const commentsApi = {
  getComment: async (id) => {
    const response = await apiClient.get(`/api/comments/${id}`)
    console.log(response.data);
    
    return response.data
  },
  getRemovedComment: async () => {
    const res = await apiClient.get('/api/moderator/content/removed-comments')
    console.log(res.data);
    
    return res.data
  },
  deleteComment: async (id) => {
    const response = await apiClient.delete(`/api/comments/${id}`)
    console.log(response.data);
    
    return response.data
  },
}

