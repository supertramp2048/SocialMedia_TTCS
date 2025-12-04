import { defineStore } from 'pinia'
import { ref } from 'vue'
import { settingApi } from '../api/pageSetting'

export const useSettingStore = defineStore('setting', () => {
  // ===== STATE =====
  const logoUrl = ref(null)
  const backgroundUrl = ref(null)
  const footer = ref({
    footer_description: '',
    footer_copyright: '',
    footer_links: [],
    footer_socials: [],
  })

  const loadingLogo = ref(false)
  const loadingBackground = ref(false)
  const loadingFooter = ref(false)

  const errorLogo = ref(null)
  const errorBackground = ref(null)
  const errorFooter = ref(null)

  // ===== ACTIONS: LOGO =====
  const fetchLogo = async () => {
    loadingLogo.value = true
    errorLogo.value = null
    try {
      const res = await settingApi.getLogo()
      // API trả về { logo_url: '...' } hoặc null
      logoUrl.value = res.data?.logo_url || null
    } catch (error) {
      errorLogo.value = error
      console.error('Fetch logo error:', error)
      throw error
    } finally {
      loadingLogo.value = false
    }
  }

  const updateLogo = async (file) => {
    loadingLogo.value = true
    errorLogo.value = null
    try {
      const res = await settingApi.updateLogo(file)
      // API: { message: "...", logo_url: "..." }
      logoUrl.value = res.data?.logo_url || null
      return res
    } catch (error) {
      errorLogo.value = error
      console.error('Update logo error:', error)
      throw error
    } finally {
      loadingLogo.value = false
    }
  }

  // ===== ACTIONS: BACKGROUND =====
  const fetchBackground = async () => {
    loadingBackground.value = true
    errorBackground.value = null
    try {
      const res = await settingApi.getBackground()
      // API trả về { background_url: '...' } hoặc null
      backgroundUrl.value = res.data?.background_url || null
    } catch (error) {
      errorBackground.value = error
      console.error('Fetch background error:', error)
      throw error
    } finally {
      loadingBackground.value = false
    }
  }

  const updateBackground = async (file) => {
    loadingBackground.value = true
    errorBackground.value = null
    try {
      const res = await settingApi.updateBackground(file)
      // API: { message: "...", background_url: "..." }
      backgroundUrl.value = res.data?.background_url || null
      return res
    } catch (error) {
      errorBackground.value = error
      console.error('Update background error:', error)
      throw error
    } finally {
      loadingBackground.value = false
    }
  }

  // ===== ACTIONS: FOOTER =====
  const fetchFooter = async () => {
    loadingFooter.value = true
    errorFooter.value = null
    try {
      const res = await settingApi.getFooter()
      console.log("footer ",res);
      
      // API trả về object footer hoặc null
      if (res.data) {
        footer.value = {
          footer_description: res.data.description || '',
          footer_copyright: res.data.copyright || '',
          footer_links: res.data.links || [],
          footer_socials: res.data.socials || [],
        }
      } else {
        footer.value = {
          footer_description: '',
          footer_copyright: '',
          footer_links: [],
          footer_socials: [],
        }
      }
    } catch (error) {
      errorFooter.value = error
      console.error('Fetch footer error:', error)
    } finally {
      loadingFooter.value = false
    }
  }

  const updateFooter = async (payload) => {
    loadingFooter.value = true
    errorFooter.value = null
    try {
      const res = await settingApi.updateFooter(payload)
      // Sau khi update thành công, sync lại store theo payload mới
      footer.value = {
        footer_description: payload.footer_description || '',
        footer_copyright: payload.footer_copyright || '',
        footer_links: payload.footer_links || [],
        footer_socials: payload.footer_socials || [],
      }
      return res
    } catch (error) {
      errorFooter.value = error
      console.error('Update footer error:', error)
      throw error
    } finally {
      loadingFooter.value = false
    }
  }

  return {
    // state
    logoUrl,
    backgroundUrl,
    footer,
    loadingLogo,
    loadingBackground,
    loadingFooter,
    errorLogo,
    errorBackground,
    errorFooter,

    // actions
    fetchLogo,
    updateLogo,
    fetchBackground,
    updateBackground,
    fetchFooter,
    updateFooter,
  }
})
