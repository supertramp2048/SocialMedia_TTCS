<template>
    <Layout>
        <div class="min-h-screen bg-white">
    <!-- Main Content -->
    <main class="w-full">
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
      <div class="max-w-[700px] mx-auto px-4 pb-16">
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
        <article class="prose prose-lg max-w-none" v-html="post.data?.content_html">
        </article>
        <!-- Tags -->
        <div class="flex gap-3 mt-8 mb-6">
          <a href="#" class="px-2.5 py-2 rounded bg-black bg-opacity-5 text-xs uppercase text-text-primary">
            Góc_nhìn_thời_sự
          </a>
          <a href="#" class="px-2.5 py-2 rounded bg-black bg-opacity-5 text-xs uppercase text-text-primary">
            Thinking_Out_Loud
          </a>
        </div>

        <!-- Newsletter Signup -->
        <div class="w-full h-[200px] bg-[#002E75] rounded mb-8 flex items-center justify-center p-4">
          <div class="max-w-[400px] w-full">
            <input 
              type="email" 
              placeholder="Your Email" 
              class="w-full px-4 py-2.5 rounded border border-[#EAE9E9] mb-5 text-sm"
            />
            <button class="w-full px-4 py-3 rounded bg-[#078CC0] text-white text-sm font-normal">
              ĐĂNG KÝ!
            </button>
          </div>
        </div>

        <!-- upvote downvote bài viết  -->
        <div class="flex items-center gap-4 py-6 border-b border-border-lighter mb-6">
          
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

        <!-- Author Follow Section -->
        <div class="flex items-center gap-4 mb-8">
          <UserDiv :user="post.data?.author" :date="null"  ></UserDiv>
          <button class="btnEffect px-4 py-2.5 rounded border border-[#E3E3E3] text-sm text-text-primary">
            Follow
          </button>
        </div>
      </div>

      <!-- Related Articles Section -->
      <SuggestedPost :categoryId="post?.data?.category?.id" :postId="post?.data?.id"></SuggestedPost>
      <!-- Trang chi tiết bài viết -->

      <!-- end Related Articles Section -->

      <!-- Comments Section -->
      <div class="max-w-[768px] mx-auto px-4 mb-16">
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
              <!-- baseline mờ (tuỳ chọn) -->
              <span class="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gray-200"></span>
              <!-- gạch chạy từ trái qua phải khi focus -->
              <span
                class="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-black
                      transition-[width] duration-300 ease-out peer-focus:w-full">
              </span>
            </div>
            <!-- button dang binh luan -->
            <div class="flex justify-end mt-4">
              <button 
              type="submit"
              class="text-sm text-text-primary px-2 py-1 font-bold hover:bg-sky-200 rounded-2xl "
              >
              Gửi
              </button>
            </div>
          </form>

          <div v-else class="border-b border-border-lighter pb-6 mb-6">
            <p class="text-xl font-bold">Hãy đăng nhập để bình luận</p>
          </div>
          <!-- Sample Comment -->
          <div v-for="comment in post.data?.comments" :key=comment.id class="flex gap-3 mb-6">
            <img 
              :src="comment?.author?.avatar" 
              alt="Commenter" 
              class="w-12 h-12 rounded-full border border-border-light"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <a href="#" class="font-bold text-sm text-text-primary">{{comment?.author?.name}}</a>
                <span class="text-[13px] text-text-secondary text-opacity-75">{{ new Date(comment?.updated_at || comment?.created_at).toLocaleDateString('vi-VN') }}</span>
              </div>
              <p class="text-sm text-text-primary leading-relaxed mb-4">
                {{comment?.content}}
              </p>

              <div class="items-center gap-3 text-text-secondary text-opacity-75">
            <div class="flex">
              <!-- viet binh luan -->
              <button
              v-if="user"
              class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
              @click="showReplyForm(comment?.id)"
            >
              Trả lời
            </button>
              <!-- sua binh luan -->
              <!-- Sửa -->
              <button
                v-if="user && Number(comment?.author?.id) === Number(user.id)"
                class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                @click="fixComment(comment?.id, comment?.content, comment?.parent_id)"
              >
                Sửa
              </button>
              <!-- Xoá -->
              <button
                v-if="user && Number(comment?.author?.id) === Number(user.id)"
                class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
                @click="deleteComment(comment?.id, comment?.parent_id)"
              >
                Xóa
              </button>

            </div>
            <!-- form reply comment -->
            <form
              v-if="showReply.includes(comment?.id)"
              class="border-b border-border-lighter pb-6 mb-6"
              @submit.prevent="sendReplyComment(content_reply_comment, post.data?.id, comment?.id)"
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
            <!-- end form reply comment -->
            <!-- form fix comment form -->
            <form
              v-if="FixIndex.includes(comment?.id)"
              class="border-b border-border-lighter pb-6 mb-6"
              @submit.prevent="sendFixedComment(content_fixed_comment, comment?.id, comment?.parent_id)"
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
            <!-- end fix comment form -->
          </div>
                  <div>
                    <button 
                    @click="toggle(comment?.id)" 
                    v-if="comment?.replies_count > 0" 
                    class="text-[15px] font-bold text-blue-500" >
                      {{
                        show.includes(comment?.id)
                          ?  'Ẩn trả lời' 
                          : `${comment?.replies_count} Trả lời`
                        }}
                      </button>
                  </div>
                  <ChildComments
                    v-if="show.includes(comment?.id)"
                    :parent_id="comment?.id"
                    :post="post.data"
                    :key="reloadKey[comment.id] || 0"
                  />

                </div>
              </div>
              <!-- end saple comment -->
        </div>
      </div>
    </main>
  </div>
    </Layout>
