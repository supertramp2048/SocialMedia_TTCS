import apiClient from './apiClient'

export const staffApi = {
  updateUserRole: async (userId, data) => {
    const response = await apiClient.patch(`/api/superadmin/users/${userId}/role`, data)
    return response.data
  },
}

