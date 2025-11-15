<template>
  <!-- Chat Column -->
  <div class="col-span-1 md:col-span-7">
    <!-- PHẦN CHAT -->
    <div class="mt-4 flex flex-col">
      <!-- Khung chat: full width cột, cao theo viewport -->
      <div
        class="chat-container"
        ref="chatContainer"
        @scroll="handleScroll"
      >
        <!-- Header nhỏ trong khung chat -->
        <div class="headerChat">
          <div class="text-lg font-bold text-black">PhDhuy</div>
        </div>

        <!-- Danh sách tin nhắn -->
        <div class="p-[16px]">
          <!-- John -->
          <div 
            v-for="item in props.chats" 
            :key="`${item.id}-${item.created_at}`"
            :class="auth.user.id != item.sender_id ? 'message other' : 'message user'"
          >
            <img
              class="avatar"
              :src="auth.user.id != item.sender_id ? props.others?.data?.avatar : auth.user.avatar"
              alt="Avatar"
            />
            <div class="bubble">
              <div class="name">
                <span v-if="auth.user.id != item.sender_id">{{ props.others?.data?.name }}</span>
                <span v-else>{{ auth.user.name }}</span>
              </div>
              <div>{{ item.content }}</div>
              <div class="time">{{ formatDate(item.created_at) }}</div>
            </div>
          </div>            
        </div>
      </div>
      <!-- Ô nhập tin nhắn: sticky bottom, full width cột -->
      <div
        class="chat-input-container relative"
        style="width: 100%; max-width: 100%;"
      >
        <div class="chat-input-box">
          <form @submit.prevent="sendMessage">
            <input
              v-model="contentMessage" 
              type="text" 
              placeholder="Nhập tin nhắn..." 
            />
            <button class="btnEffect" type="submit" :disabled="!contentMessage.trim()">
              ➤
            </button>
          </form>
        </div>
        <button
          v-if="showScrollBtn"
          @click="scrollToBottom"
          class="scroll-bottom-btn"
        >
          <i class="fa-solid fa-angles-down"></i>
        </button>     
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useAuthStore } from "../../../stores/auth"
import { useRoute } from 'vue-router'
import api from '../../../../API/axios'
import { useToast } from 'vue-toastification'

const auth = useAuthStore()
const route = useRoute()
const toast = useToast()
const loading = ref(false)
const otherId = ref(route.query.id)
const contentMessage = ref('')

// Cuộn xuống dưới khi có tin nhắn mới
const chatContainer = ref(null)
const showScrollBtn = ref(false)

const handleScroll = () => {
  const el = chatContainer.value
  if (!el) return

  const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50
  showScrollBtn.value = !atBottom
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = chatContainer.value
    if (!el) return
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth'
    })
  })
}

const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('vi-VN')
}

const props = defineProps({
  chats: { type: Array, required: true },
  others: { type: Object, required: true }
})

const emit = defineEmits(['newMessage'])

async function sendMessage() {
  if (!contentMessage.value.trim()) return
  
  try {
    loading.value = true
    const res = await api.post('/realtime/sendmessage', {
      receiver_id: otherId.value,
      content: contentMessage.value,
      image_url: null
    })
    
    if (res.status !== 200) {
      toast.error('Đã có lỗi xảy ra khi gửi tin nhắn')
    } else {
      emit('newMessage', res.data)
      contentMessage.value = ''
      // Scroll sau khi emit (component cha sẽ update chats)
      scrollToBottom()
    }
  } catch (error) {
    toast.error('Không thể gửi tin nhắn')
    console.error(error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  scrollToBottom()
})

watch(() => route.query.id, (newVal) => {
  otherId.value = newVal
})

// FIX: Dùng nextTick để đợi DOM render xong
watch(
  () => props.chats?.length,
  () => {
    scrollToBottom()
  }
)
</script>