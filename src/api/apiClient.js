import axios from 'axios'
import Cookies from 'js-cookie'
import { useAuthStore } from '@/stores/auth'
import router from '@/router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true, // Important: Send cookies with requests
})

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }

    // Handle FormData
    const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
    if (isFormData && config.headers) {
      delete config.headers['Content-Type']
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear auth and redirect to login
      const authStore = useAuthStore()
      await authStore.logout()
      router.push('/admin/login')
    }
    return Promise.reject(error)
  }
)

export default apiClient

