<template>
  <!-- Sample Comment -->
  <div v-for="comment in replies" :key="comment.id" class="flex gap-3 mb-6">
    <img
      :src="comment?.author?.avatar"
      alt="Commenter"
      class="w-12 h-12 rounded-full border border-border-light"
    />
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <a href="#" class="font-bold text-sm text-text-primary">
          {{ comment?.author?.name }}
        </a>
        <span class="text-[13px] text-text-secondary text-opacity-75">
          {{ new Date(comment?.updated_at || comment?.created_at).toLocaleDateString('vi-VN') }}
        </span>
      </div>

      <p class="text-sm text-text-primary leading-relaxed mb-4">
        {{ comment?.content }}
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
          <button
          v-if="user && comment?.author?.id == user.id "
          class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
          @click="fixComment(comment?.id,comment?.content)"
        >
          Sửa
        </button>
          <!-- xoa binh luan  -->
          <button
          v-if="user && comment?.author?.id == user.id "
          class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300"
          @click="deleteComment(comment?.id)"
        >
          Xóa
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
          v-if="comment?.replies_count > 0"
          @click="toggle(comment?.id)"
          class="text-[15px] font-bold text-blue-500"
        >
          {{ show.includes(comment?.id) ? 'Ẩn trả lời' : `${comment?.replies_count} Trả lời` }}
        </button>
      </div>

      <ChildComments
        v-if="show.includes(comment?.id)"
        :parent_id="comment?.id"
        :post="props.post"
      />
    </div>
  </div>
  <!-- end sample comment -->
</template>
<script setup lang="js">
import { ref, watch,onMounted  } from "vue"
import api from "../../API/axios"
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia' 
const props = defineProps({
  parent_id: { type: [Number, String], required: true },
  post: { type: Object, required: true }
})

const auth = useAuthStore()
const {user} = storeToRefs(auth)



const apiUrl = import.meta.env.VITE_API_BASE
const replies = ref([])           // ← dùng mảng trực tiếp trong template
const loading = ref(false)
const error = ref(null)
// show form de dien comment
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
function fixComment(id,content){
  content_fixed_comment.value = content
  const i = showReply.value.indexOf(id)
  if(i !== -1 ){
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
// gui comment
// Khai báo biến reloadKey ở đầu script
const reloadKey = ref({}) // Dùng để ép ChildComments render lại

// Gửi reply comment
async function sendReplyComment(content, postId, parent_id) {
  if (!content?.trim()) return;

  try {
    const res = await api.post(`${apiUrl}/api/comments`, {
      content,
      post_id: postId,
      parent_id
    });

    if (res.status === 201) {
      // ✅ 1. Refetch lại danh sách replies của component hiện tại
      await fetchReplies(props.parent_id);

      // ✅ 2. Nếu thread con chưa mở -> tự động mở ra để người dùng thấy ngay reply mới
      if (!show.value.includes(parent_id)) {
        show.value.push(parent_id);
      }

      // ✅ 3. Cập nhật tăng replies_count tạm thời (hiển thị ngay)
      const idx = replies.value.findIndex(c => c.id === parent_id);
      if (idx !== -1) {
        replies.value[idx].replies_count = (replies.value[idx].replies_count || 0) + 1;
      }

      // ✅ 4. Ép remount lại ChildComments của comment vừa được reply
      reloadKey.value[parent_id] = (reloadKey.value[parent_id] || 0) + 1;

      // ✅ 5. Xoá nội dung input và đóng form reply
      content_reply_comment.value = "";
      const i = showReply.value.indexOf(parent_id);
      if (i !== -1) showReply.value.splice(i, 1);
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) {
      alert("Bạn cần đăng nhập");
      return;
    }
    if (status === 422) {
      const errs = error.response.data?.errors || {};
      const firstErr =
        Object.values(errs).flat?.()[0] ||
        "Dữ liệu không hợp lệ (thiếu content / post_id / parent_id).";
      alert(firstErr);
      return;
    }
    console.error(error);
    alert("Có lỗi xảy ra, vui lòng thử lại sau.");
  }
}

// sua comment

async function sendFixedComment(content, id, parent_id){
  if (!content?.trim()) return;

  try {
    const res = await api.patch(`${apiUrl}/api/comments/${id}`, { content });

    if (res.status === 200) {
      // Cập nhật tại chỗ nếu server trả dữ liệu comment đã cập nhật
      const updated = res.data?.data ?? res.data;
      const idx = replies.value.findIndex(c => c.id === id);
      if (idx !== -1 && updated) {
        replies.value[idx] = { ...replies.value[idx], ...updated };
      } else {
        // fallback: refetch danh sách replies của cha hiện tại
        await fetchReplies(parent_id || props.parent_id);
      }

      content_fixed_comment.value = "";
      const i = FixIndex.value.indexOf(id);
      if (i !== -1) FixIndex.value.splice(i, 1);
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) return alert('Bạn cần đăng nhập');
    if (status === 422) {
      const errs = error.response.data?.errors || {};
      const firstErr = Object.values(errs).flat?.()[0] || 'Dữ liệu không hợp lệ.';
      return alert(firstErr);
    }
    console.error(error);
    alert('Có lỗi xảy ra, vui lòng thử lại sau.');
  }
}


// xoa comment

async function deleteComment(id){
  if (!confirm('Bạn chắc muốn xoá bình luận này?')) return;
  try {
    const res = await api.delete(`${apiUrl}/api/comments/${id}`);
    if (res.status === 200 || res.status === 204) {
      // Cập nhật UI ngay
      const i = replies.value.findIndex(c => c.id === id);
      if (i !== -1) replies.value.splice(i, 1);
      // hoặc refetch theo cha hiện tại:
      // await fetchReplies(props.parent_id)
    }
  } catch (error) {
    const status = error?.response?.status;
    if (status === 401) return alert('Bạn cần đăng nhập');
    alert('Xoá bình luận thất bại.');
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

// gọi ngay và tự động khi parent_id thay đổi
watch(() => props.parent_id, fetchReplies, { immediate: true })
</script>
