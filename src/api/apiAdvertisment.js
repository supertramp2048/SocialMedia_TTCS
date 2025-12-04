import apiClient from './apiClient'

export const advertismentApi = {
  // Lấy danh sách quảng cáo (admin)
  getAdminAdvertisements: async (params) => {
    const res = await apiClient.get('/api/admin/advertisements',{params})
    console.log("file admin ",res);
    
    return res
  },

  // Tạo quảng cáo mới (admin) - dùng form-data
  createAdvertisement: async (formData) => {
    const res = await apiClient.post('/api/admin/advertisements', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res
  },

  // Cập nhật quảng cáo (admin) - POST + form-data
  updateAdvertisement: async (id, formData) => {
    const res = await apiClient.post(`/api/admin/advertisements/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res
  },

  // Xóa quảng cáo (admin)
  deleteAdvertisement: async (id) => {
    const res = await apiClient.delete(`/api/admin/advertisements/${id}`)
    return res
  },

  // Lấy quảng cáo public theo vị trí (không cần auth)
  getAdvertisementsByPosition: async (position) => {
    const res = await apiClient.get('/api/advertisements', {
      params: { position },
    })
    return res
  },
}
