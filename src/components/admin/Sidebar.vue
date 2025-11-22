<template>
  <aside
    class="fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out"
    :class="sidebarClasses"
  >
    <div class="flex h-16 items-center justify-between px-6 border-b border-gray-800">
      <h1 class="text-xl font-bold">Admin Panel</h1>
      <button @click="toggle" class="lg:hidden text-gray-400 hover:text-white">
        <XMarkIcon v-if="isOpen" class="h-6 w-6" />
        <Bars3Icon v-else class="h-6 w-6" />
      </button>
    </div>

    <nav class="mt-6 px-3">
      <router-link
        v-for="item in menuItems"
        :key="item.path"
        :to="item.path"
        class="flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-colors cursor-pointer"
        :class="
          $route.path === item.path
            ? 'bg-gray-800 text-white'
            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
        "
        @click="handleLinkClick"
      >
        <component :is="item.icon" class="h-5 w-5 mr-3" />
        {{ item.label }}
      </router-link>
    </nav>
  </aside>

  <!-- Overlay for mobile -->
  <div
    v-if="isOpen"
    class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    @click="close"
  ></div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  HomeIcon,
  UsersIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  FlagIcon,
  FolderIcon,
  PaintBrushIcon,
} from '@heroicons/vue/24/outline'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/solid'

const route = useRoute()
const authStore = useAuthStore()

// Track window width for responsive behavior
const windowWidth = ref(window.innerWidth)

// Set isOpen to true by default on desktop, false on mobile
const isOpen = ref(window.innerWidth >= 1024)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  // Only close on mobile, keep open on desktop
  if (windowWidth.value < 1024) {
    isOpen.value = false
  }
}

const handleLinkClick = () => {
  // Close sidebar on mobile when a link is clicked
  if (windowWidth.value < 1024) {
    isOpen.value = false
  }
}

// Listen to toggle event from Topbar
const handleToggleSidebar = () => {
  toggle()
}

// Handle window resize
const handleResize = () => {
  windowWidth.value = window.innerWidth
  if (windowWidth.value >= 1024) {
    isOpen.value = true
  } else {
    isOpen.value = false
  }
}

onMounted(() => {
  window.addEventListener('toggle-sidebar', handleToggleSidebar)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('toggle-sidebar', handleToggleSidebar)
  window.removeEventListener('resize', handleResize)
})

const sidebarClasses = computed(() => {
  // On desktop (lg), always show sidebar
  // On mobile, show/hide based on isOpen
  if (windowWidth.value >= 1024) {
    return 'translate-x-0'
  }
  return isOpen.value ? 'translate-x-0' : '-translate-x-full'
})

const menuItems = computed(() => {
  const items = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: HomeIcon },
    { path: '/admin/users', label: 'Users', icon: UsersIcon },
    { path: '/admin/posts', label: 'Posts', icon: DocumentTextIcon },
    { path: '/admin/comments/hidden', label: 'Comments', icon: ChatBubbleLeftRightIcon },
  ]

  if (authStore.isModerator) {
    items.push({ path: '/admin/reports', label: 'Reports', icon: FlagIcon })
  }

  if (authStore.isAdmin) {
    items.push({ path: '/admin/categories', label: 'Categories', icon: FolderIcon })
  }

  if (authStore.isSuperAdmin) {
    items.push({ path: '/admin/staff', label: 'Staff', icon: UserGroupIcon })
  }

  if (authStore.isAdmin) {
    items.push({ path: '/admin/appearance', label: 'Appearance', icon: PaintBrushIcon })
  }

  return items
})
</script>

