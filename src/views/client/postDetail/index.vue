<template>
  <Layout>
    <div class="min-h-screen bg-white">
      <!-- Main Content -->
      <main class="w-full max-w-[1100px] mx-auto px-4 sm:px-6 lg:px-4">
        <SkeletonLoader
          v-if="isLoadingPage"
          variant="detail"
          :minHeight="360"
          class="w-full max-w-[700px] mx-auto px-4 py-8"
        />
        <template v-else>
          <!-- Post Header Section -->
          <PostHeaderSection :post="post" />

          <!-- Post Action Bar - Horizontal (Mobile) + Vertical Floating (Desktop) -->
          <div class="w-full mx-auto px-4">
            <PostActionBar
              :post="post"
              :post-menu-items="postMenuItems"
              :menu-ref="menuRef"
              v-model="showOption"
              layout="vertical"
              @upvote="upvote"
              @downvote="downvote"
              @scrollToComment="handleScroll"
            />
          </div>

          <!-- Author Follow Section -->
          <div class="w-full mx-auto px-4">
            <AuthorFollowSection
              :post="post"
              :is-loading="isLoading"
              @follow="followHandler"
            />
          </div>

          <!-- Related Articles Section -->
          <SuggestedPost 
            :categoryId="post?.data?.category?.id" 
<<<<<<< HEAD
            :currentId="post?.data?.id"
=======
            :postId="post?.data?.id"
>>>>>>> longke
          />

          <!-- Comments Section -->
          <div ref="commentsSection">
          <CommentsSection
            :post="post"
            :parent-comments="parentComments"
            :meta-comment="metaComment"
            :obj-pagination-comment="objPaginationComment"
            :reload-key="reloadKey"
            :comment-submitting="commentSubmitting"
            :is-loading-comments="isLoadingComments"
            :is-loading-more="isLoadingMore"
            v-model:content_comment="content_comment"
            v-model:content_reply_comment="content_reply_comment"
            v-model:content_fixed_comment="content_fixed_comment"
            :show-reply="showReply"
            :fix-index="FixIndex"
            :show="show"
            :open-menu-comment-id="openMenuCommentId"
            :comment-menu-refs="commentMenuRefs"
            :get-comment-menu-items="getCommentMenuItems"
            :isLoading-fix-comment="isLoadingFixComment"
            @send-comment="sendComment"
            @send-reply-comment="sendReplyComment"
            @send-fixed-comment="sendFixedComment"
            @delete-comment="deleteComment"
            @show-reply-form="showReplyForm"
            @fix-comment="fixComment"
            @toggle="toggle"
            @load-more-comments="loadMoreComments"
            @toggle-comment-menu="toggleCommentMenu"
          />
          </div>
        </template>
      </main>

      <ReportModal
        v-model="showReportPostForm"
        :id="idReport"
        :type="typeOfReport"
      />
    </div>
  </Layout>
</template>

<script setup lang="js">
import { onMounted, onUnmounted, watch } from 'vue'

import { useRoute, useRouter } from 'vue-router'
import Layout from '../layout/layout.vue'
import SkeletonLoader from '../../../components/ui/SkeletonLoader.vue'
import SuggestedPost from '../../../components/suggestedPost.vue'
import ReportModal from '../../../components/reportForm.vue'
import PostHeaderSection from '../../../components/post/PostHeaderSection.vue'
import PostActionBar from '../../../components/post/PostActionBar.vue'
import AuthorFollowSection from '../../../components/post/AuthorFollowSection.vue'
import CommentsSection from '../../../components/post/CommentsSection.vue'
import { usePostDetail } from '../../../composables/usePostDetail'
import { usePostComments } from '../../../composables/usePostComments'
import { usePostReportMenu } from '../../../composables/usePostReportMenu'
import { ref } from 'vue'
const route = useRoute()
const router = useRouter()
// Composable: Post Detail
const {
  post,
  postSuggested,
  isLoadingPage,
  fetchPost,
  fetchSuggestedPosts,
  upvote,
  downvote,
  followHandler,
  isLoading
} = usePostDetail()

// Composable: Comments
const {
  parentComments,
  metaComment,
  objPaginationComment,
  reloadKey,
  commentSubmitting,
  isLoadingComments,
  isLoadingMore,
  isLoadingFixComment,
  content_comment,
  content_reply_comment,
  content_fixed_comment,
  showReply,
  FixIndex,
  show,
  getParentComments,
  loadMoreComments,
  sendComment,
  sendReplyComment,
  sendFixedComment,
  deleteComment,
  showReplyForm,
  fixComment,
  toggle,
  setupEchoListener,
  cleanupEchoListener
} = usePostComments(post)

// Composable: Report Menu
const {
  showOption,
  openMenuCommentId,
  commentMenuRefs,
  menuRef,
  showReportPostForm,
  typeOfReport,
  idReport,
  postMenuItems,
  getCommentMenuItems,
  toggleCommentMenu
} = usePostReportMenu(post)
const commentsSection = ref(null)
function handleScroll(){
  if (!commentsSection.value) return
  commentsSection.value.scrollIntoView({
    behavior: 'smooth',   // cuộn mượt
    block: 'start'        // canh phần trên cùng
  })
}
watch(
  () => route.query.id,
  async (newId) => {
    if (!newId) return

    const postId = Number(newId)
    if (isNaN(postId)) return

    await getParentComments(postId)
  },
  { immediate: true }
)

// Initialize
onMounted(async () => {
  try {
    const postId = Number(route.query.id)
    await fetchPost(postId)
    await fetchSuggestedPosts(post.value.data.category?.id, post.value.data.id)
    await getParentComments(postId)

    // Setup Echo listener
    if (post.value?.data?.id) {
      setupEchoListener(post.value.data.id)
    }
  } catch (error) {
    alert("Hệ thống đang bảo trì")
  }
})

onUnmounted(() => {
  if (post.value?.data?.id) {
    cleanupEchoListener(post.value.data.id)
  }
})
</script>