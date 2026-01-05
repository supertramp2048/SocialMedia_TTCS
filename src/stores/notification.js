// src/stores/advertisements.js (hoặc đường dẫn anh muốn)
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useNotificationStore = defineStore('notification', () => {
    const notificationCount = ref(0)
    const arrNotification = ref([])
    function addNotification(obj){
        notificationCount.value += 1
        arrNotification.value.push(obj)
    }
  return {
    notificationCount,
    addNotification,
    arrNotification
  }
})
