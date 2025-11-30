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
      <!-- Top Banner Ad -->
      <div class="flex justify-center py-8 bg-white">
        <div class="w-full max-w-[680px] px-4">
          <img
            :src="post.data?.thumbnail_url"
            alt="Banner Ad"
            class="w-full h-auto rounded"
          />
        </div>
      </div>

      <!-- Article Content Container -->
      <div class="w-full mx-auto px-4 pb-16">
        <!-- Category -->
        <router-link class="inline-block text-sm text-text-secondary mb-4">
          {{ post.data?.category?.name  }}
        </router-link>

        <!-- Article Title -->
        <h1 class="text-[42px] leading-[58px] font-bold font-montserrat text-[#2D3748] mb-6">
           {{ post.data?.title  }}
        </h1>
        <UserDiv :user="post.data?.author" :date="post.data?.created_at"  ></UserDiv>
        <!-- Author Info -->
        <!-- Article Body -->
        <article class="prose prose-lg w-full" v-html="post.data?.content_html">
        </article>

        <!-- upvote downvote report bài viết  -->
        <div class=" mt-3 flex justify-between border-b border-border-lighter mb-6">
          <div class="flex items-center gap-4 py-6 ">
          <div class="flex items-center gap-2">
            <!-- nút upvote -->
            <button @click="upvote(post?.data?.id)">
              <svg
                class="w-8 h-8 transition-colors duration-200"
                :class="{
                  'fill-sky-500': post?.data?.user_vote === 1,
                  'fill-gray-400 hover:fill-sky-400': post?.data?.user_vote !== 1
                }"
                viewBox="0 0 18 18"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M8.80974 5.27744L3.18474 14.294H14.4761L8.80974 5.27744ZM8.80974 1.92725L17.6609 16.0725H0L8.80974 1.92725Z" />
              </svg>
            </button>
            <span class="font-semibold text-base">
              {{ post?.data?.vote_score > 0 ? post.data.vote_score : 0 }}
            </span>

          </div>
          <!-- nút downvote -->
          <!-- Downvote -->
          <button @click="downvote(post?.data?.id)">
            <svg
              class="w-8 h-8 transition-colors duration-200"
              :class="{
                'fill-red-500': post?.data?.user_vote === -1,
                'fill-gray-400 hover:fill-red-400': post?.data?.user_vote !== -1
              }"
              viewBox="0 0 18 18"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M9.19027 12.7223L14.8153 3.70574H3.5239L9.19027 12.7223ZM9.19027 16.0725L0.339157 1.92725L18 1.92725L9.19027 16.0725Z" />
            </svg>
          </button>

          <!-- hiển thị số bình luận bài viết -->
          <span class="text-text-muted">·</span>
          <span class="text-base text-text-primary"> {{ post.data?.comments_count }} bình luận</span>
          </div>
<!-- option báo cáo bài viết, tác giả or bài viết -->

            <div class="relative" ref="menuRef">
              <button
                v-if="auth?.user?.id != post?.data?.author?.id "
                @click.stop="showOption = !showOption"
                :aria-expanded="showOption"
                aria-haspopup="menu"
                class="p-1 ml-auto"
                aria-label="More options">
                <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M2 4C0.89543 4 -4.82823e-08 3.10457 0 2C4.82823e-08 0.89543 0.895431 -4.82823e-08 2 0C3.10457 4.82823e-08 4 0.895431 4 2C4 3.10457 3.10457 4 2 4Z"
                    fill="#111827"
                  />
                  <path
                    d="M2 10C0.89543 10 -4.82823e-08 9.10457 0 8C4.82823e-08 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10Z"
                    fill="#111827"
                  />
                  <path
                    d="M2 16C0.89543 16 -4.82823e-08 15.1046 0 14C4.82823e-08 12.8954 0.895431 12 2 12C3.10457 12 4 12.8954 4 14C4 15.1046 3.10457 16 2 16Z"
                    fill="#111827"
                  />
                </svg>
              </button>

              <!-- Sử dụng ReportMenu component -->
              <ReportMenu
                v-if="showOption"
                :items="postMenuItems"
                align="right"
                @close="showOption = false"
              />
            </div>
