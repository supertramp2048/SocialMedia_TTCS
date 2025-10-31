import { defineStore } from 'pinia'
import api from '../../API/axios'
const apiUrl = import.meta.env.VITE_API_BASE

export const usePostDetailStore = defineStore('postDetail', {
  state: () => ({
    postStore: null,
  }),
  actions: {
    async getPostDetail(id) {
      const res = await api.get(`${apiUrl}/api/posts/${id}`)
      this.postDetail = res.data
    //   console.log(res.data);
      this.postStore = res.data
      
    }
  }
})
