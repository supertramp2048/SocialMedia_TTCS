<template>
  <div>
    <button 
    v-if="isSearched"
    class="bg-red-300 px-1 py-2 rounded-2xl"
    @click="deleteSearch"
    >Xóa kết quả tìm kiếm</button>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Reports</h1>

    <div class="mb-4 flex space-x-4">
      <button
        @click="activeTab = 'posts'"
        class="px-4 py-2 rounded-lg relative transition-all duration-200"
        :class="activeTab === 'posts' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      >
        Báo cáo bài viết
        <span 
          v-if="reportStats.posts > 0" 
          class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white"
        >
          {{ reportStats.posts > 99 ? '99+' : reportStats.posts }}
        </span>
      </button>

      <button
        @click="activeTab = 'comments'"
        class="px-4 py-2 rounded-lg relative transition-all duration-200"
        :class="activeTab === 'comments' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      >
        Báo cáo bình luận
        <span 
          v-if="reportStats.comments > 0" 
          class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white"
        >
          {{ reportStats.comments > 99 ? '99+' : reportStats.comments }}
        </span>
      </button>

      <button
        v-if="user?.role == 'admin' || user?.role == 'superadmin'"
        @click="activeTab = 'users'"
        class="px-4 py-2 rounded-lg relative transition-all duration-200"
        :class="activeTab === 'users' ? 'bg-blue-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
      >
        Báo cáo người dùng
        <span 
          v-if="reportStats.users > 0" 
          class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white ring-2 ring-white"
        >
          {{ reportStats.users > 99 ? '99+' : reportStats.users }}
        </span>
      </button>
    </div>

    <DataTable
      v-model="search" 
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
  <FullScreenLoader :show="reportsStore.loading"></FullScreenLoader>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import ReportDetailModal from '../reports/ReportDetail.vue'
import FullScreenLoader from '../../components/common/fullScreenLoading.vue'
import {useAuthStore} from '../../stores/auth'
const query = ref()
const search = ref('')
const showDetail = ref(false)
const selectedReport = ref(null)
const auth = useAuthStore()
const user = ref(auth.user)
const reportsStore = useReportsStore()
const toast = useToast()
const activeTab = ref('posts')
//const isSearched = ref(false)

// --- [NEW] State quản lý số lượng chấm đỏ ---
const reportStats = ref({
  posts: 0,
  comments: 0,
  users: 0
})
// --------------------------------------------

const openReport = (row) => {
  selectedReport.value = row
  showDetail.value = true
}

const columns = computed(() => {
  const base = [
    { key: 'reason', label: 'Reason' },
    { key: 'reporter.name', label: 'Reported By' },
    { key: 'reported_at', label: 'Created' },
    { key: 'actions', label: 'Actions' },
  ];

  if (activeTab.value === 'posts') {
    return [{ key: 'evidence_post.title', label: 'Tiêu đề bài viết' }, ...base];
  } else if (activeTab.value === 'comments') {
    return [{ key: 'evidence_comment.content', label: 'Nội dung bình luận' }, ...base];
  } else if (activeTab.value === 'users') {
    return [{ key: 'reported_user.name', label: 'Người dùng' }, ...base];
  }
  return base;
});

const currentReports = computed(() => {
  if (activeTab.value === 'posts') return reportsStore.postReports
  if (activeTab.value === 'comments') return reportsStore.commentReports
  return reportsStore.userReports
})
const isSearched = ref(false)
const handleSearch = (user) => {
  isSearched.value = true 
  //console.log("tim kiem ",user);
  query.value = user
  // còn tạm thời cứ load lại page 1
  fetchReports( 1, user)
}
const deleteSearch = () =>{
  search.value = ''
  handleSearch('')
  isSearched.value=false
}

const handlePageChange = (page) => {
  if(query.value){
    fetchReports(page,query.value)
  } else {
    fetchReports(page)
  }
}

const handleDelete = async (id) =>{
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
    // Giảm count khi xử lý xong
    if(reportStats.value[activeTab.value] > 0) reportStats.value[activeTab.value]--
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to resolve report')
  }
}

