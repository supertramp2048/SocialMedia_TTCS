import { defineStore } from 'pinia'
import { ref } from 'vue'
import { reportsApi } from '@/api/reports'

export const useReportsStore = defineStore('reports', () => {
  const postReports = ref([])
  const commentReports = ref([])
  const userReports = ref([])
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  })
  const loading = ref(false)

  async function fetchPostReports(params) {
    loading.value = true
    try {
      const response = await reportsApi.getPostReports(params)
      postReports.value = response.data
      console.log("post report ",postReports.value);
      
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
      return response
    } catch (error) {
      console.log(error.message)
    } finally {
      loading.value = false
    }
  }

  async function deleteReportPost(params) {
    try{
      loading.value = true
      const res = await reportsApi.deleteReportPost(params)
        const newArr =  postReports.value.filter(item => item.report_id != params)
        postReports.value = newArr
      return res
    }
    catch(error){
      throw(error)
    }
    finally{
      loading.value = false
    }
  }

  async function deleteReportComment(params) {
    try{
      loading.value = true
      const res = await reportsApi.deleteReportComment(params)
        const newArr =  commentReports.value.filter(item => item.report_id != params)
        commentReports.value = newArr
      return res
    }
    catch(error){
      throw(error)
    }
    finally{
      loading.value = false
    }
  }

  async function deleteReportUser(params) {
    try{
      loading.value = true
      const res = await reportsApi.deleteReportUser(params)
        const newArr =  userReports.value.filter(item => item.report_id != params)
        userReports.value = newArr
      return res
    }
    catch(error){
      throw(error)
    }
    finally{
      loading.value = false
    }
  }

  async function fetchCommentReports(params) {
    loading.value = true
    try {
      const response = await reportsApi.getCommentReports(params)
      commentReports.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
      return response
    } catch (error) {
      console.log(error.message)
    } finally {
      loading.value = false
    }
  }

  async function fetchUserReports(params) {
    loading.value = true
    try {
      const response = await reportsApi.getUserReports(params)
      userReports.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      }
      return response
    } catch (error) {
      console.log(error.message)
    } finally {
      loading.value = false
    }
  }

  async function resolvePostReport(reportId) {
    try {
      await reportsApi.resolvePostReport(reportId)
      await fetchPostReports()
    } catch (error) {
      console.log(error.message)
    }
  }

  async function resolveCommentReport(reportId) {
    try {
      await reportsApi.resolveCommentReport(reportId)
      await fetchCommentReports()
    } catch (error) {
      console.log(error.message)
    }
  }

  async function resolveUserReport(reportId) {
    try {
      await reportsApi.resolveUserReport(reportId)
      await fetchUserReports()
    } catch (error) {
      console.log(error.message)
    }
  }

  return {
    postReports,
    commentReports,
    userReports,
    pagination,
    loading,
    deleteReportComment,
    deleteReportPost,
    deleteReportUser,
    fetchPostReports,
    fetchCommentReports,
    fetchUserReports,
    resolvePostReport,
    resolveCommentReport,
    resolveUserReport,
  }
})

