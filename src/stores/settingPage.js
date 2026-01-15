// src/stores/setting.js (ví dụ)
import { defineStore } from 'pinia'
import api from '../../API/axios'

export const useSettingStore = defineStore('setting', {
  state: () => ({
    logoURL: null,
    backGroundURL: null,
    footer: null,
    loaded: false,
    loading: false,
  }),

  actions: {
    async getSetting() {
      // Nếu đã load rồi thì không gọi lại nữa
      if (this.loaded || this.loading) return

      this.loading = true
      try {
        const [resLogo, resBg, resFooter] = await Promise.all([
          api.get('/api/settings/logo'),
          api.get('/api/settings/background'),
          api.get('/api/settings/footer'),
        ])

        this.logoURL = resLogo.data
        this.backGroundURL = resBg.data
        this.footer = resFooter.data

        // console.log('logo', this.logoURL)
        // console.log('background', this.backGroundURL)
        // console.log('footer', this.footer)

        this.loaded = true
      } catch (error) {
        console.log(error)
      } finally {
        this.loading = false
      }
    },
  },
})
