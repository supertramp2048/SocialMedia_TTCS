import { defineStore } from 'pinia'
import { ref } from 'vue'
import { dashboardApi } from '@/api/DashboardIndex'

export const useDashboardStore = defineStore('dashboardIndex', () => {
  const dashboardData = ref(null)
  const loading = ref(false)
  const loaded = ref(false)
  async function getDashboardIndex() {
    if(loaded.value == true ) return
    try {
        loading.value = true
        const res = await dashboardApi.getDashBoardIndex()
        dashboardData.value = res.data
        //console.log("ben store ",dashboardData.value);
    } catch (error) {
        console.log(error);
    }
    finally{
        loading.value = false
        loaded.value = true
    }
  }

  return {
    getDashboardIndex,
    dashboardData,
    loaded,
    loading
  }
})

