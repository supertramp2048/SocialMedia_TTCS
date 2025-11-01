<template>
    <!-- Sample Comment -->
          <div v-for="comment in replies.data" :key=comment.id class="flex gap-3 mb-6">
            <img 
              :src="comment?.author.avartar" 
              alt="Commenter" 
              class="w-12 h-12 rounded-full border border-border-light"
            />
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <a href="#" class="font-bold text-sm text-text-primary">{{comment?.author?.name}}</a>
                <span class="text-[13px] text-text-secondary text-opacity-75">{{ new Date(comment?.updated_at || created_at).toLocaleDateString('vi-VN') }}</span>
              </div>
              <p class="text-sm text-text-primary leading-relaxed mb-4">
                {{comment?.content}}
              </p>
              <div class="flex items-center gap-3 text-text-secondary text-opacity-75">
                <button class="text-[13px] font-bold p-[5px] rounded-2xl hover:bg-sky-300">Trả lời</button>
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
              <ChildComments v-if="show.includes(comment?.id)" :parent_id="comment?.id" ></ChildComments>
            </div>
          </div>
          <!-- end saple comment -->
</template>

<script setup lang="js">
import { ref, watch } from "vue"
import api from "../../API/axios"

const props = defineProps({
  parent_id: { type: [Number, String], required: true }
})

const apiUrl = import.meta.env.VITE_API_BASE
const replies = ref([])
const loading = ref(false)
const error = ref(null)

// bien hien cac replies con
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
  if (id == null || id === "") return
  loading.value = true
  error.value = null
  try {
    const res  = await api.get(`${apiUrl}/api/comments/${id}/replies`)
    replies.value = res.data
    console.log("replies    ",replies.value);
    
  } catch (e) {
    error.value = e
  } finally {
    loading.value = false
  }
}

// gọi ngay và tự động khi parent_id thay đổi
watch(() => props.parent_id, fetchReplies, { immediate: true })
</script>

<script lang='js'>
export default {
  name: "ChildComments" //  bắt buộc để Vue nhận biết component đệ quy
}
</script>
