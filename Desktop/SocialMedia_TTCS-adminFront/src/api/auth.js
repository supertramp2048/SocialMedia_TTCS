import apiClient from './apiClient'

export const authApi = {
  //Get CSRF cookie before login
  getCsrfCookie: async () => {
    try {
      await apiClient.get('/sanctum/csrf-cookie', {
        withCredentials: true,
      })
    } catch (error) {
      console.warn('Failed to get CSRF cookie:', error)
      // Continue anyway - some setups don't require CSRF for API routes
    }
  },

  login: async (credentials) => {
    // Get CSRF cookie first (for Sanctum stateful requests)
    await authApi.getCsrfCookie()
    // Then login
    const response = await apiClient.post('/api/admin/login', credentials)
    console.log("account: ",response.data)
    return response.data
  },

  logout: async () => {
    await apiClient.post('/api/logout')
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/api/user')
    return response.data
  },
}

