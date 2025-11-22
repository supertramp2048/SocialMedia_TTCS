<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

    <div class="mb-4 flex space-x-4">
      <button
        @click="activeTab = 'posts'"
        :class="activeTab === 'posts' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg"
      >
        Post Reports
      </button>
      <button
        @click="activeTab = 'comments'"
        :class="activeTab === 'comments' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg"
      >
        Comment Reports
      </button>
      <button
        @click="activeTab = 'users'"
        :class="activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg"
      >
        User Reports
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="currentReports"
      :searchable="true"
      search-placeholder="Search reports..."
      @search="handleSearch"
    >
      <template #cell-reason="{ row }">
        <div>
          <p class="font-medium">{{ row.reason }}</p>
          <p v-if="row.description" class="text-sm text-gray-600">{{ row.description }}</p>
        </div>
      </template>
      <template #cell-actions="{ row }">
        <button
          @click="handleDelete(row.report_id)"
          class="text-red-600 hover:text-red-400"
        >
          Bỏ qua
        </button>
        <button
          @click="handleResolve(row)"
          class="ml-2 text-green-600 hover:text-green-800"
        >
          Gỡ bỏ nội dung vi phạm
        </button>
      </template>
    </DataTable>

    <Pagination
      v-if="reportsStore.pagination.total > 0"
      :current-page="reportsStore.pagination.current_page"
      :last-page="reportsStore.pagination.last_page"
      :total="reportsStore.pagination.total"
      :from="(reportsStore.pagination.current_page - 1) * reportsStore.pagination.per_page + 1"
      :to="Math.min(reportsStore.pagination.current_page * reportsStore.pagination.per_page, reportsStore.pagination.total)"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'

const reportsStore = useReportsStore()
const toast = useToast()

// JS thuần: chỉ truyền giá trị, không khai báo kiểu
// vẫn hiểu logic là 'posts' | 'comments' | 'users'
const activeTab = ref('posts')

const columns = [
  { key: 'reason', label: 'Reason' },
  { key: 'reporter.name', label: 'Reported By' },
  { key: 'reported_at', label: 'Created' },
  {key: 'actions', label: 'actions'}
]

const currentReports = computed(() => {
  if (activeTab.value === 'posts') return reportsStore.postReports
  if (activeTab.value === 'comments') return reportsStore.commentReports
  return reportsStore.userReports
})

const handleSearch = (query) => {
  
  // còn tạm thời cứ load lại page 1
  fetchReports(1)
}

const handlePageChange = (page) => {
  fetchReports(page)
}

const handleDelete = async (id) =>{
  console.log("id of report ",id);
  
  if(!confirm('Bạn muốn bỏ qua báo cáo này ?')) return
  try {
    if(activeTab.value == 'posts'){
      await reportsStore.deleteReportPost(id)
      toast.success('Thành công')
    }
    else if(activeTab.value == 'comments'){
      await reportsStore.deleteReportComment(id)
      toast.success('Thành công')
    }
    else if(activeTab.value == 'users'){
      await reportsStore.deleteReportUser(id)
      toast.success('Thành công')
    }
  } catch (error) {
    console.log(error.message);
    
    toast.error(error?.response?.data?.message || 'Failed to resolve report')
  }
}

const handleResolve = async (report) => {
  if (!confirm('Are you sure you want to resolve this report?')) return

  try {
    if (activeTab.value === 'posts') {
      await reportsStore.resolvePostReport(report.id)
    } else if (activeTab.value === 'comments') {
      await reportsStore.resolveCommentReport(report.id)
    } else {
      await reportsStore.resolveUserReport(report.id)
    }
    toast.success('Report resolved successfully')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to resolve report')
  }
}

// cho page default = 1 để onMounted không cần truyền tham số
const fetchReports = (page = 1) => {
  if (activeTab.value === 'posts') {
    reportsStore.fetchPostReports({ page })
  } else if (activeTab.value === 'comments') {
    reportsStore.fetchCommentReports({ page })
  } else {
    reportsStore.fetchUserReports({ page })
  }
}

watch(activeTab, () => {
  fetchReports(1)
})

onMounted(() => {
  fetchReports()
})
</script>
