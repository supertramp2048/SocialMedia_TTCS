<template>
  <Layout>
    <div class="min-h-screen bg-white">
      <!-- Main Content -->
      <main class="w-9/12 m-auto">
        <SkeletonLoader
          v-if="isLoadingPage"
          variant="detail"
          :minHeight="360"
          class="w-full max-w-[700px] mx-auto px-4 py-8"
        />
        <template v-else>
          <!-- Post Header Section -->
          <PostHeaderSection :post="post" />

          <!-- Post Action Bar -->
          <div class="w-full mx-auto px-4">
            <PostActionBar
              :post="post"
              :post-menu-items="postMenuItems"
              :menu-ref="menuRef"
              v-model="showOption"
              @upvote="upvote"
              @downvote="downvote"
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
          <SuggestedPost :categoryId="post?.data?.category?.id" :postId="post?.data?.id"></SuggestedPost>

          <!-- Comments Section -->
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
import { onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
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

const route = useRoute()

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
