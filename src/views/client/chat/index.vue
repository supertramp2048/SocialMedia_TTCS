

<template>
  <Layout>
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="grid grid-cols-1 md:grid-cols-12 gap-6">
          <!-- Chat Column -->
          <!-- Sidebar (Desktop) -->
          <div class="hidden md:block md:col-span-5">
            <div class="bg-white rounded-xl shadow-sm border border-gray-200 h-[70vh] flex flex-col">
              <div class="px-4 py-4 border-b border-gray-100">
                <h2 class="text-lg font-semibold text-gray-900">Danh sách trò chuyện</h2>
                <p class="text-xs text-gray-500 mt-1">Chọn cuộc trò chuyện để xem chi tiết</p>
              </div>
              <div class="flex-1 overflow-y-auto divide-y divide-gray-100">
                <router-link 
                v-for="item in conversations" :key="item?.conversation_id"
                :to="{path:'/nhan-tin', query:{id: item.user.id}}"
                class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer"
                :class="otherId == item.user.id ? 'bg-sky-500':''"
                >
                  <img 
                  :src= "item.user.avatar"
                  class="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-xs font-semibold text-sky-600"></img>
                  <div class="flex-1">
                    <p class="text-sm font-semibold text-gray-900">{{item.user.name}}</p>
                    <p class="text-xs text-gray-500">{{item?.last_message?.content}}</p>
                  </div>
                </router-link>
              </div>
            </div>
          </div>
          <div class="fixed z-50">
            <button
                type="button"
                class="block items-center justify-center px-3 py-1.5 rounded-lg text-xs font-medium bg-sky-500 text-white md:hidden"
                @click="toggleSidebar"
              >
                Danh sách chat
            </button>
          </div>
          <SkeletonChatList class="col-span-1 md:col-span-7" v-if="isLoadingChatHistory"></SkeletonChatList>
          <ChatContainer v-else @newMessage='handleNewMessage' :chats="chatHistory" :others="otherUser"></ChatContainer>
        </div>
      </div>

      <!-- Mobile Sidebar Overlay -->
      <div v-if="isSidebarOpen" class="fixed inset-0 z-40 md:hidden">
        <div class="absolute inset-0 bg-black/40" @click="closeSidebar"></div>

        <div class="absolute inset-y-0 right-0 w-full max-w-sm bg-white shadow-xl border-l border-gray-200 flex flex-col">
          <div class="px-4 py-4 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 class="text-lg font-semibold text-gray-900">Danh sách trò chuyện</h2>
              <p class="text-xs text-gray-500 mt-1">Chọn cuộc trò chuyện để xem chi tiết</p>
            </div>
            <button
              type="button"
              class="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              @click="closeSidebar"
              aria-label="Đóng danh sách"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>

          <div 
          class="flex-1 overflow-y-auto divide-y divide-gray-100"
          >
            <router-link
            v-for="item in conversations" :key="item?.conversation_id"
            :to="{path:'/nhan-tin', query:{id: item.user.id}}"
            :class="otherId == item.user.id ? 'bg-sky-500':''"
            class="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer" @click="closeSidebar">
              <img 
              :src= "item.user.avatar"
              class="h-10 w-10 rounded-full bg-sky-100 flex items-center justify-center text-xs font-semibold text-sky-600"></img>
              <div class="flex-1">
                <p class="text-sm font-semibold text-gray-900">{{item.user.name}}</p>
                <p class="text-xs text-gray-500">
                  <span v-if="item?.last_message?.content">{{item?.last_message?.content}}</span>
                  <span v-else-if="!item?.last_message?.content && item?.image_url"> Đã gửi ảnh</span>
                  </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>
<script setup>
import SkeletonChatList from '../../../components/skeleton/skeletonChatList.vue'
import { ref, onMounted, onBeforeUnmount, inject, watch } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import api from '../../../../API/axios'
import Layout from '@/views/client/layout/layout.vue'
import ChatContainer from './chatContainer.vue'
import {useRoute, useRouter} from 'vue-router'

const echo = inject('echo')
const isLoadingChatHistory = ref(false)
const isSidebarOpen = ref(false)
const auth = useAuthStore()
const route = useRoute()
const otherId = ref(route.query.id)
const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value
}
const closeSidebar = () => {
  isSidebarOpen.value = false
}
watch(()=>route.query.id, async (newVal)=>{
  otherId.value= newVal
  try {
    isLoadingChatHistory.value = true
    const res2 = await api.get(`/api/profiles/${otherId.value}`)
    otherUser.value = res2.data

    const res3 = await api.get(`/realtime/messages/${otherId.value}`)
    //console.log("history ",res3.data);
    const rawChatHistory = res3.data
    rawChatHistory.forEach(item => {
      if (typeof item.image_url === 'string' && item.image_url.trim() !== '') {
        item.image_url = item.image_url.split(', ')
      } else {
        item.image_url = []   // không có ảnh thì gán mảng rỗng
      }
    })
    chatHistory.value = rawChatHistory
  } catch (error) {
    
  }
  finally{
    isLoadingChatHistory.value = false
  }
})
let chatChannel = null
  function handleNewMessage(obj){
    const convertedArray = obj.image_url ? obj.image_url.split(', ') : []
    obj.image_url = convertedArray
    chatHistory.value.push(obj)
  }
