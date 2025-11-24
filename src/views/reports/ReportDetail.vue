<template>
  <Teleport to="body">
    <div
      v-if="show && report"
      class="fixed inset-0 z-50 flex items-start justify-center bg-black/40 overflow-scroll"
      @click.self="handleClose"
    >
      <div
        class="mt-10 w-full max-w-3xl bg-white rounded-xl shadow-xl p-6 relative"
      >
        <button
          @click="handleClose"
          class="absolute right-4 top-4 text-gray-400 hover:text-gray-600 text-xl"
        >
          &times;
        </button>

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">Report Details</h1>
        </div>

        <LoadingSpinner v-if="loading" />

        <div v-else class="bg-white rounded-lg">
          <div class="mb-6">
            <h2 class="text-xl font-bold text-gray-900 mb-2">
              {{ report.reason }}
            </h2>
            <p v-if="report.description" class="text-gray-600">
              {{ report.description }}
            </p>
          </div>

          <div class="grid grid-cols-2 gap-6 mb-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Người báo cáo
              </label>
              <p class="mt-1 text-sm text-gray-900">
                {{ report.reporter?.name }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Thời gian
              </label>
              <p class="mt-1 text-sm text-gray-900">
                {{ formatDate(report.reported_at || report.created_at) }}
              </p>
            </div>
          </div>

          <div class="mt-6 pt-6 border-t border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Nội dung bị báo cáo
            </h3>

            <!-- POST -->
            <div
              v-if="report.evidence_post"
              class="p-4 bg-gray-50 rounded-lg"
            >
              <!-- Nếu đã load chi tiết post từ API -->
              <div class="overflow-scroll" v-if="post">
                <h4 class="font-medium text-gray-900">
                  {{ post?.data.title }}
                </h4>

                <p class="text-xs text-gray-500 mt-1">
                  Tác giả: {{ post?.data.author?.name }} •
                  {{ formatDate(post?.data.created_at) }}
                </p>

                <!-- Nội dung đầy đủ -->
                <div
                  class="prose prose-sm max-h-[500px] max-w-none mt-3 text-gray-800"
                  v-html="post?.data.content_html"
                ></div>
              </div>

              <!-- Nếu chưa kịp load post (hoặc lỗi), dùng tạm evidence_post trong report -->
              <div v-else>
                <h4 class="font-medium">
                  {{ report.evidence_post.title }}
                </h4>
                <p class="text-sm text-gray-600 mt-2">
                  {{ shorten(report.evidence_post.content_html) }}
                </p>
              </div>
            </div>

            <!-- COMMENT -->
            <div
              v-else-if="report.evidence_comment"
              class="p-4 bg-gray-50 rounded-lg overflow-scroll"
            >
              <p class="text-gray-600" >{{ formatDate(report.evidence_comment.created_at) }}</p>
              <p class="text-gray-900">
                {{ report.evidence_comment.content }}
              </p>
            </div>

            <!-- USER -->
<div
  v-else-if="report.reported_user"
  class="p-4 bg-gray-50 rounded-lg space-y-4"
>
  <!-- Thông tin người dùng -->
  <div v-if="userHistory?.user_info">
    <p class="text-sm font-semibold text-gray-900 mb-2">
      Thông tin người dùng
    </p>
    <p class="text-sm text-gray-700">
      <span class="font-medium">Tên:</span>
      {{ userHistory.user_info.name }}
    </p>
    <p class="text-sm text-gray-700">
      <span class="font-medium">Email:</span>
      {{ userHistory.user_info.email }}
    </p>
    <p class="text-sm text-gray-700">
      <span class="font-medium">Vai trò:</span>
      {{ userHistory.user_info.role }}
    </p>
    <p class="text-sm text-gray-700">
      <span class="font-medium">Trạng thái tài khoản:</span>
      <span v-if="userHistory.user_info.banned_until">
        Bị khóa đến {{ formatDate(userHistory.user_info.banned_until) }}
      </span>
      <span v-else class="text-green-600 font-medium">
        Đang hoạt động
      </span>
    </p>
  </div>

  <!-- Bài viết đã bị gỡ -->
  <div
    v-if="userHistory?.violations?.removed_posts?.length"
    class="pt-4 border-t border-gray-200"
  >
      <p class="text-sm font-semibold text-gray-900 mb-2">
        Bài viết đã bị gỡ ({{ userHistory.violations.removed_posts.length }})
      </p>
      <ul class="space-y-2 max-h-60 overflow-y-auto">
        <li
          v-for="postItem in userHistory.violations.removed_posts"
          :key="postItem.id"
          class="p-2 bg-white rounded border border-gray-200"
        >
          <p class="text-sm font-medium text-gray-900 line-clamp-2">
            {{ postItem.title }}
          </p>
          <p class="text-xs text-gray-500 mt-1">
            Đăng lúc: {{ formatDate(postItem.created_at) }}
          </p>
          <p class="text-xs text-gray-500">
            Trạng thái: 
            <span class="text-red-600" v-if="postItem.status === 'removed_by_mod'">
              Đã bị gỡ bởi moderator
            </span>
            <span v-else>
              {{ postItem.status }}
            </span>
          </p>
        </li>
      </ul>
    </div>

    <!-- Bình luận đã bị gỡ -->
    <div
      v-if="userHistory?.violations?.removed_comments?.length"
      class="pt-4 border-t border-gray-200"
    >
      <p class="text-sm font-semibold text-gray-900 mb-2">
        Bình luận đã bị gỡ ({{ userHistory.violations.removed_comments.length }})
      </p>
      <ul class="space-y-2 max-h-60 overflow-y-auto">
        <li
          v-for="comment in userHistory.violations.removed_comments"
          :key="comment.id"
          class="p-2 bg-white rounded border border-gray-200"
        >
          <p class="text-xs text-gray-500">
            {{ formatDate(comment.created_at) }}
          </p>
          <p class="text-sm text-gray-800 mt-1">
            {{ comment.content }}
          </p>
        </li>
      </ul>
    </div>

      <!-- Các báo cáo đang hoạt động -->
      <div
        v-if="userHistory?.violations?.active_user_reports?.length"
        class="pt-4 border-t border-gray-200"
      >
        <p class="text-sm font-semibold text-gray-900 mb-2">
          Số lượt báo cáo tài khoản này ({{ userHistory.violations.active_user_reports.length }})
        </p>
        <ul class="space-y-2 max-h-60 overflow-y-auto">
          <li
            v-for="active in userHistory.violations.active_user_reports"
            :key="active.report_id"
            class="p-2 bg-white rounded border border-gray-200"
          >
            <p class="text-sm text-gray-800">
              <span class="font-medium">Lý do:</span>
              {{ active.reason }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Thời gian: {{ formatDate(active.reported_at) }}
            </p>
            <p class="text-xs text-gray-500">
              Người báo cáo:
              <span class="font-medium">
                {{ active.reporter?.name }}
              </span>
            </p>
          </li>
        </ul>
      </div>

      <!-- Nếu có reported_user nhưng chưa load xong history -->
      <div
        v-if="report.reported_user && !userHistory"
        class="pt-4 text-sm text-gray-500"
      >
        Đang tải lịch sử vi phạm của người dùng...
      </div>
    </div>

            <!-- Fallback -->
            <div
              v-else
              class="p-4 bg-gray-50 rounded-lg text-sm text-gray-500"
            >
              Không có dữ liệu nội dung đính kèm.
            </div>
          </div>

          <div class="mt-6 flex space-x-4">
            <button
              v-if="!report.reported_user"
              @click="handleResolve()"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Gỡ bỏ nội dung 
            </button>
            <button v-if="report.reported_user"
            @click="showFormBan = !showFormBan"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
            Vô hiệu tài khoản người dùng
            </button>
            <button v-if="report.reported_user && userHistory?.user_info.banned_until != null"
            @click="unBan(userHistory?.user_info.id)"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
            Gỡ bỏ khóa tài khoản
            </button>
            <button
              @click="handleDelete"
              class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Bỏ qua
            </button>
          </div>
          <div v-if="showFormBan" class="mt-2">
          <label >
              Chọn số ngày khóa tài khoản này:
              <input type="number" class="text-center" min="1" v-model="numOfDays">
          </label>
          <button
          @click="banCurentUser(userHistory?.user_info.id)"
          class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >Khóa tài khoản này {{numOfDays}} ngày
          </button>
          </div>
        </div>
      </div>

    </div>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { useToast } from 'vue-toastification'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import api from '../../api/apiClient'

const props = defineProps({
  show: Boolean,
  report: Object
})


const showFormBan = ref(false)
const numOfDays = ref(Number(1))
async function banCurentUser(id){
  if(!confirm('Bạn có chắc muốn khóa tài khoản này ?')) return
  try {
    const res = await api.post(`/api/admin/users/${id}/ban`,{
      duration_days: numOfDays.value
    }
    )
    console.log(res.data);
    if(res.status == 200){
      await getAnUserReportedHistory(id)
      toast.success('Khóa tài khoản thành công')
    }
  } catch (error) {
    console.log(error);
    toast.error(error.message)
  }
  
}

async function unBan(id) {
  if(!confirm('Bạn muốn gở bỏ khóa đối với tài khoản này ?')) return
  try {
    const res = await api.post(`/api/admin/users/${id}/unban`)
    if(res.status == 200){
      await getAnUserReportedHistory(id)
      toast.success("Gỡ bỏ lệnh khóa thành công")
    }
  } catch (error) {
    toast.error(error.message)
  }
}
const emit = defineEmits(['close', 'resolved'])

const reportsStore = useReportsStore()
const toast = useToast()
const loading = ref(false)

// report lấy từ props
const report = computed(() => props.report)

// lưu chi tiết post lấy từ API
const post = ref(null)
const userHistory = ref(null)
async function getPostDetail(postId) {
  if (!postId) return
  try {
    const res = await api.get(`/api/posts/${postId}`)
    console.log('post detail: ', res.data) // <- cái này sẽ in khi mở popup
    post.value = res.data
  } catch (error) {
    console.error('getPostDetail error: ', error)
  }
}
  async function getAnUserReportedHistory(id){
    try {
      const res = await reportsStore.getAnUserReportedHistory(id)
      userHistory.value = res
      console.log("history ", userHistory.value);
      
    } catch (error) {
      console.log(error);
      
    }
  }
// Mỗi lần popup được mở (show = true) thì load chi tiết post
watch(
  () => props.show,
  async (isOpen) => {
    console.log('watch show: ', isOpen) // để anh thấy watcher có chạy

    if (!isOpen) {
      post.value = null
      return
    }

    const current = report.value
    console.log('current report: ', current)

    if (current?.evidence_post?.id) {
      await getPostDetail(current.evidence_post.id)
    }
    if(current?.reported_user?.id){
      const id = current.reported_user.id
      await getAnUserReportedHistory(id)
    }
  },
  {
    immediate: true
  }
)

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const shorten = (html) => {
  if (!html) return ''
  return html.length > 200 ? html.substring(0, 200) + '...' : html
}

const handleClose = () => {
  emit('close')
}

const handleDelete = async () => {
  const current = report.value
  if (!current) return

  if (!confirm('Bạn muốn bỏ qua báo cáo này ?')) return

  try {
    const id = current.report_id ?? current.id

    if (current.evidence_post) {
      await reportsStore.deleteReportPost(id)
    } else if (current.evidence_comment) {
      await reportsStore.deleteReportComment(id)
    } else if (current.reported_user) {
      await reportsStore.deleteReportUser(id)
    }

    toast.success('Thành công')
    emit('resolved', current)
    emit('close')
  } catch (error) {
    console.log(error)
    toast.error(error?.response?.data?.message || 'Failed to resolve report')
  }
}

const handleResolve = async () => {
  const current = report.value
  if (!current) return

  if (!confirm('Bạn muốn gỡ bỏ nội dung này khỏi trang người dùng ?')) return

  loading.value = true
  try {
    if (current.evidence_post) {
      await reportsStore.resolvePostReport(current.evidence_post.id)
    } else if (current.evidence_comment) {
      await reportsStore.resolveCommentReport(current.evidence_comment.id)
    } else if (current.reported_user) {
      await reportsStore.resolveUserReport(current.id)
    }

    toast.success('Report resolved successfully')
    emit('resolved', current)
    emit('close')
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to resolve report')
  } finally {
    try {
      const id = current.report_id ?? current.id
      if (current.evidence_post) {
        await reportsStore.deleteReportPost(id)
      } else if (current.evidence_comment) {
        await reportsStore.deleteReportComment(id)
      } else if (current.reported_user) {
        await reportsStore.deleteReportUser(id)
      }
    } catch (error) {
      
    }
    loading.value = false
  }
}
</script>