<!-- end---------------------- -->
        </div>

        <!-- Author Follow Section -->
        <div class="flex items-center gap-4 mb-8">
          <UserDiv :user="post.data?.author" :date="null"  ></UserDiv>
          <div v-if="post?.data?.author?.id != auth?.user?.id ">
            <button
              @click="followHandler"
              v-if="post?.data?.is_following_author == false "
              :disabled="isLoading"
              :aria-busy="isLoading"
              class="relative flex items-center justify-center gap-2 btnEffect px-4 py-2.5 rounded border border-[#E3E3E3] text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none">
                <span v-if="!isLoading">Theo dõi</span>
                <span v-else class="inline-flex items-center" aria-live="polite">
                  <span class="mr-2">Đang theo dõi</span>
                  <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
                </span>
            </button>
            <button
              v-else-if="post?.data?.is_following_author == true"
              @click="followHandler"
              :disabled="isLoading"
              :aria-busy="isLoading"
              class="relative flex items-center justify-center gap-2 btnEffect bg-sky-300 px-4 py-2.5 rounded border border-[#E3E3E3] text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none">
              <span v-if="!isLoading"><i class="fa-solid fa-check pr-1"></i> Đã Theo dõi</span>
              <span v-else class="inline-flex items-center" aria-live="polite">
                <span class="mr-2">Đang xử lý</span>
                <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
              </span>
            </button>
          </div>

        </div>
      </div>

      <!-- Related Articles Section -->
      <SuggestedPost :categoryId="post?.data?.category?.id" :postId="post?.data?.id"></SuggestedPost>

      <!-- Comments Section -->
      <div class="max-w-full mx-auto px-4 mb-16">
        <div class="border border-border-lighter rounded shadow-card p-6">
          <!-- Comment Form -->
          <form
              v-if="user"
              class="border-b border-border-lighter pb-6 mb-6"
              @submit.prevent="sendComment(content_comment, post.data?.id)"
            >
            <div class="relative w-full">
              <input
                type="text"
                v-model="content_comment"
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
                    v-if="auth?.user?.id != comment.author?.id "
                    @click.stop="toggleCommentMenu(comment.id)"
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
                    @click="showReplyForm(comment.id)"
                  >
                    Trả lời
                  </button>

                  <button
                    v-if="user && Number(comment.author?.id) === Number(user?.id)"
                    class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                    @click="fixComment(comment.id, comment.content, comment.parent_id)"
                  >
                    Sửa
                  </button>

                  <button
                    v-if="user && Number(comment.author?.id) === Number(user?.id)"
                    class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                    @click="deleteComment(comment.id, comment.parent_id)"
                  >
                    Xóa
                  </button>
                </div>

                <!-- form reply comment -->
                <form
                  v-if="showReply.includes(comment.id)"
                  class="border-b border-border-lighter pb-6 mb-6"
                  @submit.prevent="sendReplyComment(content_reply_comment, post.data?.id, comment.id)"
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
                      class="text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl "
                    >
                      Gửi
                    </button>
                  </div>
                </form>

                <!-- form fix comment -->
                <form
                  v-if="FixIndex.includes(comment.id)"
                  class="border-b border-border-lighter pb-6 mb-6"
                  @submit.prevent="sendFixedComment(content_fixed_comment, comment.id, comment.parent_id)"
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
                      class="text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl "
                    >
                      Gửi
                    </button>
                  </div>
                </form>
              </div>

              <div class="ml-[68px]">
                <button
                  @click="toggle(comment.id)"
                  v-if="comment.replies_count > 0"
                  class="text-[15px] font-bold text-blue-500"
                >
                  {{
                    show.includes(comment.id)
                      ?  'Ẩn trả lời'
                      : `${comment.replies_count} Trả lời`
                  }}
                </button>
              </div>

              <ChildComments
                v-if="show.includes(comment.id)"
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
              @click="loadMoreComments"
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
    </main>

    <ReportModal
      v-model="showReportPostForm"
      :id="idReport"
      :type="typeOfReport"
    />
  </div>
    </Layout>
</template>

