import apiClient from './apiClient'

export const categoriesApi = {
  getCategories: async (params) => {
    const response = await apiClient.get('/api/admin/categories', { params })
    return response.data
  },

  getCategory: async (id) => {
    const response = await apiClient.get(`/api/admin/categories/${id}`)
    return response.data
  },

  createCategory: async (data) => {
    const response = await apiClient.post('/api/admin/categories', data)
    return response.data
  },

  updateCategory: async (id, data) => {
    const response = await apiClient.put(`/api/admin/categories/${id}`, data)
    return response.data
  },

  deleteCategory: async (id) => {
    const response = await apiClient.delete(`/api/admin/categories/${id}`)
    return response.data
  },
}

