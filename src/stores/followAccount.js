// src/stores/followAccount.js
import { defineStore } from 'pinia'
import api from '../../API/axios'

export const useFollowStore = defineStore('follow', {
  state: () => ({
    // dùng chung cho lần load đầu
    loading: false,

    // follower (ai theo dõi user) – nếu anh dùng chỗ khác vẫn còn
    loadedFollower: false,
    follower: null,              // { data: [], meta: {}, links: {} }
    loadingMoreFollower: false,

    // following (user đang theo dõi ai) – dùng cho sidebar này
    loadedFollowing: false,
    following: null,             // { data: [], meta: {}, links: {} }
    loadingMoreFollowing: false
  }),

  actions: {
    // ===== Follower (ai theo dõi user) =====
    async getFollower (id, params = {}) {
      if (this.loadedFollower) return

      try {
        this.loading = true

        const res = await api.get(`/api/profiles/${id}/followers`, {
          params: {
            page: 1,
            ...params
          }
        })

        //console.log('Follower page 1:', res.data)
        this.follower = res.data
      } catch (error) {
        console.error('getFollower error:', error)
      } finally {
        this.loading = false
        this.loadedFollower = true
      }
    },

    async loadMoreFollower (id) {
      if (this.loadingMoreFollower || !this.follower?.meta) return

      const meta = this.follower.meta
      if (meta.current_page >= meta.last_page) {
        return
      }

      const nextPage = meta.current_page + 1

      try {
        this.loadingMoreFollower = true

        const res = await api.get(`/api/profiles/${id}/followers`, {
          params: { page: nextPage }
        })

        //console.log('Follower page', nextPage, res.data)

        const currentData = Array.isArray(this.follower.data)
          ? this.follower.data
          : []
        const newData = Array.isArray(res.data?.data)
          ? res.data.data
          : []

        this.follower = {
          ...res.data,
          data: [...currentData, ...newData]
        }
      } catch (error) {
        console.error('loadMoreFollower error:', error)
      } finally {
        this.loadingMoreFollower = false
      }
    },

    // ===== Following (user đang theo dõi ai) – sidebar dùng cái này =====
    async getFollowing (id, params = {}) {
      if (this.loadedFollowing) return

      try {
        this.loading = true

        const res = await api.get(`/api/profiles/${id}/following`, {
          params: {
            page: 1,
            ...params
          }
        })

        //console.log('Following page 1:', res.data)
        this.following = res.data
      } catch (error) {
        console.error('getFollowing error:', error)
      } finally {
        this.loading = false
        this.loadedFollowing = true
      }
    },

    async loadMoreFollowing (id) {
      if (this.loadingMoreFollowing || !this.following?.meta) return

      const meta = this.following.meta
      if (meta.current_page >= meta.last_page) {
        return
      }

      const nextPage = meta.current_page + 1

      try {
        this.loadingMoreFollowing = true

        const res = await api.get(`/api/profiles/${id}/following`, {
          params: { page: nextPage }
        })

        //console.log('Following page', nextPage, res.data)

        const currentData = Array.isArray(this.following.data)
          ? this.following.data
          : []
        const newData = Array.isArray(res.data?.data)
          ? res.data.data
          : []

        this.following = {
          ...res.data,
          data: [...currentData, ...newData]
        }
      } catch (error) {
        console.error('loadMoreFollowing error:', error)
      } finally {
        this.loadingMoreFollowing = false
      }
    }
  }
})
