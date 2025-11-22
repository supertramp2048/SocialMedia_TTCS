import apiClient from './apiClient'

export const usersApi = {
  getUsers: async (params) => {
    const response = await apiClient.get('/api/users/search', { params })
    return response.data
  },

  getUser: async (id) => {
    const response = await apiClient.get(`/api/profiles/${id}`)
    return response.data
  },

  getBannedUsers: async (params) => {
    const response = await apiClient.get('/api/admin/users/banned', { params })
    return response.data
  },

  banUser: async (userId, params) => {
    const response = await apiClient.post(`/api/admin/users/${userId}/ban`, params)
    return response.data
  },

  unbanUser: async (userId) => {
    const response = await apiClient.post(`/api/admin/users/${userId}/unban`)
    return response.data
  },

  getModerationHistory: async (userId) => {
    const response = await apiClient.get(`/api/admin/users/${userId}/moderation-history`)
    return response.data
  },
}

