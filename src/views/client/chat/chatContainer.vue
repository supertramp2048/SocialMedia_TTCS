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
          <div class="text-lg font-bold text-black">{{props.others?.data?.name}}</div>
        </div>

        <!-- Danh sách tin nhắn -->
        <div class="p-[16px]">
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
              
              <!-- Nội dung text -->
              <div v-if="item.content">{{ item.content }}</div>
              
              <!-- Block hiển thị ảnh -->

              <!-- Block hiển thị ảnh -->
              <div v-if="item.image_url && item.image_url.length > 0" class="mt-2">
                <!-- 1 ảnh duy nhất -->
                <div v-if="item.image_url.length === 1" class="rounded-xl overflow-hidden cursor-pointer">
                  <img 
                    :src="item.image_url[0]" 
                    class="w-full max-h-[280px] object-cover"
                    alt="Image"
                    @click="openViewer(item.image_url[0])"
                  />
                </div>

                <!-- 2 ảnh -->
                <div v-else-if="item.image_url.length === 2" class="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                  <img 
                    v-for="(url, idx) in item.image_url" 
                    :key="idx"
                    :src="url" 
                    class="w-full h-[160px] object-cover cursor-pointer"
                    alt="Image"
                    @click="openViewer(url)"
                  />
                </div>

                <!-- 3 ảnh -->
                <div v-else-if="item.image_url.length === 3" class="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                  <img 
                    :src="item.image_url[0]" 
                    class="w-full h-[120px] object-cover cursor-pointer"
                    alt="Image"
                    @click="openViewer(item.image_url[0])"
                  />
                  <img 
                    :src="item.image_url[1]" 
                    class="w-full h-[120px] object-cover cursor-pointer"
                    alt="Image"
                    @click="openViewer(item.image_url[1])"
                  />
                  <img 
                    :src="item.image_url[2]" 
                    class="col-span-2 w-full h-[140px] object-cover cursor-pointer"
                    alt="Image"
                    @click="openViewer(item.image_url[2])"
                  />
                </div>

                <!-- 4+ ảnh (hiển thị tối đa 4, ảnh thứ 4 có overlay +N) -->
                <div v-else class="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                  <img 
                    v-for="(url, idx) in getLimitedImages(item.image_url).slice(0, 3)" 
                    :key="idx"
                    :src="url" 
                    class="w-full h-[120px] object-cover cursor-pointer"
                    alt="Image"
                    @click="openViewer(url)"
                  />
                  <!-- Ảnh thứ 4 với overlay - Click để mở gallery -->
                  <div class="relative w-full h-[120px] cursor-pointer" @click="openGallery(item.image_url, 3)">
                    <img 
                      :src="getLimitedImages(item.image_url)[3]" 
                      class="w-full h-full object-cover"
                      alt="Image"
                    />
                    <div 
                      v-if="item.image_url.length > 4"
                      class="absolute inset-0 bg-black bg-opacity-60 flex flex-col items-center justify-center hover:bg-opacity-70 transition-all"
                    >
                      <span class="text-white text-2xl font-semibold mb-1">
                        +{{ item.image_url.length - 4 }}
                      </span>
                      <span class="text-white text-xs opacity-90">
                        Xem tất cả
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="time">{{ formatDate(item.created_at) }}</div>
            </div>
          </div>            
        </div>
      </div>
      
      <!-- Ô nhập tin nhắn: sticky bottom, full width cột -->
      <div
          class="chat-input-container w-full max-w-full sticky bottom-0 "
        >
          <div class="flex items-center gap-2 w-full px-3">
            <!-- Emoji + Picker -->
            <div ref="emojiWrapper" class="relative">
              <button
                type="button"
                class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow text-xl"
                @click="isShowEmojiPicker = !isShowEmojiPicker"
              >
                <i class="fa-regular fa-face-laugh-squint"></i>
              </button>

              <div
                v-if="isShowEmojiPicker"
                class="absolute bottom-12 left-0 z-50"
              >
                <Picker 
                  :data="emojiIndex"
                  set="twitter"
                  :perLine="8"           
                  :emojiSize="24"
                  :showSearch="false"
                  :showPreview="false"
                  title="Chọn biểu tượng cảm xúc"
                  emoji="point_up"
                  class="w-[320px] h-[360px]"
                  @select="insertEmoji"
                />
              </div>
            </div>

            <!-- Nút ảnh -->
            <button
              type="button"
              class="w-10 h-10 flex items-center justify-center rounded-full bg-white shadow text-lg"
              @click="handleClickImgBtn"
              :class="{ 'bg-blue-100': isShowingImgInput }"
            >
              <i class="fa-solid fa-image"></i>
            </button>

            <!-- Ô input + nút gửi -->
            <div class="chat-input-box flex-1">
              <form @submit.prevent="sendMessage">
                <input
                  v-model="contentMessage" 
                  type="text" 
                  placeholder="Nhập tin nhắn..." 
                  :disabled="loading"
                />
                <button class="btnEffect flex justify-center items-center" type="submit" :disabled="loading || (!contentMessage.trim() && files.length === 0)">
                  <MoonLoader v-if="loading" color="#0ea5e9" size="14px" />
                  <i v-else class="fa-solid fa-paper-plane"></i> 
                </button>
              </form>
            </div>
          </div>

          <button
            v-if="showScrollBtn"
            @click="scrollToBottom"
            class="scroll-bottom-btn"
          >
            <i class="fa-solid fa-angles-down"></i>
          </button>     
        </div>

        <FilePond
          v-if="isShowingImgInput"
          class="overflow-scroll max-h-[400px]"
          ref="pond"
          name="files"
          allow-multiple
          accepted-file-types="image/*"
          :files="files"
          @updatefiles="handleFilePondUpdate"
          label-idle="Kéo ảnh vào đây hoặc <span class='filepond--label-action'>Chọn ảnh</span>"
        />

    </div>
  </div>
  <FullImageViewer
    :src="currentImage"
    :images="galleryImages"
    :startIndex="galleryStartIndex"
    :visible="showViewer"
    @close="showViewer = false"
  />