<script setup lang='js'>
import Layout from '../layout/layout.vue'
import { ref, computed, watch, onMounted, onUnmounted, onBeforeUnmount, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'
import api from "../../../../API/axios"
import ReportModal from '../../../components/reportForm.vue'
import ReportMenu from '../../../components/ReportMenu.vue'
import SkeletonLoader from '../../../components/ui/SkeletonLoader.vue'
import SkeletonList from '../../../components/skeleton/SkeletonList.vue'
// cac child component
import ChildComments from '../../../components/childComments.vue'
import SuggestedPost from '../../../components/suggestedPost.vue'
import UserDivComment from '../../../components/userDivComment.vue'
import UserDiv from '../../../components/userDiv.vue'
// loader overlay removed; rely on local skeletons and inline button loading

const showOption = ref(false)
const openMenuCommentId = ref(null)
const commentMenuRefs = ref({})

// module bao cao
const showReportPostForm = ref(false)
const typeOfReport = ref('')
const idReport = ref('')

function reportPost(idPost){
  showReportPostForm.value = true
  typeOfReport.value = 'posts'
  idReport.value = idPost
  showOption.value = false
}

function reportComment(idComment){
  showReportPostForm.value = true
  typeOfReport.value = 'comments'
  idReport.value = idComment
  openMenuCommentId.value = null
}

function reportAuthor(idAuthor){
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

const replies = ref([])
const postSuggested = ref([])
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
const loading = ref(false)
const isLoading = ref(false)
const commentSubmitting = ref(false)
const parentComments = ref([])
const reloadKey = ref({})


const auth = useAuthStore()
const {user} = storeToRefs(auth)
const echo = inject('echo');
// hien form reply
const showReply = ref([])
function showReplyForm(id){
  const indexOfFix = FixIndex.value.indexOf(id)
  if(indexOfFix !== -1 ){
    FixIndex.value.splice(indexOfFix, 1)
  }
  const i = showReply.value.indexOf(id)
  i === -1 ? showReply.value.push(id) : showReply.value.splice(i, 1)
}

// show form de sua comment
const FixIndex = ref([])
const content_fixed_comment = ref("")

function fixComment(id, content, parent_id) {
  content_fixed_comment.value = content
  const i = showReply.value.indexOf(id)
  if (i !== -1) showReply.value.splice(i, 1)

  const indexOfFix = FixIndex.value.indexOf(id)
  indexOfFix === -1 ? FixIndex.value.push(id) : FixIndex.value.splice(indexOfFix, 1)
}

// send comment
const content_comment = ref()
async function sendComment(content, post_id){
  if (!content?.trim()) return;

  try {
    commentSubmitting.value = true
    const res = await api.post(`${apiUrl}/api/comments`, {
      content: content,
      post_id: post_id
    });
    console.log(res.data);

    if (res.status === 201) {
      content_comment.value = '';

      // Nếu backend trả về comment object trong response, unshift vào đầu mảng
      const newComment = res.data?.data ?? res.data;
      if (newComment && newComment.id) {
        parentComments.value.unshift(newComment);
      } else {
        // Fallback: refetch parentComments
        parentComments.value = [];
        objPaginationComment.value.page = 1;
        await getParentComments(Number(route.query.id));
      }

      // Cập nhật comments_count
      if (typeof post.value?.data?.comments_count === 'number') {
        post.value.data.comments_count = (post.value.data.comments_count || 0) + 1;
      }
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) return alert('Bạn cần đăng nhập');
    if (status === 422) {
      const errs = error.response.data?.errors || {};
      const firstErr = Object.values(errs).flat?.()[0] ||
        'Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).';
      return alert(firstErr);
    }
    console.error(error);
    alert('Có lỗi xảy ra, vui lòng thử lại sau.');
  } finally { commentSubmitting.value = false }
}

// reply comment
const content_reply_comment = ref("")

async function sendReplyComment(content, postId, parent_id) {
  if (!content?.trim()) return;

  try {
    const res = await api.post(`${apiUrl}/api/comments`, {
      content: content,
      post_id: postId,
      parent_id: parent_id
    });

    if (res.status === 201) {
      if (!show.value.includes(parent_id)) {
        show.value.push(parent_id);
      }

      const idx = parentComments.value.findIndex(c => c.id === parent_id);
      if (idx !== -1) {
        parentComments.value[idx].replies_count =
          (parentComments.value[idx].replies_count || 0) + 1;
      }

      reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1;

      content_reply_comment.value = '';
      const i = showReply.value.indexOf(parent_id);
      if (i !== -1) showReply.value.splice(i, 1);
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) return alert('Bạn cần đăng nhập');
    if (status === 422) {
      const errs = error.response.data?.errors || {};
      const firstErr = Object.values(errs).flat?.()[0] ||
        'Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).';
      return alert(firstErr);
    }
    console.error(error);
    alert('Có lỗi xảy ra, vui lòng thử lại sau.');
  }
}

// sua comment
async function sendFixedComment(content, id, parent_id){
  if (!content?.trim()) return;

  try {
    const res = await api.patch(`${apiUrl}/api/comments/${id}`, { content });

    if (res.status === 200) {
      const updated = res.data?.data ?? res.data;

      if (parent_id == null) {
        // Sửa comment cha: cập nhật đúng nguồn đang render
        const list = parentComments.value || [];
        const idx = list.findIndex(c => c.id === id);
        if (idx !== -1) {
          // replace để đảm bảo reactivity
          parentComments.value[idx] = { ...list[idx], ...updated };
        } else {
          // fallback: refetch trang đầu cho chắc
          parentComments.value = [];
          objPaginationComment.value.page = 1;
          await getParentComments(Number(route.query.id));
        }
      } else {
        // Sửa reply: ép ChildComments refetch
        reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1;
      }

      content_fixed_comment.value = "";
      const i = FixIndex.value.indexOf(id);
      if (i !== -1) FixIndex.value.splice(i, 1);
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
}

// xoa comment
async function deleteComment(id, parent_id){
  if (!confirm(`Bạn chắc muốn xoá bình luận này?`)) return;

  try {
    const res = await api.delete(`${apiUrl}/api/comments/${id}`)
    console.log(res.status);

    if (res.status === 200 || res.status === 204) {
      if (parent_id == null) {
        // Xóa comment cha trong parentComments
        const i = parentComments.value.findIndex(c => c.id === id);
        if (i !== -1) {
          parentComments.value.splice(i, 1);
        }

        if (typeof post.value?.data?.comments_count === 'number') {
          post.value.data.comments_count = Math.max(0, post.value.data.comments_count - 1);
        }
      } else {
        // Xóa reply: giảm replies_count ở đúng nguồn
        const pIdx = parentComments.value.findIndex(c => c.id === parent_id);
        if (pIdx !== -1) {
          parentComments.value[pIdx].replies_count =
            Math.max(0, (parentComments.value[pIdx].replies_count || 1) - 1);
        }
        reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1;
      }
    }
  } catch (error) {
    const status = error?.response?.status
    if (status === 401) return alert('Bạn cần đăng nhập')
    alert('Xoá bình luận thất bại.')
  }
}

const post = ref({})
const isLoadingPage = computed(() => !(post.value && post.value.data && post.value.data.id))
const show = ref([])

function toggle(id) {
  const index = show.value.indexOf(id)
  if (index === -1) {
    show.value.push(id)
  } else {
    show.value.splice(index, 1)
  }
}

async function fetchReplies(id) {
  if (!id) return
  loading.value = true
  error.value = null
  try {
    const res  = await api.get(`/api/comments/${id}/replies`)
    replies.value = Array.isArray(res.data?.data) ? res.data.data : res.data
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}
// fetch comment cha
let objPaginationComment = ref({
  page: 1,
  limit: 10,
})

// upvote bài viết
async function upvote(postId){
  loading.value = true
  try {
    const res = await api.post(`${apiUrl}/api/posts/${postId}/upvote`)
    if (res.status === 200) {
      const next = Number(res.data?.vote_score ?? optimistic)
      post.value.data.vote_score = next

      if (res.data?.user_vote != null) {
        post.value.data.user_vote = Number(res.data.user_vote)
      }
    }
  } catch (e) {
    post.value.data.vote_score = Math.max(0, Number(post.value?.data?.vote_score ?? 1) - 1)
    post.value.data.user_vote = 0
    console.error(e)
    alert('Bạn cần đăng nhập')
  } finally {
    loading.value = false
  }
}

// downvote bài viết
async function downvote(postId){
  loading.value = true
  try {
    const res = await api.post(`${apiUrl}/api/posts/${postId}/downvote`)
    if (res.status === 200) {
      const next = Number(res.data?.vote_score ?? optimistic)
      post.value.data.vote_score = next

      if (res.data?.user_vote != null) {
        post.value.data.user_vote = Number(res.data.user_vote)
      }
    }
  } catch (e) {
    post.value.data.vote_score = Math.max(0, Number(post.value?.data?.vote_score ?? 1) - 1)
    post.value.data.user_vote = 0
    console.error(e)
    alert('Bạn cần đăng nhập')
  } finally {
    loading.value = false
  }
}

watch(() => route.query.id,
  async (newId) => {
    if(!newId) return
    const res = await api.get(`${apiUrl}/api/posts/${newId}`)
    post.value = res.data
    getParentComments(newId)
  }
)

onMounted(async () => {
  try {
    const postId = Number(route.query.id)
    const res = await api.get(`${apiUrl}/api/posts/${postId}`)
    post.value = res.data

    const res1 = await api.get(`${apiUrl}/api/posts`, {
      params: { limit: 5, sort: 'hot', category: post.value.data.category?.id }
    })
    postSuggested.value = res1.data.data.filter(item => item.id !== post.value.id)

    getParentComments(postId)
  } catch (error) {
    alert("Hệ thống đang bảo trì")
  }

  // Đăng ký click outside listener
  document.addEventListener('click', handleClickOutside)

  console.log('🚀 Kết nối Echo:', echo);
  if (post.value?.data?.id) {
    const channelName = `comment.${post.value.data.id}`; // Kênh public (dùng echo.channel)
    // Nếu là kênh private (cần login mới xem được cmt) thì dùng echo.private
    echo.private(channelName)
      .listen('CommentSent', (event) => {
        console.log('📨 Nhận sự kiện CommentSent:', event);

        // 1. Chuẩn hóa dữ liệu
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
        };
        if(auth.user?.id === newComment.author.id){
          // Bỏ qua nếu comment do chính user hiện tại gửi
          return;
        }
        // 2. Xử lý hiển thị comment mới
        if (!newComment.parent_id) {
          // TRƯỜNG HỢP 1: COMMENT CHA MỚI
          // Thêm vào đầu danh sách
          parentComments.value.unshift(newComment);

          // Tăng tổng số comment của bài viết
          if (post.value?.data) {
            post.value.data.comments_count = (post.value.data.comments_count || 0) + 1;
          }

        } else {
          // TRƯỜNG HỢP 2: COMMENT CON (REPLY)
          // Tìm comment cha của nó
          const parent = parentComments.value.find(c => c.id === newComment.parent_id);

          if (parent) {
            // Tăng số lượng reply hiển thị ở nút "Xem trả lời"
            parent.replies_count = (parent.replies_count || 0) + 1;

            // Nếu danh sách con đang mở, kích hoạt reloadKey để ChildComponent tự fetch lại
            if (show.value.includes(parent.id)) {
              reloadKey.value[parent.id] = (reloadKey.value[parent.id] || 0) + 1;
            }

            // Tăng tổng số comment của bài viết
            if (post.value?.data) {
              post.value.data.comments_count = (post.value.data.comments_count || 0) + 1;
            }
          }
        }
      });
    }
  })
async function followHandler(){
  try {
    isLoading.value = true
    const res = await api.post(`/api/users/${post.value?.data?.author?.id}/follow`)

    if (post.value?.data) {
      post.value.data = { ...post.value.data, is_following_author: res.data.is_following }
    }
  } catch (error) {
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

// xu ly su kien click outside
const menuRef = ref(null)

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

const metaComment = ref(null)
const isLoadingMore = ref(false)
const isLoadingComments = ref(false)

async function getParentComments(postId) {
  console.log('goi ham get comment');

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

async function loadMoreComments() {

  if (isLoadingMore.value) return
  if (metaComment.value && metaComment.value.current_page >= metaComment.value.last_page) return

  isLoadingMore.value = true
  objPaginationComment.value.page++
  const postId = Number(route.query.id)
  await getParentComments(postId)
  isLoadingMore.value = false
}


onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  const echo = inject('echo');
  if (echo && post.value?.data?.id) {
    const channelName = `comment.${post.value.data.id}`;
    echo.leave(channelName);
    console.log('🔌 Đã rời kênh:', channelName);
  }
});
</script>
