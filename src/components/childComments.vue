<template>
  <!-- Loading skeleton for replies -->
  <SkeletonList v-if="loading" :rows="5" />

  <!-- Sample Comment -->
  <div v-else v-for="comment in replies" :key="comment.id" class="flex gap-3 mb-6">
    <div class="w-12 h-12 flex-shrink-0"></div>
    <div class="flex-1">
      <div class="flex justify-between items-center gap-2 mb-1">
        <!-- userDiv -->
        <UserDivComment
          :authorId="post.data?.author?.id"
          :user="comment?.author"
          :date="new Date(comment?.updated_at || comment?.created_at)"
          :content="comment?.content"
          class="flex-1"
        ></UserDivComment>

        <!-- ✅ NEW: Menu báo cáo 3 chấm (thay thế nút "Báo cáo bình luận" cũ) -->
        <div class="relative" :ref="el => childCommentMenuRefs[comment.id] = el">
          <button 
            v-if = "user && comment?.author?.id != user.id"
            @click.stop="toggleChildCommentMenu(comment.id)"
            :aria-expanded="openChildMenuCommentId === comment.id"
            aria-haspopup="menu"
            class="p-1 text-gray-400 hover:text-gray-600 transition-colors" 
            aria-label="Tùy chọn bình luận"
          >
            <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M2 4C0.89543 4 -4.82823e-08 3.10457 0 2C4.82823e-08 0.89543 0.895431 -4.82823e-08 2 0C3.10457 4.82823e-08 4 0.895431 4 2C4 3.10457 3.10457 4 2 4Z"
                fill="currentColor"
              />
              <path
                d="M2 10C0.89543 10 -4.82823e-08 9.10457 0 8C4.82823e-08 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10Z"
                fill="currentColor"
              />
              <path
                d="M2 16C0.89543 16 -4.82823e-08 15.1046 0 14C4.82823e-08 12.8954 0.895431 12 2 12C3.10457 12 4 12.8954 4 14C4 15.1046 3.10457 16 2 16Z"
                fill="currentColor"
              />
            </svg>
          </button>

          <!-- ✅ NEW: Sử dụng ReportMenu component -->
          <ReportMenu 
            v-if="openChildMenuCommentId === comment.id"
            :items="getChildCommentMenuItems(comment)"
            align="right"
            @close="openChildMenuCommentId = null"
          />
        </div>
      </div>

      <div class="items-center gap-3 text-text-secondary text-opacity-75">
        <div class="flex ml-[68px]">
          <!-- viet binh luan -->
          <button
            v-if="user"
            class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
            @click="showReplyForm(comment?.id)"
          >
            Trả lời
          </button>
          <!-- sua binh luan -->
          <button
            v-if="user && comment?.author?.id == user.id"
            class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
            @click="fixComment(comment?.id, comment?.content)"
          >
            Sửa
          </button>
          <!-- xoa binh luan  -->
          <button
            v-if="user && comment?.author?.id == user.id"
            class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
            :disabled="deleteSubmittingId === comment?.id"
            :aria-busy="deleteSubmittingId === comment?.id"
            @click="deleteComment(comment?.id, comment?.parent_id)"
          >
            <span v-if="deleteSubmittingId !== comment?.id">Xóa</span>
            <span v-else class="inline-flex items-center" aria-live="polite">
              <span class="mr-2">Đang xóa</span>
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            </span>
          </button>
        </div>

        <!-- form reply comment -->
        <form
          v-if="showReply.includes(comment?.id)"
          class="border-b border-border-lighter pb-6 mb-6"
          @submit.prevent="sendReplyComment(content_reply_comment, props.post?.id, comment?.id)"
        >
          <div class="relative w-full">
            <input
              type="text"
              v-model="content_reply_comment"
              placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết"
              class="peer leading-[50px] w-full text-lg text-black border-none focus:outline-none"
            />
            <span class="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gray-200"></span>
            <span
              class="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-black
                     transition-[width] duration-300 ease-out peer-focus:w-full">
            </span>
          </div>

          <div class="flex justify-end mt-4">
            <button
              type="submit"
              class="relative flex items-center justify-center gap-2 text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
              :disabled="replySubmittingId === comment?.id"
              :aria-busy="replySubmittingId === comment?.id"
            >
              <span v-if="replySubmittingId !== comment?.id">Gửi</span>
              <span v-else class="inline-flex items-center" aria-live="polite">
                <span class="mr-2">Đang gửi</span>
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              </span>
            </button>
          </div>
        </form>
        <!-- end form reply comment -->

        <!-- form fix comment form -->
        <form
          v-if="FixIndex.includes(comment?.id)"
          class="border-b border-border-lighter pb-6 mb-6"
          @submit.prevent="sendFixedComment(content_fixed_comment, comment?.id, props.parent_id)"
        >
          <div class="relative w-full">
            <input
              type="text"
              v-model="content_fixed_comment"
              placeholder="Hãy chia sẻ cảm nghĩ của bạn về bài viết"
              class="peer leading-[50px] w-full text-lg text-black border-none focus:outline-none"
            />
            <span class="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gray-200"></span>
            <span
              class="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-black
                     transition-[width] duration-300 ease-out peer-focus:w-full">
            </span>
          </div>

          <div class="flex justify-end mt-4">
            <button
              type="submit"
              class="relative flex items-center justify-center gap-2 text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
              :disabled="fixSubmittingId === comment?.id"
              :aria-busy="fixSubmittingId === comment?.id"
            >
              <span v-if="fixSubmittingId !== comment?.id">Gửi</span>
              <span v-else class="inline-flex items-center" aria-live="polite">
                <span class="mr-2">Đang sửa</span>
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              </span>
            </button>
          </div>
        </form>
        <!-- end fix comment form -->
      </div>

      <div class="ml-[68px]">
        <button
          v-if="comment?.replies_count > 0"
          @click="toggle(comment?.id)"
          class="text-[15px] font-bold text-blue-500"
        >
          {{ show.includes(comment?.id) ? 'Ẩn trả lời' : `${comment?.replies_count} Trả lời` }}
        </button>
      </div>

      <ChildComments
        v-if="show.includes(comment?.id)"
        :key="`child-${comment.id}`"
        :parent_id="comment?.id"
        :post="props.post"
      />
    </div>
  </div>

  <!-- ✅ NEW: ReportModal component -->
  <ReportModal
    v-model="showReportPostForm"
    :id="idReport"
    :type="typeOfReport"
  />
  <!-- end sample comment -->
