import { ref, inject, onMounted, onUnmounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
import api from '../../API/axios'

/**
 * Composable quản lý logic comments
 * - Fetch comments (pagination)
 * - Send comment/reply
 * - Edit/Delete comment
 * - Echo realtime CommentSent
 */
export function usePostComments(post) {
  const route = useRoute()
  const apiUrl = import.meta.env.VITE_API_BASE
  const auth = useAuthStore()
  const { user } = storeToRefs(auth)
  const echo = inject('echo')

  // State
  const parentComments = ref([])
  const metaComment = ref(null)
  const objPaginationComment = ref({
    page: 1,
    limit: 10,
  })
  const reloadKey = ref({})
  const commentSubmitting = ref(false)
  const isLoadingComments = ref(false)
  const isLoadingMore = ref(false)
  const isLoadingFixComment = ref(false)
  // Form states
  const content_comment = ref('')
  const content_reply_comment = ref('')
  const content_fixed_comment = ref('')
  const showReply = ref([])
  const FixIndex = ref([])
  const show = ref([])

  // Fetch parent comments
  async function getParentComments(postId) {
    try {
      if (objPaginationComment.value.page === 1) {
        isLoadingComments.value = true
      }

      const res = await api.get(`/api/posts/${postId}/comments`, {
        params: {
          page: objPaginationComment.value.page,
          limit: objPaginationComment.value.limit
        }
      })

      const { data, meta } = res.data
      metaComment.value = meta

      // Nếu là trang đầu tiên → gán mới
      if (objPaginationComment.value.page === 1) {
        parentComments.value = data
      } else {
        // Nếu là các trang tiếp theo → nối thêm
        parentComments.value.push(...data)
      }

    } catch (error) {
      console.error('Lỗi khi tải bình luận:', error)
    } finally {
      if (objPaginationComment.value.page === 1) {
        isLoadingComments.value = false
      }
    }
  }

  // Load more comments
  async function loadMoreComments() {
    if (isLoadingMore.value) return
    if (metaComment.value && metaComment.value.current_page >= metaComment.value.last_page) return

    isLoadingMore.value = true
    objPaginationComment.value.page++
    const postId = Number(route.query.id)
    await getParentComments(postId)
    isLoadingMore.value = false
  }

  // Send comment (parent)
  async function sendComment(content, post_id) {
    if (!content?.trim()) return

    try {
      commentSubmitting.value = true
      const res = await api.post(`${apiUrl}/api/comments`, {
        content: content,
        post_id: post_id
      })

      if (res.status === 201) {
        // Xóa input sau khi gửi thành công
        content_comment.value = ''
        await nextTick() // Đảm bảo DOM update
        console.log('✅ Đã xóa content_comment:', content_comment.value)

        // Nếu backend trả về comment object trong response, unshift vào đầu mảng
        const newComment = res.data?.data ?? res.data
        if (newComment && newComment.id) {
          parentComments.value.unshift(newComment)
        } else {
          // Fallback: refetch parentComments
          parentComments.value = []
          objPaginationComment.value.page = 1
          await getParentComments(Number(route.query.id))
        }

        // Cập nhật comments_count
        if (typeof post.value?.data?.comments_count === 'number') {
          post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
        }
      }
    } catch (error) {
      const status = error?.response?.status
      if (status === 401) return alert('Bạn cần đăng nhập')
      if (status === 422) {
        const errs = error.response.data?.errors || {}
        const firstErr = Object.values(errs).flat?.()[0] ||
          'Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).'
        return alert(firstErr)
      }
      console.error(error)
      alert('Có lỗi xảy ra, vui lòng thử lại sau.')
    } finally {
      commentSubmitting.value = false
    }
  }

  // Send reply comment
  async function sendReplyComment(content, postId, parent_id) {
    if (!content?.trim()) return

    try {
      const res = await api.post(`${apiUrl}/api/comments`, {
        content: content,
        post_id: postId,
        parent_id: parent_id
      })

      if (res.status === 201) {
        if (!show.value.includes(parent_id)) {
          show.value.push(parent_id)
        }

        const idx = parentComments.value.findIndex(c => c.id === parent_id)
        if (idx !== -1) {
          parentComments.value[idx].replies_count =
            (parentComments.value[idx].replies_count || 0) + 1
        }

        reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1

        // Xóa input reply sau khi gửi thành công
        content_reply_comment.value = ''
        await nextTick() // Đảm bảo DOM update
        console.log('✅ Đã xóa content_reply_comment:', content_reply_comment.value)
        const i = showReply.value.indexOf(parent_id)
        if (i !== -1) showReply.value.splice(i, 1)
      }
    } catch (error) {
      const status = error?.response?.status
      if (status === 401) return alert('Bạn cần đăng nhập')
      if (status === 422) {
        const errs = error.response.data?.errors || {}
        const firstErr = Object.values(errs).flat?.()[0] ||
          'Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).'
        return alert(firstErr)
      }
      console.error(error)
      alert('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
  }

  // Edit comment
  async function sendFixedComment(content, id, parent_id) {
    if (!content?.trim()) return

    try {
      isLoadingFixComment.value = true
      const res = await api.patch(`${apiUrl}/api/comments/${id}`, { content })

      if (res.status === 200) {
        const updated = res.data?.data ?? res.data

        if (parent_id == null) {
          // Sửa comment cha: cập nhật đúng nguồn đang render
          const list = parentComments.value || []
          const idx = list.findIndex(c => c.id === id)
          if (idx !== -1) {
            // replace để đảm bảo reactivity
            parentComments.value[idx] = { ...list[idx], ...updated }
          } else {
            // fallback: refetch trang đầu cho chắc
            parentComments.value = []
            objPaginationComment.value.page = 1
            await getParentComments(Number(route.query.id))
          }
        } else {
          // Sửa reply: ép ChildComments refetch
          reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1
        }

        // Xóa input fix sau khi gửi thành công
        content_fixed_comment.value = ""
        await nextTick() // Đảm bảo DOM update
        console.log('✅ Đã xóa content_fixed_comment:', content_fixed_comment.value)
        const i = FixIndex.value.indexOf(id)
        if (i !== -1) FixIndex.value.splice(i, 1)
      }
    } catch (error) {
      const status = error?.response?.status
      if (status === 401) return alert('Bạn cần đăng nhập')
      if (status === 422) {
        const errs = error.response.data?.errors || {}
        const firstErr = Object.values(errs).flat?.()[0] || 'Dữ liệu không hợp lệ.'
        return alert(firstErr)
      }
      console.error(error)
      alert('Có lỗi xảy ra, vui lòng thử lại sau.')
    }
    finally{
      isLoadingFixComment.value = false
    }
  }

  // Delete comment
  async function deleteComment(id, parent_id) {
    if (!confirm(`Bạn chắc muốn xoá bình luận này?`)) return

    try {
      const res = await api.delete(`${apiUrl}/api/comments/${id}`)

      if (res.status === 200 || res.status === 204) {
        if (parent_id == null) {
          // Xóa comment cha trong parentComments
          const i = parentComments.value.findIndex(c => c.id === id)
          if (i !== -1) {
            parentComments.value.splice(i, 1)
          }

          if (typeof post.value?.data?.comments_count === 'number') {
            post.value.data.comments_count = Math.max(0, post.value.data.comments_count - 1)
          }
        } else {
          // Xóa reply: giảm replies_count ở đúng nguồn
          const pIdx = parentComments.value.findIndex(c => c.id === parent_id)
          if (pIdx !== -1) {
            parentComments.value[pIdx].replies_count =
              Math.max(0, (parentComments.value[pIdx].replies_count || 1) - 1)
          }
          reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1
        }
      }
    } catch (error) {
      const status = error?.response?.status
      if (status === 401) return alert('Bạn cần đăng nhập')
      alert('Xoá bình luận thất bại.')
    }
  }

  // UI helpers
  function showReplyForm(id) {
    console.log(showReply);
    
    const indexOfFix = FixIndex.value.indexOf(id)
    if (indexOfFix !== -1) {
      FixIndex.value.splice(indexOfFix, 1)
    }
    const i = showReply.value.indexOf(id)
    i === -1 ? showReply.value.push(id) : showReply.value.splice(i, 1)
  }

  function fixComment(id, content, parent_id) {
    console.log("id: ",id, "content: ",content, "parent_id: ",parent_id);
    console.log(FixIndex);
    
    content_fixed_comment.value = content
    const i = showReply.value.indexOf(id)
    if (i !== -1) showReply.value.splice(i, 1)

    const indexOfFix = FixIndex.value.indexOf(id)
    indexOfFix === -1 ? FixIndex.value.push(id) : FixIndex.value.splice(indexOfFix, 1)
  }

  function toggle(id) {
    const index = show.value.indexOf(id)
    if (index === -1) {
      show.value.push(id)
    } else {
      show.value.splice(index, 1)
    }
  }

  // Setup Echo listener for CommentSent
  function setupEchoListener(postId) {
  if (!echo || !postId) return

  const channelName = `comment.${postId}`
  const channel = echo.private(channelName)

  channel.listen('CommentSent', (event) => {
    console.log('📨 Nhận sự kiện CommentSent:', event)

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
        avatar: event.sender.avatar,
      } : null,
      replies_count: 0,
    }

    // Bỏ qua comment do chính user hiện tại gửi (đã xử lý local)
    if (auth.user?.id === newComment.author?.id) {
      return
    }

    // 1. Comment cha mới
    if (!newComment.parent_id) {
      parentComments.value.unshift(newComment)

      if (post.value?.data) {
        post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
      }
      return
    }

    // 2. Reply cho 1 comment cha (level 1)
    const parent = parentComments.value.find(c => c.id === newComment.parent_id)

    if (parent) {
      // tăng replies_count cho nút "X Trả lời"
      parent.replies_count = (parent.replies_count || 0) + 1

      // nếu đang mở thread này thì ChildComments sẽ remount và fetch lại
      if (show.value.includes(parent.id)) {
        reloadKey.value[parent.id] = (reloadKey.value[parent.id] || 0) + 1
      }

      if (post.value?.data) {
        post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
      }

      return
    }

    // 3. Reply cho reply (deep-level)
    // Với kiến trúc hiện tại (ChildComments tự fetch theo parent_id),
    // ở đây chúng ta chỉ có thể cập nhật tổng số comment,
    // còn UI thread sâu sẽ thấy comment mới sau khi user tương tác lại
    // hoặc khi reload thread (tuỳ anh muốn trigger thêm gì sau này).

    if (post.value?.data) {
      post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
    }
  })

  return channel
}

  // echo listener for child comment

  function setupEchoListener(postId) {
  if (!echo || !postId) return

  const channelName = `comment.${postId}`
  const channel = echo.private(channelName)

  channel.listen('CommentSent', (event) => {
    console.log('📨 Nhận sự kiện CommentSent:', event)

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
        avatar: event.sender.avatar,
      } : null,
      replies_count: 0,
    }

    // Bỏ qua comment do chính user hiện tại gửi (đã xử lý local)
    if (auth.user?.id === newComment.author?.id) {
      return
    }

    // 1. Comment cha mới
    if (!newComment.parent_id) {
      parentComments.value.unshift(newComment)

      if (post.value?.data) {
        post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
      }
      return
    }

    // 2. Reply cho 1 comment cha (level 1)
    const parent = parentComments.value.find(c => c.id === newComment.parent_id)

    if (parent) {
      // tăng replies_count cho nút "X Trả lời"
      parent.replies_count = (parent.replies_count || 0) + 1

      // nếu đang mở thread này thì ChildComments sẽ remount và fetch lại
      if (show.value.includes(parent.id)) {
        reloadKey.value[parent.id] = (reloadKey.value[parent.id] || 0) + 1
      }

      if (post.value?.data) {
        post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
      }

      return
    }

    // 3. Reply cho reply (deep-level)
    // Với kiến trúc hiện tại (ChildComments tự fetch theo parent_id),
    // ở đây chúng ta chỉ có thể cập nhật tổng số comment,
    // còn UI thread sâu sẽ thấy comment mới sau khi user tương tác lại
    // hoặc khi reload thread (tuỳ anh muốn trigger thêm gì sau này).

    if (post.value?.data) {
      post.value.data.comments_count = (post.value.data.comments_count || 0) + 1
    }
  })

  return channel
}

  // Cleanup Echo listener
  function cleanupEchoListener(postId) {
    if (!echo || !postId) return
    const channelName = `comment.${postId}`
    echo.leave(channelName)
    console.log('🔌 Đã rời kênh:', channelName)
  }

  return {
    // State
    parentComments,
    metaComment,
    objPaginationComment,
    reloadKey,
    commentSubmitting,
    isLoadingComments,
    isLoadingFixComment,
    isLoadingMore,
    content_comment,
    content_reply_comment,
    content_fixed_comment,
    showReply,
    FixIndex,
    show,
    // Functions
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
  }
}

