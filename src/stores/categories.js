import { defineStore } from 'pinia'
import { ref } from 'vue'
import { categoriesApi } from '@/api/categories'

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  const loading = ref(false)

  async function fetchCategories(params) {
    loading.value = true
    try {
      const response = await categoriesApi.getCategories(params)
      categories.value = response.data
      console.log("categories ", categories.value);
      
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  async function createCategory(data) {
    try {
      const category = await categoriesApi.createCategory(data)
      await fetchCategories()
      return category
    } catch (error) {
      throw error
    }
  }

  async function updateCategory(id, data) {
    try {
      const category = await categoriesApi.updateCategory(id, data)
      await fetchCategories()
      return category
    } catch (error) {
      throw error
    }
  }

  async function deleteCategory(id) {
    try {
      await categoriesApi.deleteCategory(id)
      await fetchCategories()
    } catch (error) {
      throw error
    }
  }

  return {
    categories,
    pagination,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  }
})

