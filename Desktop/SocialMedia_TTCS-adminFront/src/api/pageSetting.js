// KHÔNG cần import vitest, dòng dưới nên xóa:
// import { aP } from 'vitest/dist/chunks/reporters.d.BFLkQcL6.js'

import apiClient from './apiClient'

export const settingApi = {
  // 2.2 Lấy logo (GET /api/settings/logo - Public)
  getLogo: async () => {
    const res = await apiClient.get('/api/settings/logo')
    return res
  },

  // 2.1 Cập nhật logo (POST /api/admin/settings/logo - Admin)
  // file: File object (từ input type="file")
  updateLogo: async (file) => {
    const formData = new FormData()
    formData.append('logo', file) // key phải là "logo" đúng như tài liệu

    const res = await apiClient.post('/api/admin/settings/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res
  },

  // 2.4 Lấy background (GET /api/settings/background - Public)
  getBackground: async () => {
    const res = await apiClient.get('/api/settings/background')
    return res
  },

  // 2.3 Cập nhật background (POST /api/admin/settings/background - Admin)
  // file: File object
  updateBackground: async (file) => {
    const formData = new FormData()
    formData.append('file', file) // key phải là "file" theo tài liệu

    const res = await apiClient.post('/api/admin/settings/background', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res
  },

  // 3.1 Lấy footer (GET /api/settings/footer - Public)
  getFooter: async () => {
    const res = await apiClient.get('/api/settings/footer')
    return res
  },

  // 3. Cập nhật footer (POST /api/admin/settings/footer - Admin)
  // payload: object đúng cấu trúc JSON tài liệu (footer_description, footer_copyright, footer_links, footer_socials)
  updateFooter: async (payload) => {
    const res = await apiClient.post('/api/admin/settings/footer', payload)
    return res
  },
}
