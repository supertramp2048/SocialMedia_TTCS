<template>
  <aside class="w-full lg:w-[364px] bg-gray-50 lg:min-h-[454px] relative">
    <div class="w-full lg:w-[293px] bg-gray-50 p-4 pt-16 lg:pt-20">
      <!-- Avatar - positioned to overflow top -->
      <div
        class="absolute -top-16 lg:-top-[73px] left-4 w-[144px] h-[144px] border border-gray-300 rounded-full p-[1px]"
      >
        <div class="w-[142px] h-[142px] rounded-full bg-gray-100 overflow-hidden">
          <img
            :src="user?.avatar"
            :alt="user?.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>

      <!-- User Info -->
      <div class="flex items-center justify-between mt-3 mb-3">
        <h1 class="text-lg font-bold text-gray-700">{{user?.name}}</h1>
        <button 
         v-if=" auth?.user?.id != user?.id "
         class="p-1" aria-label="Share">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M2.32438 4.35425C2.57383 4.23254 2.84745 4.16846 3.125 4.16675H14.375C14.6526 4.16846 14.9262 4.23254 15.1756 4.35425L9.17562 9.8155C9.05885 9.91999 8.90764 9.97777 8.75094 9.97777C8.59423 9.97777 8.44303 9.91999 8.32625 9.8155L2.32438 4.35425ZM13.1187 11.6668H13.125C13.1248 11.3048 13.2297 10.9505 13.4268 10.6468C13.624 10.3432 13.905 10.1033 14.2358 9.95613C14.5665 9.80901 14.9329 9.76099 15.2904 9.81789C15.6479 9.8748 15.9813 10.0342 16.25 10.2768V6.04175C16.2489 5.76272 16.1848 5.48754 16.0625 5.23675L11.0625 9.79112L13.1187 11.6668ZM1.4375 5.23675C1.31519 5.48754 1.2511 5.76272 1.25 6.04175V13.5418C1.2511 13.8208 1.31519 14.096 1.4375 14.3468L6.44187 9.79175L1.4375 5.23675ZM10.13 10.6355L10.0138 10.7418C9.66718 11.0536 9.21746 11.2262 8.75125 11.2262C8.28504 11.2262 7.83532 11.0536 7.48875 10.7418L7.37 10.633L2.32438 15.2293C2.57393 15.3507 2.84748 15.4148 3.125 15.4168H8.75V13.5418C8.75 13.0445 8.94754 12.5676 9.29917 12.216C9.65081 11.8643 10.1277 11.6668 10.625 11.6668H11.2625L10.13 10.6355ZM18.5675 14.3499L15.4425 11.2249C15.3551 11.1373 15.2437 11.0776 15.1224 11.0534C15.0011 11.0292 14.8753 11.0415 14.761 11.0888C14.6466 11.1361 14.5489 11.2163 14.4802 11.3192C14.4115 11.4221 14.3749 11.5431 14.375 11.6668V12.9168H10.625C10.4592 12.9168 10.3003 12.9826 10.1831 13.0998C10.0658 13.2171 10 13.376 10 13.5418V16.0418C10 16.2075 10.0658 16.3665 10.1831 16.4837C10.3003 16.6009 10.4592 16.6668 10.625 16.6668H14.375V17.9168C14.375 18.0404 14.4117 18.1612 14.4804 18.2639C14.5491 18.3667 14.6467 18.4468 14.7608 18.4941C14.875 18.5414 15.0007 18.5538 15.1219 18.5297C15.2431 18.5055 15.3545 18.446 15.4419 18.3587L18.5669 15.2337C18.684 15.1165 18.7499 14.9575 18.7499 14.7918C18.7499 14.6261 18.6846 14.4671 18.5675 14.3499Z"
              fill="#606266"
            />
          </svg>
        </button>
        <!-- more option -->
        <div class="relative" ref="menuRef">
        <button 
          v-if="auth?.user?.id != user?.id "
          @click.stop="showOption = !showOption "
          
          class="p-1 ml-auto" aria-label="More options">
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

        <button
        v-if="showOption"
          @click.prevent.stop="toggle"
         class="btnEffect absolute -bottom-[60px] rounded-xl w-[100px] right-1/4 sm:-right-1/2 z-50 px-2 py-1 bg-gray-300">
          <i class="fa-regular fa-flag"></i> Báo cáo người dùng
        </button>
        </div>
      </div>

      <p class="text-sm text-gray-400 mb-4">{{user?.email}}</p>

      <!-- Follow Button -->
      <div v-if=" auth?.user?.id != user?.id ">
        <button
        @click="followHandler"
        v-if="userData?.is_following == false" 
        class="w-full py-2 bg-sky-400 text-white text-xl btnEffect rounded-md hover:bg-primary/10 transition-colors mb-6"
      >
        <p class="flex justify-center items-center">
          Theo dõi <SmallLoadingIcon class="mx-1" v-if="isLoading"></SmallLoadingIcon>
        </p>
      </button>

       <button
        @click="followHandler"
        v-else-if="userData?.is_following == true" 
        class="w-full py-2 bg-sky-400 text-white text-xl btnEffect rounded-md hover:bg-primary/10 transition-colors mb-6"
      >
        <p class="flex justify-center items-center">
          <i class="fa-solid fa-check pr-1"></i> Đã Theo dõi <SmallLoadingIcon class="mx-1" v-if="isLoading"></SmallLoadingIcon>
        </p>
      </button>
      </div>
      

      <!-- Stats -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-base font-semibold text-gray-800">{{userData?.followers_count}}</p>
          <p class="text-sm text-gray-800">followers</p>
        </div>
        <div>
          <p class="text-base font-semibold text-gray-800">{{userData?.following_count}}</p>
          <p class="text-sm text-gray-800">following</p>
        </div>
        <div>
          <p class="text-base font-semibold text-gray-800">0</p>
          <p class="text-sm text-gray-800">spiders</p>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onBeforeUnmount  } from "vue";
import {useRoute } from "vue-router"
import { useAuthStore } from '../stores/auth'
import SmallLoadingIcon from '../components/smallLoadingIcon.vue'
import api from '../../API/axios'
const showOption = ref(false)
const isLoading = ref(false)
const auth = useAuthStore()
const route = useRoute()

const props = defineProps ({
    user: {type:Object, require: true}
})
const userData = ref({ ...props.user })

watch(() => props.user, (newVal) => {
  userData.value = { ...newVal }
}, { immediate: true })

async function followHandler(){
  try {
      isLoading.value = true
      const res = await api.post(`/api/users/${props.user?.id}/follow`)
      
      userData.value.is_following = res.data.is_following
      userData.value.followers_count = res.data.followers_count
  } catch (error) {
    
  }
  finally{
    isLoading.value = false
  }
}

const menuRef = ref(null)

function handleClickOutside(e) {
  if (menuRef.value && !menuRef.value.contains(e.target)) {
    showOption.value = false
  }
}

onMounted(() => {
  console.log("auth",auth.user.id);

  
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

const emit = defineEmits(['ShowForm']) 
function toggle(){
  emit('ShowForm', true)
}

</script>
