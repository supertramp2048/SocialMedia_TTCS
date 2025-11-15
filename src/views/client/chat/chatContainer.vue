<template>
        <!-- Chat Column -->
          <div class="col-span-1 md:col-span-7">
            <!-- PHẦN CHAT -->
            <div class="mt-4 flex flex-col">
              <!-- Khung chat: full width cột, cao theo viewport -->
              <div
                class="chat-container"
              >
                <!-- Header nhỏ trong khung chat -->
                <div class="headerChat">
                  <div class="text-lg font-bold text-black" >PhDhuy</div>
                </div>

                <!-- Danh sách tin nhắn -->
                <div style="padding: 16px;">
                  <!-- John -->
                  <div 
                  v-for="item in props.chats" :key="item.id"

                  :class= "auth.user.id != item.sender_id ?  'message other' : 'message user'">
                    <img
                      class="avatar"
                      src="https://placehold.co/38x38?text=J"
                      alt="John Doe"
                    />
                    <div class="bubble">
                      <div class="name">John Doe</div>
                      <div>{{item.content}}</div>
                      <div class="time">{{ new Date(item.created_at).toLocaleDateString('vi-VN') }}</div>
                    </div>
                  </div>                 
                </div>
              </div>

              <!-- Ô nhập tin nhắn: sticky bottom, full width cột -->
              <div
                class="chat-input-container"
                style="
                  width: 100%;
                  max-width: 100%;
                "
              >
                <div class="chat-input-box">
                  <form @submit.prevent="sendMessage">
                    <input
                    v-model="contentMessage" 
                    type="text" placeholder="Nhập tin nhắn..." />
                    <button class="btnEffect" type="submit">
                    ➤
                  </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
</template>
<script setup>
  import {ref, onMounted, watch} from 'vue'
  import {useAuthStore} from "../../../stores/auth"
  import {useRoute, useRouter} from 'vue-router'
  import api from '../../../../API/axios'
  import {useToast} from 'vue-toastification'
  const auth = useAuthStore()
  const route = useRoute()
  const toast = useToast()
  const otherId = ref(route.query.id)
  const contentMessage = ref('')
  const props = defineProps({
    chats: {type: Array}
  })
  const emit = defineEmits(['newMessage'])
  async function sendMessage(){
    try {
        const res = await api.post('/realtime/sendmessage',{
          receiver_id: otherId.value,
          content: contentMessage.value,
          image_url: null
        })
        if(res.status != 200){
          toast.error('Đã có lỗi xảy ra khi gửi tin nhắn')
        }
        else{
          emit('newMessage', res.data)
          contentMessage.value=''
        }
    } catch (error) {
      
    }
  }
  onMounted(() =>{
    console.log("ben chat div", props.chats); 
  })
  watch(() => route.query.id, (newVal) => {
    otherId.value = newVal
  })
</script>