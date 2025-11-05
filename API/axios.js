import axios from 'axios';
import Cookies from 'js-cookie';
import { ref } from 'vue'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
});

// Gắn token cho mọi request
api.interceptors.request.use(config => {
  const token = Cookies.get('token');
  console.log('token ben axios', token);
    
  if (token) config.headers.Authorization = `Bearer ${token}`

  const isFormData = typeof FormData !== 'undefined' && config.data instanceof FormData
  if (!isFormData && !config.headers['Content-Type']) {
    config.headers['Content-Type'] = 'application/json'
  }
  return config;
});

// loader cho cac trang
api.interceptors.request.use(config => {
  globalLoading.value = true
  return config
}, error => {
  globalLoading.value = false
  return Promise.reject(error)
})

api.interceptors.response.use(res => {
  globalLoading.value = false
  return res
}, error => {
  globalLoading.value = false
  return Promise.reject(error)
})
export const globalLoading = ref(false)
export default api;