</template>

<script setup lang="js">
import { ref, watch, onMounted, onBeforeUnmount } from "vue"
import api from "../../API/axios"
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import UserDivComment from '../components/userDivComment.vue'
import ReportModal from '../components/reportForm.vue'
// ✅ NEW: Import ReportMenu component
import ReportMenu from '../components/ReportMenu.vue'
import SkeletonList from './skeleton/SkeletonList.vue'

const props = defineProps({
  parent_id: { type: [Number, String], required: true },
  post: { type: Object, required: true }
})

const auth = useAuthStore()
const { user } = storeToRefs(auth)

const apiUrl = import.meta.env.VITE_API_BASE
const replies = ref([])
const loading = ref(false)
const error = ref(null)

// Inline submitting states per action
const replySubmittingId = ref(null)
const fixSubmittingId = ref(null)
const deleteSubmittingId = ref(null)

// ✅ NEW: State cho menu báo cáo (độc lập với component cha)
const openChildMenuCommentId = ref(null)
const childCommentMenuRefs = ref({})
const showReportPostForm = ref(false)
const typeOfReport = ref('')
const idReport = ref('')

// ✅ NEW: Toggle menu cho comment con
function toggleChildCommentMenu(commentId) {
  if (openChildMenuCommentId.value === commentId) {
    openChildMenuCommentId.value = null
  } else {
    openChildMenuCommentId.value = commentId
  }
}

// ✅ NEW: Báo cáo người dùng (tác giả comment)
function reportChildAuthor(userId) {
  typeOfReport.value = 'users'
  idReport.value = userId
  showReportPostForm.value = true
  openChildMenuCommentId.value = null // Đóng menu sau khi chọn
}

// ✅ NEW: Báo cáo bình luận con
function reportChildComment(commentId) {
  typeOfReport.value = 'comments'
  idReport.value = commentId
  showReportPostForm.value = true
  openChildMenuCommentId.value = null // Đóng menu sau khi chọn
}

// ✅ NEW: Tạo menu items cho từng comment con
function getChildCommentMenuItems(comment) {
  // Kiểm tra xem comment có phải của chính mình không
  const isOwnComment = Number(auth?.user?.id) === Number(comment?.author?.id)
  
  return [
    {
      label: 'Báo cáo người dùng',
      icon: 'fa-regular fa-flag',
      action: () => reportChildAuthor(comment.author.id),
      disabled: isOwnComment // ✅ Disable nếu là comment của mình
    },
    {
      label: 'Báo cáo bình luận',
      icon: 'fa-regular fa-flag',
      action: () => reportChildComment(comment.id)
    }
  ]
}

// ✅ NEW: Xử lý click outside để đóng menu
function handleClickOutside(e) {
  if (openChildMenuCommentId.value !== null) {
    const commentMenuEl = childCommentMenuRefs.value[openChildMenuCommentId.value]
    if (commentMenuEl && !commentMenuEl.contains(e.target)) {
      openChildMenuCommentId.value = null
    }
  }
}

