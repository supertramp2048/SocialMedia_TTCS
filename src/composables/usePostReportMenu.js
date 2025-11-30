import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable quản lý logic report menu
 * - Report post/comment/author
 * - Toggle menu states
 * - Handle click outside
 */
export function usePostReportMenu(post) {
  const showOption = ref(false)
  const openMenuCommentId = ref(null)
  const commentMenuRefs = ref({})
  const menuRef = ref(null)

  // Report modal state
  const showReportPostForm = ref(false)
  const typeOfReport = ref('')
  const idReport = ref('')

  // Report functions
  function reportPost(idPost) {
    showReportPostForm.value = true
    typeOfReport.value = 'posts'
    idReport.value = idPost
    showOption.value = false
  }

  function reportComment(idComment) {
    showReportPostForm.value = true
    typeOfReport.value = 'comments'
    idReport.value = idComment
    openMenuCommentId.value = null
  }

  function reportAuthor(idAuthor) {
    showReportPostForm.value = true
    idReport.value = idAuthor
    typeOfReport.value = 'users'
    showOption.value = false
    openMenuCommentId.value = null
  }

  // Toggle menu cho comment
  function toggleCommentMenu(commentId) {
    if (openMenuCommentId.value === commentId) {
      openMenuCommentId.value = null
    } else {
      openMenuCommentId.value = commentId
    }
    // Đóng menu post nếu đang mở
    showOption.value = false
  }

  // Menu items cho post
  const postMenuItems = computed(() => [
    {
      label: 'Báo cáo người dùng',
      icon: 'fa-regular fa-flag',
      action: () => reportAuthor(post.value.data?.author?.id)
    },
    {
      label: 'Báo cáo bài viết',
      icon: 'fa-regular fa-flag',
      action: () => reportPost(post.value.data?.id)
    }
  ])

  // Menu items cho từng comment
  function getCommentMenuItems(comment) {
    const auth = useAuthStore()
    const isOwnComment = auth?.user?.id === comment.author?.id

    return [
      {
        label: 'Báo cáo người dùng',
        icon: 'fa-regular fa-flag',
        action: () => reportAuthor(comment.author.id),
        disabled: isOwnComment // Disable nếu là comment của mình
      },
      {
        label: 'Báo cáo bình luận',
        icon: 'fa-regular fa-flag',
        action: () => reportComment(comment.id)
      }
    ]
  }

  // Handle click outside
  function handleClickOutside(e) {
    // Đóng menu post
    if (menuRef.value && !menuRef.value.contains(e.target)) {
      showOption.value = false
    }

    // Đóng menu comment
    if (openMenuCommentId.value !== null) {
      const commentMenuEl = commentMenuRefs.value[openMenuCommentId.value]
      if (commentMenuEl && !commentMenuEl.contains(e.target)) {
        openMenuCommentId.value = null
      }
    }
  }

  // Setup click outside listener
  onMounted(() => {
    document.addEventListener('click', handleClickOutside)
  })

  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
  })

  return {
    showOption,
    openMenuCommentId,
    commentMenuRefs,
    menuRef,
    showReportPostForm,
    typeOfReport,
    idReport,
    reportPost,
    reportComment,
    reportAuthor,
    toggleCommentMenu,
    postMenuItems,
    getCommentMenuItems
  }
}