</template>
<script setup lang='js'>
import Layout from '../layout/layout.vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia'
import api from "../../../../API/axios"
// cac child component
import ChildComments from '../../../components/childComments.vue'
import SuggestedPost from '../../../components/suggestedPost.vue'
import UserDiv from '../../../components/userDiv.vue'
// loader cho trang
import { globalLoading } from '../../../../API/axios'
import loader from '../../../components/loader.vue'
const replies = ref([])    
const postSuggested = ref([])    
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
const loading = ref(false)
// dưới các const khác
const reloadKey = ref({}) // { [commentId]: number }

const auth = useAuthStore()
const {user} = storeToRefs(auth)
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
// show form de sua xomment
const FixIndex = ref([])

const content_fixed_comment = ref("")
function fixComment(id, content, parent_id) {
  content_fixed_comment.value = content
  // đóng form reply nếu đang mở
  const i = showReply.value.indexOf(id)
  if (i !== -1) showReply.value.splice(i, 1)

  const indexOfFix = FixIndex.value.indexOf(id)
  indexOfFix === -1 ? FixIndex.value.push(id) : FixIndex.value.splice(indexOfFix, 1)
}


//
// send comment
const content_comment = ref()
async function sendComment(content, post_id){
      if (!content?.trim()) return;

  try {
    const res = await api.post(`${apiUrl}/api/comments`, {
      content: content,
      post_id: post_id
    });

    if (res.status === 201) {
      // reset form comment
      content_comment.value = '';
      const postId = Number(route.query.id)
      const res = await api.get(`${apiUrl}/api/posts/${postId}`)
      post.value = res.data
      console.log(post.value);
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
// reply comment
const content_reply_comment = ref("")

// Gửi reply comment
async function sendReplyComment(content, postId, parent_id) {
  if (!content?.trim()) return;

  try {
    const res = await api.post(`${apiUrl}/api/comments`, {
      content: content,
      post_id: postId,
      parent_id: parent_id
    });

    if (res.status === 201) {
      // mở thread con nếu đang đóng
      if (!show.value.includes(parent_id)) {
        show.value.push(parent_id);
      }

      // tăng tạm replies_count tại chỗ (trên mảng post.data?.comments)
      const idx = post.value?.data?.comments?.findIndex(c => c.id === parent_id);
      if (idx !== -1) {
        post.value.data.comments[idx].replies_count =
          (post.value.data.comments[idx].replies_count || 0) + 1;
      }

      // ép remount ChildComments của parent_id để tự fetch lại danh sách con
      reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1;

      // reset & đóng form reply
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
        // ✅ Bình luận cấp 1: cập nhật ngay trong post.data.comments
        const list = post.value?.data?.comments || []
        const idx = list.findIndex(c => c.id === id)
        if (idx !== -1) {
          list[idx] = { ...list[idx], ...updated }
        } else {
          // fallback: refetch toàn bài viết
          const r = await api.get(`${apiUrl}/api/posts/${postId.value}`)
          post.value = r.data
        }
      } else {
        // ✅ Bình luận cấp n>1: giao cho thread con
        // tăng key để remount ChildComments(parent_id) => tự fetch lại replies con
        reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1
      }

      content_fixed_comment.value = ""
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
}


// xoa comment

async function deleteComment(id, parent_id){
  if (!confirm('Bạn chắc muốn xoá bình luận này?')) return;

  try {
    const res = await api.delete(`${apiUrl}/api/comments/${id}`)
    if (res.status === 200 || res.status === 204) {
      if (parent_id == null) {
        // ✅ Xoá bình luận cấp 1 trong post.data.comments
        const list = post.value?.data?.comments || []
        const i = list.findIndex(c => c.id === id)
        if (i !== -1) list.splice(i, 1)
        // đồng bộ tổng số comment nếu bạn có field này
        if (typeof post.value?.data?.comments_count === 'number') {
          post.value.data.comments_count = Math.max(0, post.value.data.comments_count - 1)
        }
      } else {
        // ✅ Xoá bình luận cấp n>1
        // Giảm replies_count của cha ngay tại chỗ
        const parentIdx = post.value?.data?.comments?.findIndex(c => c.id === parent_id)
        if (parentIdx !== -1) {
          post.value.data.comments[parentIdx].replies_count =
            Math.max(0, (post.value.data.comments[parentIdx].replies_count || 1) - 1)
        }
        // Ép remount ChildComments(parent_id) để nó tự fetch lại danh sách con
        reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1
      }
    }
  } catch (error) {
    const status = error?.response?.status
    if (status === 401) return alert('Bạn cần đăng nhập')
    alert('Xoá bình luận thất bại.')
  }
}


const post = ref({})
// bien de show cac replies comment 
const show = ref([])

function toggle(id) {
  const index = show.value.indexOf(id)

  if (index === -1) {
    // Nếu chưa có id -> thêm vào
    show.value.push(id)
  } else {
    // Nếu đã có id -> xóa khỏi mảng (đóng comment đó)
    show.value.splice(index, 1)
  }
}
async function fetchReplies(id) {
  if (!id) return
  loading.value = true
  error.value = null
  try {
    const res  = await api.get(`${apiUrl}/api/comments/${id}/replies`)
    
    // Giả sử API trả { data: [...] }, đổi thành mảng:
    replies.value = Array.isArray(res.data?.data) ? res.data.data : res.data

    console.log("user ",user);
    console.log("all rep ",replies.value);
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

// upvote bài viết-----------------

async function upvote(postId){
  loading.value = true
  try {
    const res = await api.post(`${apiUrl}/api/posts/${postId}/upvote`)
    // Đồng bộ lại theo server (nếu có)
    if (res.status === 200) {
      const next = Number(res.data?.vote_score ?? optimistic)
      post.value.data.vote_score = next
      
      if (res.data?.user_vote != null) {
        post.value.data.user_vote = Number(res.data.user_vote)
      }
    }
  } catch (e) {
    // Revert nếu lỗi
    post.value.data.vote_score = Math.max(0, Number(post.value?.data?.vote_score ?? 1) - 1)
    post.value.data.user_vote = 0
    console.error(e)
    alert('Bạn cần đăng nhập')
  } finally {
    loading.value = false
  }
}


// end upvote-----------------------
// downvote bài viết ---------------
async function downvote(postId){
  loading.value = true
  try {

    const res = await api.post(`${apiUrl}/api/posts/${postId}/downvote`)
    // Đồng bộ lại theo server (nếu có)
    if (res.status === 200) {
      const next = Number(res.data?.vote_score ?? optimistic)
      post.value.data.vote_score = next
      
      if (res.data?.user_vote != null) {
        post.value.data.user_vote = Number(res.data.user_vote)
      }
    }
  } catch (e) {
    // Revert nếu lỗi
    post.value.data.vote_score = Math.max(0, Number(post.value?.data?.vote_score ?? 1) - 1)
    post.value.data.user_vote = 0
    console.error(e)
    alert('Bạn cần đăng nhập')
  } finally {
    loading.value = false
  }
}


// end downvote bài viết

watch(() => route.query.id, 
  async (newId) => {
    if(!newId) return
      const res = await api.get(`${apiUrl}/api/posts/${newId}`)
      post.value = res.data
  }
)

onMounted( async ()=>{
  try {
      const postId = Number(route.query.id)
      const res = await api.get(`${apiUrl}/api/posts/${postId}`)
      post.value = res.data
      console.log("post here ",post.value, "id ",post.value.data.category?.id);
      
      const res1 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 5, sort: 'hot', category: post.value.data.category?.id } })
      postSuggested.value = res1.data.data.filter(item => item.id !== post.value.id)
      console.log("suggested post ",postSuggested.value);
  } catch (error) {
    alert("Hệ thống đang bảo trì")
  }
    
    
})
</script>