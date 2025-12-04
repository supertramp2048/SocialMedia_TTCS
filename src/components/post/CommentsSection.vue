<template>
  <div class="max-w-full overflow-scroll mx-auto px-2 sm:px-4 mb-16">
    <div class="border border-border-lighter overflow-scroll rounded shadow-card p-4 sm:p-6">
      <!-- Comment Form -->
      <form
        v-if="user"
        class="border-b border-border-lighter pb-6 mb-6"
        @submit.prevent="handleSendComment"
      >
        <div class="relative w-full">
          <input
            type="text"
            v-model="commentValue"
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
            :disabled="commentSubmitting"
            :aria-busy="commentSubmitting"
            class="relative flex items-center justify-center gap-2 text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none"
          >
            <span v-if="!commentSubmitting">Gửi</span>
            <span v-else class="inline-flex items-center" aria-live="polite">
              <span class="mr-2">Đang gửi</span>
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
            </span>
          </button>
        </div>
      </form>

      <div v-else class="border-b border-border-lighter pb-6 mb-6">
        <p class="text-xl font-bold">Hãy đăng nhập để bình luận</p>
      </div>

      <!-- Skeleton khi load lần đầu -->
      <SkeletonList
        v-if="isLoadingComments && parentComments.length === 0"
        :rows="objPaginationComment.limit"
        aria-busy="true"
        aria-live="polite"
        class="mt-2"
      />

      <!--các comment cha với parent id = null Sample Comment -->
      <div v-else>
        <div v-for="comment in parentComments" :key="comment.id" class="flex gap-3 mb-6">
          <div class="flex-1">
            <div class="flex justify-between items-start gap-2 mb-1">
              <UserDivComment
                :authorId="post.data?.author?.id"
                :user="comment.author"
                :date="new Date(comment.updated_at || comment.created_at)"
                :content="comment.content"
              ></UserDivComment>

              <!-- Menu báo cáo cho comment -->
              <div class="relative" :ref="el => commentMenuRefs[comment.id] = el">
                <button
                  v-if="auth?.user?.id != comment.author?.id"
                  @click.stop="handleToggleCommentMenu(comment.id)"
                  :aria-expanded="openMenuCommentId === comment.id"
                  aria-haspopup="menu"
                  class="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  aria-label="Tùy chọn bình luận">
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

                <!-- Sử dụng ReportMenu component -->
                <ReportMenu
                  v-if="openMenuCommentId === comment.id"
                  :items="getCommentMenuItems(comment)"
                  align="right"
                  @close="openMenuCommentId = null"
                />
              </div>
            </div>

            <div class="items-center gap-3 text-text-secondary text-opacity-75">
              <div class="flex ml-[68px]">
                <button
                  v-if="user"
                  class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                  @click="handleShowReplyForm(comment.id)"
                >
                  Trả lời
                </button>

                <button
                  v-if="user && Number(comment.author?.id) === Number(user?.id)"
                  class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                  @click="handleFixComment(comment.id, comment.content, comment.parent_id)"
                >
                  Sửa
                </button>

                <button
                  v-if="user && Number(comment.author?.id) === Number(user?.id)"
                  class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                  @click="handleDeleteComment(comment.id, comment.parent_id)"
                >
                  Xóa
                </button>
              </div>

              <!-- form reply comment -->
              <form
                v-if="showReply && showReply.includes(comment.id)"
                class="border-b border-border-lighter pb-6 mb-6"
                @submit.prevent="handleSendReplyComment(comment.id)"
              >
                <div class="relative w-full">
                  <input
                    type="text"
                    v-model="replyValue"
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
                    class="text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl "
                  >
                    Gửi
                  </button>
                </div>
              </form>

              <!-- form fix comment -->
              <form
                v-if="FixIndex && FixIndex.includes(comment.id)"
                class="border-b border-border-lighter pb-6 mb-6"
                @submit.prevent="handleSendFixedComment(comment.id, comment.parent_id)"
              >
                <div class="relative w-full">
                  <input
                    type="text"
                    v-model="fixValue"
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
                    class="text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl "
                  >
                    Gửi
                  </button>
                </div>
              </form>
            </div>

            <div class="ml-[68px]">
              <button
                @click="handleToggle(comment.id)"
                v-if="comment.replies_count > 0"
                class="text-[15px] font-bold text-blue-500"
              >
                {{
                  show && show.includes(comment.id)
                    ?  'Ẩn trả lời'
                    : `${comment.replies_count} Trả lời`
                }}
              </button>
            </div>

            <ChildComments
              v-if="show && show.includes(comment.id)"
              :parent_id="comment.id"
              :post="post.data"
              :key="reloadKey[comment.id] || 0"
            />
          </div>
        </div>
      </div>

      <!-- Skeleton khi loadMore -->
      <SkeletonList
        v-if="isLoadingMore && parentComments.length > 0"
        :rows="3"
        class="mt-4"
      />

      <!-- nút hiển thị thêm bình luận -->
      <div v-if="!isLoadingComments || parentComments.length > 0" class="text-center mt-6">
        <button
          v-if="!isLoadingMore && metaComment && metaComment.current_page < metaComment.last_page"
          @click="handleLoadMoreComments"
          class="px-4 py-2 text-sky-600 font-semibold hover:underline rounded-lg"
        >
          Hiển thị thêm bình luận
        </button>

        <div v-else-if="isLoadingMore && parentComments.length === 0" class="text-gray-500 italic">
          Đang tải thêm bình luận...
        </div>

        <div v-else-if="metaComment && metaComment.current_page >= metaComment.last_page" class="text-gray-400 text-sm">
          Đã hiển thị tất cả bình luận
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import UserDivComment from '../userDivComment.vue'
import ChildComments from '../childComments.vue'
import ReportMenu from '../ReportMenu.vue'
import SkeletonList from '../skeleton/SkeletonList.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  // Comment state từ composable
  parentComments: {
    type: Array,
    required: true
  },
  metaComment: {
    type: Object,
    default: null
  },
  objPaginationComment: {
    type: Object,
    required: true
  },
  reloadKey: {
    type: Object,
    required: true
  },
  commentSubmitting: {
    type: Boolean,
    default: false
  },
  isLoadingComments: {
    type: Boolean,
    default: false
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  },
  content_comment: {
    type: String,
    required: true
  },
  content_reply_comment: {
    type: String,
    required: true
  },
  content_fixed_comment: {
    type: String,
    required: true
  },
  showReply: {
    type: Array,
    default: () => []
  },
  FixIndex: {
    type: Array,
    default: () => []
  },
  show: {
    type: Array,
    default: () => []
  },
  openMenuCommentId: {
    type: [Number, String, null],
    default: null
  },
  commentMenuRefs: {
    type: Object,
    required: true
  },
  getCommentMenuItems: {
    type: Function,
    required: true
  }
})

