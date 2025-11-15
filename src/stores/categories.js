import { defineStore } from 'pinia'
import api from '../../API/axios'
const apiUrl = import.meta.env.VITE_API_BASE

export const useCategoryStore = defineStore('categories', {
  state: () => ({
    categories: [],
    loaded: false
  }),
  actions: {
    async ensureLoaded() {
      if (this.loaded) return
      const res = await api.get(`${apiUrl}/api/categories`)
      this.categories = res.data
      // console.log(res.data);
      
      this.loaded = true
    }
  }
})
