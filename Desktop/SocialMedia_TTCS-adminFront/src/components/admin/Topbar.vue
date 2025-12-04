<template>
  <header class="sticky top-0 z-40 bg-white border-b border-gray-200">
    <div class="flex h-16 items-center justify-between px-6">
      <button @click="toggleSidebar" class="lg:hidden text-gray-600 hover:text-gray-900">
        <Bars3Icon class="h-6 w-6" />
      </button>

      <div class="flex-1"></div>

      <div class="flex items-center space-x-4">
        <!-- Notifications (if needed) -->
        <div class="relative">
          <button class="p-2 text-gray-600 hover:text-gray-900">
            <BellIcon class="h-6 w-6" />
            <span
              v-if="unreadCount > 0"
              class="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"
            ></span>
          </button>
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
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'
import {
  Bars3Icon,
  BellIcon,
  UserIcon,
  ChevronDownIcon,
} from '@heroicons/vue/24/outline'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const showMenu = ref(false)
const menuRef = ref(null)
const unreadCount = ref(0)

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
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

