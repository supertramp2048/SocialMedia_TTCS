<template>
  <!-- Loading skeleton for replies -->
  <SkeletonList v-if="loading" :rows="5" />

  <!-- Replies list -->
  <div v-else v-for="comment in replies" :key="comment.id" class="flex gap-3 mb-6">
    <!-- khoảng trống avatar giống comment cha -->
    <div class="w-12 h-12 flex-shrink-0"></div>

    <div class="flex-1">
      <!-- Header: user + menu 3 chấm -->
      <div class="flex justify-between items-center gap-2 mb-1">
        <UserDivComment
          :authorId="post.data?.author?.id"
          :user="comment?.author"
          :date="new Date(comment?.updated_at || comment?.created_at)"
          :content="comment?.content"
          class="flex-1"
        />

        <!-- Menu 3 chấm cho comment con -->
        <div class="relative" :ref="el => childCommentMenuRefs[comment.id] = el">
          <button
            v-if="user && comment?.author?.id != user.id"
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

          <ReportMenu
            v-if="openChildMenuCommentId === comment.id"
            :items="getChildCommentMenuItems(comment)"
            align="right"
            @close="openChildMenuCommentId = null"
          />
        </div>
      </div>

      <!-- Actions: Trả lời / Sửa / Xóa -->
      <div class="items-center gap-3 text-text-secondary text-opacity-75">
        <div class="flex ml-[68px]">
          <button
            v-if="user"
            class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
            @click="showReplyForm(comment?.id)"
          >
            Trả lời
          </button>

          <button
            v-if="user && comment?.author?.id == user.id"
            class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
            @click="fixComment(comment?.id, comment?.content)"
          >
            Sửa
          </button>

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

        <!-- Form reply cho comment con -->
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

        <!-- Form sửa comment con -->
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
      </div>

      <!-- Nút mở thread con sâu hơn -->
      <div class="ml-[68px]">
        <button
          v-if="comment?.replies_count > 0"
          @click="toggle(comment?.id)"
          class="text-[15px] font-bold text-blue-500"
        >
          {{ show.includes(comment?.id) ? 'Ẩn trả lời' : `${comment?.replies_count} Trả lời` }}
        </button>
      </div>

      <!-- Đệ quy ChildComments cho reply sâu hơn -->
      <ChildComments
        v-if="show.includes(comment?.id)"
        :key="`child-${comment.id}`"
        :parent_id="comment?.id"
        :post="props.post"
      />
    </div>
  </div>

  <!-- Modal report -->
  <ReportModal
    v-model="showReportPostForm"
    :id="idReport"
    :type="typeOfReport"
  />
</template>

<script setup lang="js">
import { ref, watch, onMounted, onBeforeUnmount, inject } from 'vue'
import api from '../../API/axios'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'

import UserDivComment from '../components/userDivComment.vue'
import ReportModal from '../components/reportForm.vue'
import ReportMenu from '../components/ReportMenu.vue'
import SkeletonList from '../components/skeleton/SkeletonList.vue'
import ChildComments from '../components/childComments.vue'

const props = defineProps({
  parent_id: { type: [Number, String], required: true },
  post: { type: Object, required: true }
})
const echo = inject('echo')
const auth = useAuthStore()
const { user } = storeToRefs(auth)

const apiUrl = import.meta.env.VITE_API_BASE
const replies = ref([])
const loading = ref(false)
const error = ref(null)

// state loading cho từng action
const replySubmittingId = ref(null)
const fixSubmittingId = ref(null)
const deleteSubmittingId = ref(null)

// Menu báo cáo
const openChildMenuCommentId = ref(null)
const childCommentMenuRefs = ref({})
const showReportPostForm = ref(false)
const typeOfReport = ref('')
const idReport = ref('')

function toggleChildCommentMenu(commentId) {
  openChildMenuCommentId.value =
    openChildMenuCommentId.value === commentId ? null : commentId
}

function reportChildAuthor(userId) {
  typeOfReport.value = 'users'
  idReport.value = userId
  showReportPostForm.value = true
  openChildMenuCommentId.value = null
}

function reportChildComment(commentId) {
  typeOfReport.value = 'comments'
  idReport.value = commentId
  showReportPostForm.value = true
  openChildMenuCommentId.value = null
}

function getChildCommentMenuItems(comment) {
  const isOwnComment = Number(auth?.user?.id) === Number(comment?.author?.id)

  return [
    {
      label: 'Báo cáo người dùng',
      icon: 'fa-regular fa-flag',
      action: () => reportChildAuthor(comment.author.id),
      disabled: isOwnComment
    },
    {
      label: 'Báo cáo bình luận',
      icon: 'fa-regular fa-flag',
      action: () => reportChildComment(comment.id)
    }
  ]
}