// HÀM ĐĂNG KÝ CHANNEL – tách riêng cho dễ gọi lại
const subscribeToChannel = () => {
  if (!echo) {
    console.warn('Echo is not provided!')
    return
  }

  if (!auth.user || !auth.user.id) {
    console.warn('Chưa có auth.user hoặc auth.user.id, chưa subscribe được')
    return
  }

  const userId = String(auth.user.id)
  const channelName = `App.Models.User.${userId}`
  //console.log('Subscribing to channel:', channelName, 'typeof =', typeof channelName)

  // Nếu đã từng subscribe thì rời channel cũ trước
  if (chatChannel) {
    echo.leave(channelName)
    chatChannel = null
  }

  chatChannel = echo.private(channelName)
    .subscribed(() => {
      console.log(' Đã subscribe thành công channel:', channelName)
    })
    // event nhan duoc tu pusher
    .listen('.MessageSent', (payload) => {
      console.log(' Đã nhận event .MessageSent:', payload)
      const arrayConverted = payload.imageUrl ? payload.imageUrl.split(', ') : []
      payload.imageUrl = arrayConverted
      let newMessage = {
        content: payload.MessageText,
        created_at: payload.createAt,
        id: null,
        image_url: payload.imageUrl,
        receiver_id: payload.ReceiverId,
      }
      //console.log("obj message ", newMessage);
      if(payload.SenderId == otherId.value){
        chatHistory.value.push(newMessage)
      }
      // TODO: thêm logic cập nhật UI tin nhắn ở đây
    })
    .error((error) => {
      console.error('❌ Lỗi khi subscribe channel:', error)
    })
    
  // Bật Pusher logging
  if (window.Pusher) {
    window.Pusher.logToConsole = true
    //console.log(' Pusher logging đã bật')
  }
}
let converationChannel = null
const  subscribeToChannelConversation = () => {
    if (!echo) {
    console.warn('Echo is not provided!')
    return
    }

    if (!auth.user || !auth.user.id) {
    console.warn('Chưa có auth.user hoặc auth.user.id, chưa subscribe được')
    return
    }
    const userId = String(auth.user.id)
    const channelName = `converation.change.${userId}`
    if(converationChannel){
      echo.leave(channelName)
      converationChannel = null
    }

    converationChannel = echo.private(channelName)
    .subscribed(() => {
     // console.log("Đã subscribe thành công channel: ",channelName);
    })
    .listen('.ConversationChange', async (payload) => {
      console.log("da nhan event chang converation ",payload);
      const idxOfOldItem = conversations.value.findIndex(item => item.conversation_id == payload.conversationId)
      if(idxOfOldItem !== -1){
        conversations.value[idxOfOldItem].last_message.content = payload.lastMessageContent
      }
      else{
        const newObjConversation = {
          conversation_id: payload.conversationId,
          last_message: {
            content: payload.lastMessageContent,           
            created_at: null,
            id: payload.lastMessageId,
            receiver_id: payload.receiverId,
            sender_id: payload.senderId
          },
          user: {
            avatar: payload.SenderAvatar,
            id: payload.senderId,
            name: payload.SenderName
          }
        }
        conversations.value.push(newObjConversation)
      }
      console.log("mang conversation ",conversations.value);
      
    })
}
// ham chuyen attribute tu string thanh mang 
const normalizeChatHistory = (raw) => {
  if (!Array.isArray(raw)) return []

  return raw.map((item) => {
    // clone để tránh đụng trực tiếp vào res3.data (nếu sau này dùng lại)
    const cloned = { ...item }

    if (typeof cloned.image_url === 'string' && cloned.image_url.trim() !== '') {
      cloned.image_url = cloned.image_url.split(', ')
    } else {
      cloned.image_url = []
    }

    return cloned
  })
}

const otherUser = ref()
const conversations = ref([])
const chatHistory = ref([])
onMounted(async () => {
  // gọi API conversation (không phụ thuộc Echo)
  try {
    isLoadingChatHistory.value = true
    const res = await api.get('/realtime/conversations')
    // console.log("conversation ",res.data );
    conversations.value = res.data
    const res2 = await api.get(`/api/profiles/${otherId.value}`)
    otherUser.value = res2.data
    const res3 = await api.get(`/realtime/messages/${otherId.value}`)
  //  console.log("history ",res3.data);
  
  const rawChatHistory = res3.data
  rawChatHistory.forEach(item => {
  if (typeof item.image_url === 'string' && item.image_url.trim() !== '') {
    item.image_url = item.image_url.split(', ')
  } else {
    item.image_url = []   // không có ảnh thì gán mảng rỗng
  }
})
  chatHistory.value = rawChatHistory
  // thử subscribe ngay nếu user đã có sẵn
  subscribeToChannel()
  subscribeToChannelConversation()
  // nếu auth.user được set bất đồng bộ (vd: sau khi refresh mới restore từ localStorage),
  // watch để khi có user.id thì auto subscribe
  watch(
    () => auth.user && auth.user.id,
    (newVal, oldVal) => {
      if (newVal && newVal !== oldVal) {
        // console.log('🔄 auth.user.id thay đổi, subscribe lại channel')
        subscribeToChannel()
      }
    }
  )
  
  } catch (error) {
    console.error('Lỗi load conversations:', error)
  }
  finally{
    isLoadingChatHistory.value = false
  }
})

onBeforeUnmount(() => {
  if (echo && auth.user && auth.user.id) {
    const channelName = `App.Models.User.${auth.user.id}`
    echo.leave(channelName)
    const channelConversationName = `converation.change.${auth.user.id}`
    echo.leave(channelConversationName)
    //  console.log('Đã rời khỏi channel:', channelName)
  }
  chatChannel = null
})
</script>