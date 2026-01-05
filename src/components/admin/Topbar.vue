<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex h-16 items-center justify-between px-6">
      <button @click="toggleSidebar" class="lg:hidden text-gray-600 hover:text-gray-900">
        <Bars3Icon class="h-6 w-6" />
      </button>

      <div class="flex-1"></div>

      <div class="flex items-center space-x-4" ref="notiRef">
        <!-- Notifications (if needed) -->
        <div class="relative">
          <button @click="handleShowNotifi" class="p-2 text-gray-600 hover:text-gray-900">
            <BellIcon class="h-6 w-6" />
            <span
              v-if="unreadCount > 0"
              class="absolute left-1/2 top-0 text-sm text-amber-50 text-center rounded-full px-1 py-0 block bg-red-500"
            > {{unreadCount}} </span>
          </button>
          <div
              v-if="showNotification"
              class="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
            >
              <div class="px-4 py-2 border-b font-medium text-gray-700">
                Thông báo
              </div>

              <ul class="max-h-60 overflow-y-scroll">
                <!-- Thông báo giả -->
                <li v-for="item in notificationStore.arrNotification" :key="item.report_id" class="px-4 py-2 hover:bg-gray-50 border-b">
                  <div class="text-sm font-semibold"> Báo cáo 
                    <span v-if="item.evidence_comment"> bình luận</span>
                    <span v-else-if="item.reported_user"> người dùng</span>
                    <span v-if="item.evidence_post"> bài viết </span>
                  </div>
                  <div class="text-xs text-gray-500 overflow-x-clip">{{item.reason}}</div>
                </li>
              </ul>
            </div>
        </div>

        <!-- User menu -->
        <div class="relative" ref="menuRef">
          <button
            @click="showMenu = !showMenu"
            class="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100"
          >
            <img
              v-if="authStore.user?.avatar"
              :src="authStore.user.avatar"
              :alt="authStore.user.name"
              class="h-8 w-8 rounded-full"
            />
            <div v-else class="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <UserIcon class="h-5 w-5 text-gray-600" />
            </div>
            <div class="hidden md:block text-left">
              <p class="text-sm font-medium text-gray-900">{{ authStore.user?.name }}</p>
              <p class="text-xs text-gray-500">{{ authStore.user?.role }}</p>
            </div>
            <ChevronDownIcon class="h-4 w-4 text-gray-500" />
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
          >
            <router-link
              to="/admin/dashboard"
              class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              @click="showMenu = false"
            >
              Dashboard
            </router-link>
            <button
              @click="handleLogout"
              class="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import {useNotificationStore} from '../../stores/notification'
import {useRoute, useRouter} from 'vue-router'

import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'
const route = useRoute()
const notificationStore = useNotificationStore()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showMenu = ref(false)
const notiRef = ref(null)
const menuRef = ref(null)
const unreadCount = computed(() => notificationStore.notificationCount)
const showNotification = ref(false)

function handleShowNotifi(){
  showNotification.value = !showNotification.value
}

const toggleSidebar = () => {
  // Emit event to toggle sidebar (handled by parent or store)
  const event = new CustomEvent('toggle-sidebar')
  window.dispatchEvent(event)
}

const handleLogout = async () => {
  try {
    await authStore.logout()
    toast.success('Logged out successfully')
    router.push('/admin/login')
  } catch (error) {
    toast.error('Failed to logout')
  }
  showMenu.value = false
}

// Close menu when clicking outside
const handleClickOutside = (event) => {
  if (menuRef.value && !menuRef.value.contains(event.target)) {
    showMenu.value = false
    
  }
  if(notiRef.value && !notiRef.value.contains(event.target)){
    showNotification.value = false
  }
}
// giữ ref kênh để unsubscribe
let channels = []

// hàm subscribe kênh report
function subscribeReportChannels() {
  // unsubscribe trước khi subscribe mới
  unsubscribeReportChannels()

  const commentChannel = window.echo.private('reports.comment')
  commentChannel.listen('CommentReportSent', (e) => {
    notificationStore.addNotification(e)
  })

  const userChannel = window.echo.private('reports.user')
  userChannel.listen('UserReportSent', (e) => {
    notificationStore.addNotification(e)
  })

  const postChannel = window.echo.private('reports.post')
  postChannel.listen('PostReportSent', (e) => {
    notificationStore.addNotification(e)
  })

  // lưu kênh để unsubscribe sau này
  channels = [commentChannel, userChannel, postChannel]
}

// hàm unsubscribe tất cả kênh hiện tại
function unsubscribeReportChannels() {
  channels.forEach((ch) => {
    window.echo.leave(ch.name) // hoặc ch.unsubscribe() tùy API Echo/Pusher
  })
  channels = []
}

// watch route để subscribe/unsubscribe
watch(() => route.fullPath, (newPath) => {
  if (newPath === '/admin/reports') {
    console.log('Đang ở route /admin/reports, subscribe kênh')
    subscribeReportChannels()
  } else {
    console.log('Rời route report, unsubscribe kênh')
    unsubscribeReportChannels()
  }
}, { immediate: true })

// cleanup khi component unmount
onUnmounted(() => {
  unsubscribeReportChannels()
})

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