function handleClickOutside(e) {
  if (openChildMenuCommentId.value !== null) {
    const el = childCommentMenuRefs.value[openChildMenuCommentId.value]
    if (el && !el.contains(e.target)) {
      openChildMenuCommentId.value = null
    }
  }
}

function handleEscape(e) {
  if (e.key === 'Escape' && openChildMenuCommentId.value !== null) {
    openChildMenuCommentId.value = null
  }
}

// UI state cho form reply/sửa + mở thread con
const showReply = ref([])
const FixIndex = ref([])
const show = ref([])

const content_reply_comment = ref('')
const content_fixed_comment = ref('')

function showReplyForm(id) {
  const idxFix = FixIndex.value.indexOf(id)
  if (idxFix !== -1) FixIndex.value.splice(idxFix, 1)

  const i = showReply.value.indexOf(id)
  i === -1 ? showReply.value.push(id) : showReply.value.splice(i, 1)
}

function fixComment(id, content) {
  content_fixed_comment.value = content

  const i = showReply.value.indexOf(id)
  if (i !== -1) showReply.value.splice(i, 1)

  const idxFix = FixIndex.value.indexOf(id)
  idxFix === -1 ? FixIndex.value.push(id) : FixIndex.value.splice(idxFix, 1)
}

function toggle(id) {
  const i = show.value.indexOf(id)
  i === -1 ? show.value.push(id) : show.value.splice(i, 1)
}

// Fetch replies cho parent_id hiện tại
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

// Gửi reply cho comment ở level này
async function sendReplyComment(content, postId, parent_id) {
  if (!content?.trim()) return

  try {
    replySubmittingId.value = parent_id
    const res = await api.post(`${apiUrl}/api/comments`, {
      content,
      post_id: postId,
      parent_id
    })

    if (res.status === 201) {
      await fetchReplies(props.parent_id)

      content_reply_comment.value = ''
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
      const firstErr =
        (Object.values(errs).flat?.()[0]) ||
        'Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).'
      alert(firstErr)
      return
    }
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại sau.')
  } finally {
    replySubmittingId.value = null
  }
}

// Sửa comment ở level này
async function sendFixedComment(content, id, parent_id) {
  if (!content?.trim()) return

  try {
    fixSubmittingId.value = id
    const res = await api.patch(`${apiUrl}/api/comments/${id}`, { content })

    if (res.status === 200 || res.status === 201) {
      const index = replies.value.findIndex(c => c.id === id)
      if (index !== -1) {
        replies.value[index].content = content
        replies.value[index].updated_at = new Date().toISOString()
      }

      content_fixed_comment.value = ''
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
      const firstErr =
        (Object.values(errs).flat?.()[0]) ||
        'Dữ liệu không hợp lệ.'
      alert(firstErr)
      return
    }
    console.error(error)
    alert('Có lỗi xảy ra, vui lòng thử lại sau.')
  } finally {
    fixSubmittingId.value = null
  }
}

// Xóa comment ở level này
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
  } finally {
    deleteSubmittingId.value = null
  }
}

// child comment listener

function setupChildEchoListener(postId) {
  if (!echo || !postId) return

  const channelName = `comment.${postId}`
  const channel = echo.private(channelName)

  channel.listen('CommentSent', (event) => {
    const newComment = {
      id: event.id,
      post_id: event.post_id,
      parent_id: event.parent_id,
      content: event.content,
      created_at: event.created_at,
      updated_at: event.created_at,
      author: event.sender ? {
        id: event.sender.id,
        name: event.sender.name,
        avatar: event.sender.avatar
      } : null,
      replies_count: 0
    }

    if (auth.user?.id === newComment.author?.id) {
      return
    }

    // Reply trực tiếp của parent_id mà component này đang xử lý
    if (newComment.parent_id == props.parent_id) {
      replies.value.unshift(newComment)
      return
    }

    // Reply sâu hơn (reply của 1 comment trong replies hiện tại)
    const parent = replies.value.find(c => c.id === newComment.parent_id)
    if (parent) {
      parent.replies_count = (parent.replies_count || 0) + 1

      // Nếu đang mở block replies cho comment này, chủ yếu là để ChildComments con hiển thị
      if (!show.value.includes(parent.id)) {
        // tuỳ anh: có thể tự mở, hoặc chỉ tăng count
        // show.value.push(parent.id)
      }
    }
  })

  return channel
}


let childChannel = null

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
  childChannel = setupChildEchoListener(props.post.id)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
  if (echo && props.post?.id) {
    echo.leave(`comment.${props.post.id}`)
  }
})


watch(() => props.parent_id, fetchReplies, { immediate: true })
</script>