// ✅ NEW: Xử lý phím Esc để đóng menu
function handleEscape(e) {
  if (e.key === 'Escape' && openChildMenuCommentId.value !== null) {
    openChildMenuCommentId.value = null
  }
}

// show form de dien comment
const showReply = ref([])
function showReplyForm(id) {
  const indexOfFix = FixIndex.value.indexOf(id)
  if (indexOfFix !== -1) {
    FixIndex.value.splice(indexOfFix, 1)
  }
  const i = showReply.value.indexOf(id)
  i === -1 ? showReply.value.push(id) : showReply.value.splice(i, 1)
}

// show form de sua comment
const FixIndex = ref([])
const content_fixed_comment = ref("")

function fixComment(id, content) {
  content_fixed_comment.value = content
  const i = showReply.value.indexOf(id)
  if (i !== -1) {
    showReply.value.splice(i, 1)
  }
  const indexOfFix = FixIndex.value.indexOf(id)
  indexOfFix === -1 ? FixIndex.value.push(id) : FixIndex.value.splice(indexOfFix, 1)
}

const show = ref([])
function toggle(id) {
  const i = show.value.indexOf(id)
  i === -1 ? show.value.push(id) : show.value.splice(i, 1)
}

const content_reply_comment = ref("")

// Fetch replies của props.parent_id
async function fetchReplies(id = props.parent_id) {
  if (!id) return
  loading.value = true
  error.value = null
  try {
    const res = await api.get(`${apiUrl}/api/comments/${id}/replies`)
    replies.value = Array.isArray(res.data?.data) ? res.data.data : res.data
  } catch (e) {
    error.value = e
    console.error('Fetch replies error:', e)
  } finally {
    loading.value = false
  }
}

// Gửi reply và refetch đúng cấp
async function sendReplyComment(content, postId, parent_id) {
  if (!content?.trim()) return

  try {
    replySubmittingId.value = parent_id
    const res = await api.post(`${apiUrl}/api/comments`, {
      content: content,
      post_id: postId,
      parent_id
    })

    if (res.status === 201) {
      await fetchReplies(props.parent_id)

      content_reply_comment.value = ""
      const i = showReply.value.indexOf(parent_id)
      if (i !== -1) showReply.value.splice(i, 1)

      if (!show.value.includes(parent_id)) {
        show.value.push(parent_id)
      }
    }
  } catch (error) {
    const status = error?.response?.status
    if (status === 401) {
      alert('Bạn cần đăng nhập')
      return
    }
    if (status === 422) {
      const errs = error.response.data?.errors || {}
      const firstErr = Object.values(errs).flat?.()[0] ||
        'Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).'
      alert(firstErr)
      return
    }
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại sau.')
  }
  finally {
    replySubmittingId.value = null
  }
}

// sua comment
async function sendFixedComment(content, id, parent_id) {
  if (!content?.trim()) return

  try {
    fixSubmittingId.value = id
    const res = await api.patch(`${apiUrl}/api/comments/${id}`, {
      content: content
    })

    if (res.status === 200 || res.status === 201) {
      const index = replies.value.findIndex(c => c.id === id)
      if (index !== -1) {
        replies.value[index].content = content
        replies.value[index].updated_at = new Date().toISOString()
      }

      content_fixed_comment.value = ""
      const i = FixIndex.value.indexOf(id)
      if (i !== -1) FixIndex.value.splice(i, 1)
    }
  } catch (error) {
    const status = error?.response?.status
    if (status === 401) {
      alert('Bạn cần đăng nhập')
      return
    }
    if (status === 422) {
      const errs = error.response.data?.errors || {}
      const firstErr = Object.values(errs).flat?.()[0] ||
        'Dữ liệu không hợp lệ.'
      alert(firstErr)
      return
    }
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại sau.')
  }
  finally {
    fixSubmittingId.value = null
  }
}

// xoa comment
async function deleteComment(id, parent_id) {
  if (!confirm('Bạn chắc muốn xoá bình luận này?')) return

  try {
    deleteSubmittingId.value = id
    const res = await api.delete(`${apiUrl}/api/comments/${id}`)
    if (res.status === 200 || res.status === 204) {
      const index = replies.value.findIndex(c => c.id === id)
      if (index !== -1) {
        replies.value.splice(index, 1)
      }

      alert('Xoá bình luận thành công!')
    }
  } catch (error) {
    const status = error?.response?.status
    if (status === 401) {
      alert('Bạn cần đăng nhập')
      return
    }
    console.error(error)
    alert('Xoá bình luận thất bại.')
  }
  finally {
    deleteSubmittingId.value = null
  }
}

// ✅ NEW: Mount/unmount event listeners
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})

// Watch parent_id và fetch replies
watch(() => props.parent_id, fetchReplies, { immediate: true })
</script>