const fetchReports = async (page = 1, query) => {
  const params = { page }
  if (query) params.user = query

  // Gọi API tương ứng
  if (activeTab.value === 'posts') {
    await reportsStore.fetchPostReports(params)
  } else if (activeTab.value === 'comments') {
    await reportsStore.fetchCommentReports(params)
  } else {
    await reportsStore.fetchUserReports(params)
  }
  
  // [NEW] Cập nhật số lượng cho tab hiện tại sau khi fetch
  // Lưu ý: Store chỉ trả về total của tab hiện tại, nên ta sync lại
  reportStats.value[activeTab.value] = reportsStore.pagination.total
}

const reportMap = {
  posts: 'postReports',
  comments: 'commentReports',
  users: 'userReports'
}

const pushReport = (tab, report) => {
  const key = reportMap[tab]
  if (!Array.isArray(reportsStore[key])) {
    reportsStore[key] = []
  }
  reportsStore[key].unshift(report)
}

// Watch để cập nhật số lượng khi chuyển tab
watch(activeTab, async () => {
  await fetchReports(1)
  // Sync lại count chính xác nhất từ server khi chuyển tab
  reportStats.value[activeTab.value] = reportsStore.pagination.total
})

onMounted(async () => {
  // Bật loading để tránh giật giao diện khi load nhiều API
  reportsStore.loading = true
  
  try {
    // 1. LẤY DỮ LIỆU CÁC TAB ẨN TRƯỚC (Để lấy số lượng cho chấm đỏ)
    // Lưu ý: Dùng await tuần tự để tránh race condition trên biến pagination của store
    
    // a. Quét Comment
    await reportsStore.fetchCommentReports({ page: 1 })
    reportStats.value.comments = reportsStore.pagination.total

    // b. Quét User (nếu có quyền)
    if (user.value?.role === 'admin' || user.value?.role === 'superadmin') {
      await reportsStore.fetchUserReports({ page: 1 })
      reportStats.value.users = reportsStore.pagination.total
    }

    // 2. LẤY DỮ LIỆU TAB HIỆN TẠI (POSTS) CUỐI CÙNG
    // Tại sao phải cuối cùng? Để đảm bảo danh sách hiển thị và phân trang 
    // là của tab Posts (Active Tab) chứ không phải của Comment/User vừa fetch xong.
    if (activeTab.value === 'posts') {
        await reportsStore.fetchPostReports({ page: 1 })
        reportStats.value.posts = reportsStore.pagination.total
    } 
    // Nếu lỡ người dùng refresh trang mà đang ở tab khác thì logic này vẫn đúng
    else {
        await fetchReports(1) 
        reportStats.value[activeTab.value] = reportsStore.pagination.total
    }

  } catch (error) {
    console.error("Lỗi khởi tạo:", error)
  } finally {
    reportsStore.loading = false
  }

  // --- LOGIC REALTIME (GIỮ NGUYÊN) ---
  window.echo.private('reports.comment')
    .listen('CommentReportSent', (e) => {
      // Tăng số lượng ngay lập tức
      reportStats.value.comments++ 
      
      // Chỉ push vào bảng nếu đang xem tab Comments
      if(activeTab.value === 'comments' && reportsStore.pagination.current_page === 1){
        pushReport('comments', e)
        console.log('New comment report received:', e)
        reportsStore.pagination.total += 1 
      }
    })

  window.echo.private('reports.user')
    .listen('UserReportSent', (e) => {
      reportStats.value.users++ // Tăng badge
      if(activeTab.value === 'users' && reportsStore.pagination.current_page === 1) {
        pushReport('users', e)
        reportsStore.pagination.total += 1
      }
    })

  window.echo.private('reports.post')
    .listen('PostReportSent', (e) => {
      reportStats.value.posts++ // Tăng badge
      if(activeTab.value === 'posts' && reportsStore.pagination.current_page === 1) {
        pushReport('posts', e)
        reportsStore.pagination.total += 1
      }
    })
})
</script>
