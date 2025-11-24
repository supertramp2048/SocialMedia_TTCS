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
        v-if="user?.role == 'admin' || user?.role == 'superadmin'"
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
        <div class="flex flex-col">
        <button
          @click="handleDelete(row.report_id)"

          class="text-red-600 hover:text-red-400 bg-white hover:bg-gray-100 shadow-2xl rounded-2xl"
        >
          Bỏ qua
        </button>
        <button
          @click="openReport(row)"
          class="text-sky-600 hover:text-sky-400 bg-white hover:bg-gray-100 shadow-2xl rounded-2xl"
        >
          Chi tiết
        </button>
        <button
          v-if="activeTab !='users'"
          @click="handleResolve(row)"
          class="text-green-600 hover:text-green-800 bg-white hover:bg-gray-100 shadow-2xl rounded-2xl"
        >
          Gỡ bỏ nội dung vi phạm
        </button>
        </div>
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
  <ReportDetailModal
      v-if="selectedReport != null"
      :show="showDetail"
      :report="selectedReport"
      @close="showDetail = false"
      @resolved="handleResolved"
    />
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import ReportDetailModal from '../reports/ReportDetail.vue'
import {useAuthStore} from '../../stores/auth'
const showDetail = ref(false)
const selectedReport = ref(null)
const auth = useAuthStore()
const user = ref(auth.user)
const openReport = (row) => {
  if(activeTab.value == 'posts'){
    selectedReport.value = row
    console.log("selected: ",selectedReport.value);
  }
  else if(activeTab.value == 'comments'){
    selectedReport.value = row
    console.log("selected: ",selectedReport.value);
  }
  else if(activeTab.value == 'users'){
    selectedReport.value = row
    console.log("selected: ",selectedReport.value);
  }
  showDetail.value = true
}

const reportsStore = useReportsStore()
const toast = useToast()

// JS thuần: chỉ truyền giá trị, không khai báo kiểu
// vẫn hiểu logic là 'posts' | 'comments' | 'users'
const activeTab = ref('posts')

const columns = computed(() => {
  const base = [
    { key: 'reason', label: 'Reason' },
    { key: 'reporter.name', label: 'Reported By' },
    { key: 'reported_at', label: 'Created' },
    { key: 'actions', label: 'Actions' },
  ];

  if (activeTab.value === 'posts') {
    return [
      { key: 'evidence_post.title', label: 'Tiêu đề bài viết' },
      ...base,
    ];
  }
  else if (activeTab.value === 'comments') {
    return [
      { key: 'evidence_comment.content', label: 'Nội dung bình luận' },
      ...base,
    ];
  }
  else if (activeTab.value === 'users') {
    return [
      { key: 'reported_user.name', label: 'Người dùng' },
      ...base,
    ];
  }
  return base;
});

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
  if (!confirm('Bạn muốn gỡ bỏ nội dung này khỏi trang người dùng ?')) return
  console.log("resolve: ",report);
  
  try {
    if (activeTab.value === 'posts') {
      await reportsStore.resolvePostReport(report.evidence_post.id)
      await reportsStore.deleteReportPost(report.report_id)
    } else if (activeTab.value === 'comments') {
      await reportsStore.resolveCommentReport(report.evidence_comment.id)
      await reportsStore.deleteReportComment(report.report_id)
    } else {
      await reportsStore.resolveUserReport(report.id)
      await reportsStore.deleteReportUser(report.report_id)
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