const emit = defineEmits([
  'update:content_comment',
  'update:content_reply_comment',
  'update:content_fixed_comment',
  'send-comment',
  'send-reply-comment',
  'send-fixed-comment',
  'delete-comment',
  'show-reply-form',
  'fix-comment',
  'toggle',
  'load-more-comments',
  'toggle-comment-menu'
])

const auth = useAuthStore()
const { user } = storeToRefs(auth)

// Computed với getter/setter để xử lý v-model đúng cách
const commentValue = computed({
  get: () => props.content_comment,
  set: (val) => emit('update:content_comment', val)
})

const replyValue = computed({
  get: () => props.content_reply_comment,
  set: (val) => emit('update:content_reply_comment', val)
})

const fixValue = computed({
  get: () => props.content_fixed_comment,
  set: (val) => emit('update:content_fixed_comment', val)
})

function handleSendComment() {
  // Dùng props vì đó là nguồn dữ liệu thực tế
  const content = props.content_comment?.trim()
  if (!content) return // Không gửi nếu rỗng
  emit('send-comment', content, props.post.data?.id)
  // Input sẽ được xóa trong composable sau khi API thành công
}

function handleSendReplyComment(parentId) {
  // Dùng props vì đó là nguồn dữ liệu thực tế
  const content = props.content_reply_comment?.trim()
  if (!content) return // Không gửi nếu rỗng
  emit('send-reply-comment', content, props.post.data?.id, parentId)
  // Input sẽ được xóa trong composable sau khi API thành công
}

function handleSendFixedComment(commentId, parentId) {
  // Dùng props vì đó là nguồn dữ liệu thực tế
  const content = props.content_fixed_comment?.trim()
  if (!content) return // Không gửi nếu rỗng
  emit('send-fixed-comment', content, commentId, parentId)
  // Input sẽ được xóa trong composable sau khi API thành công
}

function handleDeleteComment(commentId, parentId) {
  emit('delete-comment', commentId, parentId)
}

function handleShowReplyForm(commentId) {
  emit('show-reply-form', commentId)
}

function handleFixComment(commentId, content, parentId) {
  emit('fix-comment', commentId, content, parentId)
}

function handleToggle(commentId) {
  emit('toggle', commentId)
}

function handleLoadMoreComments() {
  emit('load-more-comments')
}

function handleToggleCommentMenu(commentId) {
  emit('toggle-comment-menu', commentId)
}
</script>

