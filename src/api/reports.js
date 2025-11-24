import apiClient from './apiClient'

export const reportsApi = {
  getPostReports: async (params) => {
    const response = await apiClient.get('/api/moderator/reports/posts', { params })
    return response.data
  },

  getCommentReports: async (params) => {
    const response = await apiClient.get('/api/moderator/reports/comments', { params })
    return response.data
  },

  getUserReports: async (params) => {
    const response = await apiClient.get('/api/moderator/reports/users', { params })
    return response.data
  },

  getAnUserHistoryReported: async (params) => {
    const res = await apiClient.get(`/api/admin/users/${params}/moderation-history`)
    return res.data
  },
  deleteReportPost: async (reportId) => {
    const res = await apiClient.delete(`/api/moderator/reports/posts/${reportId}`)
  },
  deleteReportComment: async (reportId) => {
    const res = await apiClient.delete(`/api/moderator/reports/comments/${reportId}`)
  },
  deleteReportUser: async (reportId) => {
    const res = await apiClient.delete(`/api/moderator/reports/users/${reportId}`)
  },
  resolvePostReport: async (postReportId) => {
    const response = await apiClient.delete(`/api/posts/${postReportId}`)
    return response.data
  },
  resolveCommentReport: async (commentReportId) => {
    const response = await apiClient.delete(`api/comments/${commentReportId}`)
    return response.data
  },
  resolveUserReport: async (reportId) => {
    const response = await apiClient.delete(`/api/moderator/reports/users/${reportId}`)
    return response.data
  },
}