</template>

<script setup>
import { ref, onMounted, watch, nextTick, onBeforeUnmount, computed } from 'vue'
import { useAuthStore } from "../../../stores/auth"
import { useRoute } from 'vue-router'
import api from '../../../../API/axios'
import { useToast } from 'vue-toastification'
import { MoonLoader } from "vue3-spinner"
import vueFilePond from 'vue-filepond'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js'

import 'filepond/dist/filepond.min.css'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css'

import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src"
import data from "emoji-mart-vue-fast/data/all.json"
import FullImageViewer from './imageView.vue'
import "emoji-mart-vue-fast/css/emoji-mart.css"
const showViewer = ref(false)
const currentImage = ref("")
const galleryImages = ref([])
const galleryStartIndex = ref(0)

// Mở viewer cho 1 ảnh đơn (giữ nguyên behavior cũ)
const openViewer = (src) => {
  currentImage.value = src
  galleryImages.value = [] // Clear gallery mode
  showViewer.value = true
}

// Mở viewer cho gallery (tất cả ảnh)
const openGallery = (images, startIndex = 0) => {
  galleryImages.value = images
  galleryStartIndex.value = startIndex
  currentImage.value = "" // Clear single image mode
  showViewer.value = true
}

const emojiIndex = new EmojiIndex(data)
const isShowEmojiPicker = ref(false)

function insertEmoji(emoji) {
  contentMessage.value += emoji.native
}

const isShowingImgInput = ref(false)
const FilePond = vueFilePond.default
  ? vueFilePond.default(FilePondPluginImagePreview)
  : vueFilePond(FilePondPluginImagePreview)

const files = ref([])
const pond = ref(null)

// Helper function: giới hạn tối đa 4 ảnh để hiển thị
function getLimitedImages(imageUrls) {
  if (!imageUrls || !Array.isArray(imageUrls)) return []
  return imageUrls.slice(0, 4)
}

