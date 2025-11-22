<template>
  <div>
    <div class="mb-6">
      <router-link
        to="/admin/reports"
        class="text-blue-600 hover:text-blue-800 mb-4 inline-block"
      >
        ← Back to Reports
      </router-link>
      <h1 class="text-2xl font-bold text-gray-900">Report Details</h1>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-else-if="report" class="bg-white rounded-lg shadow p-6">
      <div class="mb-6">
        <h2 class="text-xl font-bold text-gray-900 mb-2">{{ report.reason }}</h2>
        <p v-if="report.description" class="text-gray-600">{{ report.description }}</p>
      </div>

      <div class="grid grid-cols-2 gap-6 mb-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">Reported By</label>
          <p class="mt-1 text-sm text-gray-900">{{ report.reporter?.name }}</p>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">Created</label>
          <p class="mt-1 text-sm text-gray-900">{{ formatDate(report.created_at) }}</p>
        </div>
      </div>

      <div class="mt-6 pt-6 border-t border-gray-200">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Reported Content</h3>
        <div v-if="report.post" class="p-4 bg-gray-50 rounded-lg">
          <h4 class="font-medium">{{ report.post.title }}</h4>
          <p class="text-sm text-gray-600 mt-2">{{ report.post.content_html?.substring(0, 200) }}...</p>
        </div>
        <div v-else-if="report.comment" class="p-4 bg-gray-50 rounded-lg">
          <p class="text-gray-900">{{ report.comment.content }}</p>
        </div>
        <div v-else-if="report.reportedUser" class="p-4 bg-gray-50 rounded-lg">
          <p class="font-medium">{{ report.reportedUser.name }}</p>
          <p class="text-sm text-gray-600">{{ report.reportedUser.email }}</p>
        </div>
      </div>

      <div class="mt-6 flex space-x-4">
        <button
          @click="handleResolve"
          class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Resolve Report
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'vue-toastification'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const route = useRoute()
const reportsStore = useReportsStore()
const toast = useToast()

const report = ref(null)
const loading = ref(true)

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleResolve = async () => {
  if (!report.value) return

  if (!confirm('Are you sure you want to resolve this report?')) return

  try {
    // Determine report type and resolve accordingly
    if (report.value.post) {
      await reportsStore.resolvePostReport(report.value.id)
    } else if (report.value.comment) {
      await reportsStore.resolveCommentReport(report.value.id)
    } else {
      await reportsStore.resolveUserReport(report.value.id)
    }
    toast.success('Report resolved successfully')
    // Navigate back to reports list
    window.history.back()
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to resolve report')
  }
}

onMounted(async () => {
  const reportId = parseInt(route.params.id)
  
  // Try to find report in store
  const allReports = [
    ...reportsStore.postReports,
    ...reportsStore.commentReports,
    ...reportsStore.userReports,
  ]
  
  report.value = allReports.find((r) => r.id === reportId)
  
  if (!report.value) {
    // If not found, fetch all reports
    await Promise.all([
      reportsStore.fetchPostReports(),
      reportsStore.fetchCommentReports(),
      reportsStore.fetchUserReports(),
    ])
    
    const allReportsAfter = [
      ...reportsStore.postReports,
      ...reportsStore.commentReports,
      ...reportsStore.userReports,
    ]
    report.value = allReportsAfter.find((r) => r.id === reportId)
  }
  
  loading.value = false
})
</script>

