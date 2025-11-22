import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersApi } from '@/api/users'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  const loading = ref(false)

  async function fetchUsers(params) {
    loading.value = true
    try {
      const response = await usersApi.getUsers(params)
      users.value = response.data
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

  async function fetchBannedUsers(params) {
    loading.value = true
    try {
      const response = await usersApi.getBannedUsers(params)
      users.value = response.data
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

  async function banUser(userId, durationDays) {
    try {
      await usersApi.banUser(userId, { duration_days: durationDays })
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  async function unbanUser(userId) {
    try {
      await usersApi.unbanUser(userId)
      // Refresh users list
      await fetchUsers()
    } catch (error) {
      throw error
    }
  }

  return {
    users,
    pagination,
    loading,
    fetchUsers,
    fetchBannedUsers,
    banUser,
    unbanUser,
  }
})