// Handler để cập nhật files từ FilePond
function handleFilePondUpdate(fileItems) {
  files.value = fileItems
  console.log('📸 Files updated:', fileItems.length, 'ảnh')
}

function handleClickImgBtn(){
  isShowingImgInput.value = !isShowingImgInput.value
  if(!isShowingImgInput.value){
    files.value = []
    if (pond.value) {
      pond.value.removeFiles()
    }
  }
}

const auth = useAuthStore()
const route = useRoute()
const toast = useToast()
const loading = ref(false)
const otherId = ref(route.query.id)
const contentMessage = ref('')

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
  chats: { type: Array, default: () => [] },
  others: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['newMessage'])

async function uploadImg(){
  const urls = []
  
  console.log('🚀 Bắt đầu upload', files.value.length, 'ảnh')
  
  try {
    for(const item of files.value){
      const actualFile = item.file
      
      if (!actualFile) {
        console.warn('⚠️ Không tìm thấy file object trong item:', item)
        continue
      }
      
      console.log('📤 Đang upload:', actualFile.name, '|', (actualFile.size / 1024).toFixed(2), 'KB')
      
      const formData = new FormData()
      formData.append('file', actualFile)
      
      const res = await api.post('/api/image-upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }      
      })
      
      console.log('📥 Upload response:', res.data)
      
      if(res.status === 200 && res.data.location) {
        urls.push(res.data.location)
        console.log('✅ Upload thành công:', res.data.location)
      } else {
        console.error('❌ Upload thất bại với status:', res.status)
        toast.error(`Không thể upload ảnh: ${actualFile.name}`)
      }
    }
  } catch (error) {
    console.error('❌ Lỗi khi upload ảnh:', error)
    console.error('Error details:', error.response?.data || error.message)
    toast.error('Có lỗi xảy ra khi upload ảnh')
    throw error
  }
  
  console.log('✅ Hoàn thành upload. Total URLs:', urls.length)
  return urls
} 

async function sendMessage() {
  if (!contentMessage.value.trim() && files.value.length === 0) {
    toast.warning('Vui lòng nhập tin nhắn hoặc chọn ảnh')
    return
  }
  
  console.log('📤 Bắt đầu gửi tin nhắn...')
  console.log('Nội dung:', contentMessage.value)
  console.log('Số ảnh:', files.value.length)
  
  try {
    loading.value = true
    
    let imageUrls = []
    if(files.value.length > 0) {
      console.log('⏳ Đang upload ảnh...')
      const rawImageUrls = await uploadImg()
      imageUrls = rawImageUrls.join(', ')
      console.log('✅ Upload xong. URLs:', imageUrls)
    }
    
    console.log('⏳ Đang gửi tin nhắn...')
    const res = await api.post('/realtime/sendmessage', {
      receiver_id: otherId.value,
      content: contentMessage.value,
      image_url: imageUrls.length > 0 ? imageUrls : null
    })

    if (res.status !== 200) {
      toast.error('Đã có lỗi xảy ra khi gửi tin nhắn')
    } else {
      console.log('✅ Gửi tin nhắn thành công')
      emit('newMessage', res.data)
      
      contentMessage.value = ''
      files.value = []
      
      if (pond.value) {
        pond.value.removeFiles()
      }
      
      isShowingImgInput.value = false
      scrollToBottom()
    }
  } catch (error) {
    console.error('❌ Lỗi khi gửi tin nhắn:', error)
    toast.error('Không thể gửi tin nhắn')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  scrollToBottom()
  document.addEventListener('click', handleClickOutside)
})

watch(() => route.query.id, (newVal) => {
  otherId.value = newVal
})

watch(
  () => props.chats?.length,
  () => {
    scrollToBottom()
  }
)

const emojiWrapper = ref(null)
const handleClickOutside = (event) => {
  const el = emojiWrapper.value
  if (!el) return

  if (!el.contains(event.target)) {
    isShowEmojiPicker.value = false
  }
}

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>