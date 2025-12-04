import { defineStore } from 'pinia'
import { ref } from 'vue'
import { usersApi } from '@/api/users'
import apiClient from '../api/apiClient'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const adminAccounts = ref([])
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
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
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
      console.log(response);
      
      users.value = response.data
      pagination.value = {
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        per_page: response.meta.per_page,
        total: response.meta.total,
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
      const index = users.value.findIndex(u => u.id === userId)
      if (index !== -1) {
        const [user] = users.value.splice(index, 1)
      }
      //await fetchUsers()
    } catch (error) {
      console.log(error);
      
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
  async function givePermission(userId,role) {
    try {
      loading.value = true
      const res = await usersApi.givePermission(userId,role)
      console.log(res);
      
    } catch (error) {
      console.log(error);
    }
    finally{
      loading.value = false
    }
    
  }
  async function revokePermission(userId) {
    const role = 'user'
    try {
      loading.value = true
      const res = await usersApi.givePermission(userId,role)
      console.log(res);
      
    } catch (error) {
      console.log(error);
    }
    finally{
      loading.value = false
    }
  }
  async function getAllAmdinAccounts(params) {
    loading.value = true
    try {
      const response = await usersApi.getAllAmdinAccounts(params)
      adminAccounts.value = response.data.data;
      //console.log("admin Account",response);
      pagination.value = {
        current_page: response.data.meta.current_page,
        last_page: response.data.meta.last_page,
        per_page: response.data.meta.per_page,
        total: response.data.meta.total,
      }
    } catch (error) {
      console.log(error);
      
    }
    finally{
      loading.value = false
    }
  }
  return {
    users,
    pagination,
    loading,
    adminAccounts,
    fetchUsers,
    fetchBannedUsers,
    banUser,
    unbanUser,
    givePermission,
    getAllAmdinAccounts,
    revokePermission
  }
})

