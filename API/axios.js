import axios from 'axios';
import Cookies from 'js-cookie';
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:8000/api',
  headers: {
    "Content-Type": "application/json",
  }
});

// Gắn token cho mọi request
api.interceptors.request.use(config => {
  const token = Cookies.get('token');  
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;