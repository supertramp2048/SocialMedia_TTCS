// src/stores/advertisements.js (hoặc đường dẫn anh muốn)
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { advertismentApi } from '@/api/apiAdvertisment'

export const useAdvertisementsStore = defineStore('advertisements', () => {
  const advertisements = ref([])
  const loading = ref(false)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  // Lấy danh sách quảng cáo (Admin)
  async function fetchAdvertisements(params) {
    loading.value = true
    try {
      const response = await advertismentApi.getAdminAdvertisements(params)
      advertisements.value = response.data.data || []
      pagination.value = {
        current_page: response.data.meta.current_page ?? 1,
        last_page: response.data.meta.last_page ?? 1,
        per_page: response.data.meta.per_page ?? 20,
        total: response.data.meta.total 
      }
    //   console.log('advertisements ', advertisements.value)
      return response
    } catch (error) {
       console.log(error);
    } finally {
      loading.value = false
    }
  }

  // Tạo quảng cáo mới
  async function createAdvertisement(formData) {
    loading.value = true
    try {
      const ad = await advertismentApi.createAdvertisement(formData)
      await fetchAdvertisements()
      return ad
    } catch (error) {
        console.log(error)
    }
    finally{
        loading.value = false
    }
  }

  // Cập nhật quảng cáo
  async function updateAdvertisement(id, formData) {
    try {
      loading.value= true
      const ad = await advertismentApi.updateAdvertisement(id, formData)
      await fetchAdvertisements()
      return ad
    } catch (error) {
      console.log(error);
    }
    finally{
        loading.value = false
    }
  }

  // Xóa quảng cáo
  async function deleteAdvertisement(id) {
    try {
      loading.value = true
      await advertismentApi.deleteAdvertisement(id)
      await fetchAdvertisements()
    } catch (error) {
      console.log(error);
    }
    finally{
        loading.value = false
    }
  }

  return {
    advertisements,
    pagination,
    loading,
    fetchAdvertisements,
    createAdvertisement,
    updateAdvertisement,
    deleteAdvertisement,
  }
})
