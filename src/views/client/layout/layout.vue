<template>
  <div class="min-h-screen bg-white">
    <!-- Header & Category bar (giữ nguyên phần của bạn) -->
    <!-- Header -->
      <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div v-if="showFormSearch === false">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo + Nav -->
            <div class="flex items-center gap-8">
              <router-link to="/" class="flex items-center gap-2">
                <img :src="settingStore?.logoURL?.logo_url" class="w-[50px] h-[50px]" alt="">
                <span class="text-xl font-bold text-gray-900">spiderum</span>
              </router-link>

              <!-- <nav class="hidden md:flex items-center gap-6">
                <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Vườn Học</a>
                <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Nghiên Cứu</a>
                <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Cộng đồng</a>
              </nav> -->
            </div>

            <!-- Right -->
            <div class="flex items-center gap-4">
              <button @click="showFormSearch = !showFormSearch" class="bg-sky-300 px-4 py-2 btnEffect rounded-2xl "> <i class="fa-solid fa-magnifying-glass"> </i> Tìm kiếm</button>
              <div class="flex items-center gap-4" v-if="auth.user">
                <router-link
                  to='/bai-dang/viet-bai'
                  class="btnEffect border border-gray-400 px-4 py-2 rounded-2xl">
                    <i class="fa-solid fa-feather"></i> Viết bài
                </router-link>
                <router-link
                to='/nhan-tin'
                class="btnEffect border border-gray-400 px-4 py-2 rounded-2xl"
                >
                <i class="fa-brands fa-signal-messenger"></i>
                </router-link>

               <!-- Notification icon -->
              <div class="relative" ref="notificationMenuRef">
                  <button
                    @click.stop="toggleNotificationMenu"
                    class="relative p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                  >
                    <i class="fa-regular fa-bell text-xl"></i>

                    <span
                      v-if="unreadCount > 0"
                      class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full ring-2 ring-white"
                    >
                      {{ unreadCount }}
                    </span>
                  </button>

                  <transition
                    enter-active-class="transition ease-out duration-200"
                    enter-from-class="opacity-0 translate-y-1"
                    enter-to-class="opacity-100 translate-y-0"
                    leave-active-class="transition ease-in duration-150"
                    leave-from-class="opacity-100 translate-y-0"
                    leave-to-class="opacity-0 translate-y-1"
                  >
                    <div
                      v-if="showNotificationMenu"
                      class="absolute right-0 mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50 origin-top-right"
                    >
                      <div class="px-4 py-3 border-b border-gray-100 bg-white">
                        <h3 class="font-bold text-gray-800">Thông báo</h3>
                      </div>

                      <div class="max-h-[400px] overflow-y-auto"
                        @scroll.passive="handleScroll">
                        <div v-if="notifications.length > 0">
                          <div
                            v-for="item in notifications"
                            :key="item.id"
                            @click="handleNotificationClick(item)"
                            class="group relative px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 flex gap-3 items-start"
                          >
                            <div class="flex-shrink-0 mt-1">
                              <div v-if="item.type === 'comment'" class="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <i class="fa-regular fa-comment"></i>
                              </div>
                              <div v-else-if="item.type === 'vote'" class="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <i class="fa-solid fa-thumbs-up"></i>
                              </div>
                              <div v-else class="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                <i class="fa-regular fa-bell"></i>
                              </div>
                            </div>

                            <div class="flex-1 min-w-0">
                              <p class="text-sm text-gray-800 leading-snug mb-1">
                                {{ generateNotificationText(item) }}
                              </p>
                              <p class="text-xs text-gray-400 flex items-center gap-1">
                                <i class="fa-regular fa-clock text-[10px]"></i>
                                {{ formatDate(item.created_at) }}
                              </p>
                            </div>

                            <div class="w-2 h-2 rounded-full bg-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </div>

                        <div v-else class="flex flex-col items-center justify-center py-8 text-gray-400">
                          <i class="fa-regular fa-bell-slash text-3xl mb-2 text-gray-300"></i>
                          <p class="text-sm">Không có thông báo nào</p>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- User Menu -->
                <div class="relative flex">
                    <button @click="showUserMenu = !showUserMenu ">
                      <img :src="auth.user.avatar" class="w-[50px] h-[50px] rounded-full" alt="">
                    </button>
                    <span
                      class="absolute bottom-1/2  -right-1/2 -translate-x-1/2 transform border-8 border-b-red-400 border-t-transparent border-l-transparent border-r-transparent transition-all duration-300 ease-in-out"
                      :class="showUserMenu ? 'translate-y-2 rotate-180 opacity-100' : 'translate-y-0 opacity-70'"
                    ></span>
                <!-- Menu dropdown -->
                <transition name="fade">
                  <div
                    v-if="showUserMenu "
                    class="absolute right-0 top-full mt-3 w-60 bg-white border border-gray-200 shadow-xl rounded-2xl overflow-hidden z-50"
                  >
                    <div class="p-4 border-b flex flex-col border-gray-100 items-center gap-3">
                      <img :src="auth.user.avatar" class="w-10 h-10 rounded-full" alt="">
                      <div>
                        <p class="font-bold text-gray-800">{{ auth.user.name }}</p>
                        <p class="text-sm text-gray-500">{{ auth.user.email }}</p>
                      </div>
                      <button
                        @click="goProfilePage(auth.user.id, auth.user.name)"
                        class=" btnEffect border rounded-2xl border-gray-300 py-0.5 px-2"
                      >
                        Xem trang cá nhân
                      </button>
                    </div>

                    <ul class="py-2 text-gray-700">
                      <li>
                        <button class="w-full text-left px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                          <i class="fa-regular fa-pen-to-square"></i> Bài viết của tôi
                        </button>
                      </li>
                      <li>
                        <button class="w-full text-left px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                          <i class="fa-regular fa-file-lines"></i> Viết bài
                        </button>
                      </li>
                      <li>
                        <router-link
                         to='/nguoi-dung/cai-dat'
                         class="w-full text-left px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                          <i class="fa-solid fa-gear"></i> Tùy chỉnh tài khoản
                        </router-link>
                      </li>
                      <li>
                        <button class="w-full text-left px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                          <i class="fa-regular fa-envelope"></i> Liên hệ
                        </button>
                      </li>
                    </ul>

                    <div class="border-t border-gray-100">
                      <button
                       @click="logout"
                       class="w-full text-left px-5 py-3 hover:bg-gray-100 flex items-center gap-2 text-red-600 font-semibold">
                        <i class="fa-solid fa-right-from-bracket"></i> Đăng xuất
                      </button>
                    </div>
                  </div>
                </transition>
                </div>
              </div>

              <div class="flex items-center gap-4" v-else>
                <router-link to="/login" class="px-4 py-2 bg-sky-500 text-white text-sm rounded-full hover:bg-sky-600 transition-colors">
                  Đăng nhập
                </router-link>
                <router-link to="/dang-ky" class="px-4 py-2 bg-sky-500 text-white text-sm rounded-full hover:bg-sky-600 transition-colors">
                  Đăng ký
                </router-link>
              </div>

              <!-- Mobile Menu Button -->
              <!-- <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-2" aria-label="Toggle menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button> -->
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <!-- <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
          <div class="px-4 py-3 space-y-3">
            <button class="block text-sm text-gray-600 hover:text-gray-900">Liên hệ</button>
            <button class="block text-sm text-gray-600 hover:text-gray-900">Đăng ký</button>
          </div>
        </div> -->
        </div>
        <!-- serch form -->
        <div v-else>
          <SearchForm @hiddenSearchForm="showFormSearch = $event"></SearchForm>
        </div>
      </header>
      <!-- Category bar (ADDED) -->
<div class="sticky z-40 bg-white border-b border-gray-200 top-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-12">
      <nav class="flex items-center gap-0.5 md:gap-3">
        <!-- 3 mục đầu -->
        <router-link
          type="button"
          class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
          :class="{'bg-sky-300': chossenCate == null}"
          :to="{ path: '/', query: { page:1 } }"
        >
          Tất cả
        </router-link>
        <router-link
          v-for="(category, idx) in visibleCategories"
          :key="category.id ?? idx"
          type="button"
          class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
          :class="{'bg-sky-300': chossenCate == category.id}"

          :to="{ path: '/', query: { page:1, category:category.id, slug: category.slug, sort: 'hot' } }"
        >
          {{ category.name }}
        </router-link>

        <!-- Dropdown 'Thêm' nếu còn dư -->
        <div v-if="overflowCategories.length" class="relative" ref="moreMenuRef">
          <button
            type="button"
            class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors flex items-center gap-1"
            @click.stop="toggleMore"
            @keydown.esc.stop="closeMore"
            :aria-expanded="showMoreMenu"
            aria-haspopup="menu"
          >
            Thêm ({{ overflowCategories.length }})
            <svg class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Danh sách ẩn -->
          <div
            v-show="showMoreMenu"
            class="absolute flex flex-col left-0 mt-2 w-56 max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg p-2 z-50"
            role="menu"
          >
            <router-link
              v-for="(category, idx) in overflowCategories"
              :key="category.id ?? `more-${idx}`"
              type="button"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md"
              :class="{'bg-sky-300': chossenCate == category.id}"
              :to="{ path: '/', query: { page:1, category:category.id, slug: category.slug, sort: 'hot' } }"
            >
              {{ category.name }}
            </router-link>
          </div>
        </div>
      </nav>
    </div>
  </div>
</div>

    <!-- Main -->
    <main>

        <slot/>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
        © 2025 - Spiderum Clone by Huy
      </div>
    </footer>
    <ToastNotification ref="toastNotification" @toast-click="handleToastClick"/>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch, inject, onMounted, onUnmounted, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import {useSettingStore} from '../../../stores/settingPage.js'
import { useCategoryStore } from '../../../stores/categories'
import api from "../../../../API/axios"
import SearchForm from '../../../components/searchForm.vue'
import ToastNotification from './ToastNotification.vue'
// lay tat ca cac bien tu localStorage

//-------------

const echo = inject('echo')
const settingStore = useSettingStore()
const showFormSearch = ref(false)
const toastNotification = ref(null)
const auth = useAuthStore()
const categoriesStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
// hien thi cate dang chon
const chossenCate = ref(null)
const showUserMenu = ref(false)
 watch(() => route.query, (q) => {
    chossenCate.value = (q.category === undefined || q.category === '') ? null : Number(q.category)
 },{immediate:true})
// Dữ liệu hiển thị gồm toàn bộ post toàn bộ số post theo category 1 post gần nhất theo cate và 4 post hot nhất theo cate

// Phân trang
const loading = ref(false)


// --- Logout ---
function logout() {
  if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')){
    auth.logout?.()
    router.push('/')
  }

}
// ---- MENU CATEGORY (giữ logic hiện có) ----
const showMobileMenu = ref(false)
const safeCategories = computed(() => categoriesStore?.categories?.data ?? [])
const MAX_VISIBLE = 3
const visibleCategories = computed(() => safeCategories.value.slice(0, MAX_VISIBLE))
const overflowCategories = computed(() => safeCategories.value.slice(MAX_VISIBLE))

const showMoreMenu = ref(false)
const moreMenuRef = ref(null)

function toggleMore() { showMoreMenu.value = !showMoreMenu.value }
function closeMore() { showMoreMenu.value = false }
function goProfilePage(id, name) {
  router.push({
    name: 'Trang cá nhân',          // phải đúng với name trong router
    params: { name },               // sẽ map vào :name
    query: { user_id: id, page: 1, limit: 10, sort: 'hot' }
  })
}

const showNotificationMenu = ref(false)
const notificationMenuRef = ref(false)
const notifications = ref([])
const unreadCount = ref(0)
const pagination = ref({
  current_page: 1,
  last_page: 1,
});
const loadingMore = ref(false);
// Lấy dữ liệu từ API
async function loadNotifications(page = 1, append = false) {
  if (loading.value) return;

  loading.value = true;
  try {
    const response = await api.get('/realtime/notifications', {
      params: { page }
    });

    const data = response.data;
    if (append) {
      notifications.value.push(...data.data);
    } else {
      notifications.value = data.data;
    }

    // Cập nhật phân trang
    pagination.value.current_page = data.current_page;
    pagination.value.last_page = data.last_page;

    // Cập nhật số lượng chưa đọc
    unreadCount.value = data.unread_count || 0;
  } catch (err) {
    console.error('Failed to load notifications:', err);
  } finally {
    loading.value = false;
  }
}

// Xử lý sự kiện scroll để load thêm
async function handleScroll(e) {
  const container = e.target;
  if (loadingMore.value) return;

  // Kiểm tra nếu đã cuộn gần đến đáy
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
    if (pagination.value.current_page < pagination.value.last_page) {
      loadingMore.value = true;
      await loadNotifications(pagination.value.current_page + 1, true);
      loadingMore.value = false;
    }
  }
}


// Hàm sinh text thông báo
function generateNotificationText(item) {
  const senderName = item.sender?.name || 'Ai đó'
  switch(item.type) {
    case 'comment':
      return `${senderName} đã bình luận trên bài viết của bạn`
    case 'vote':
      return `${senderName} đã vote bài viết của bạn`
    case 'follow':
      return `${senderName} đã theo dõi bạn`
    case 'reply_comment':
      return `${senderName} đã trả lời bình luận của bạn`
    default:
      return `${senderName} đã đăng bài viết mới`
  }
}

// Hàm format thời gian hiển thị
function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString('vi-VN', { hour12: false })
}

function handleClickOutside(e) {
  if (moreMenuRef.value && !moreMenuRef.value.contains(e.target)) closeMore()
  if (notificationMenuRef.value && !notificationMenuRef.value.contains(e.target)) closeNotificationMenu()
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
onMounted(() => {
  loadNotifications()

  if (auth.user) {
    subscribeNotificationChannel(auth.user.id)
  }

  loadNotifications()
})
onMounted(async () => {
  await settingStore.getSetting()
  console.log("logo ben home",settingStore.logoURL);
  console.log("bg ben home",settingStore.backGroundURL);
  console.log("foot ben home",settingStore.footer);
})
async function toggleNotificationMenu() {
  showNotificationMenu.value = !showNotificationMenu.value

  if (showNotificationMenu.value && unreadCount.value > 0) {
    try {
      // Gửi request lên server đánh dấu tất cả là read
      await api.post('/realtime/notifications/mark-all-read')

      // Cập nhật local
      notifications.value = notifications.value.map(n => ({
        ...n,
        read_at: n.read_at || new Date().toISOString()
      }))

      // Cập nhật badge
      unreadCount.value = 0
    } catch (err) {
      console.error('Failed to mark notifications as read:', err)
    }
  }
}

function closeNotificationMenu() {
  showNotificationMenu.value = false
}
function handleToastClick(item) {
  handleNotificationClick(item)
  // Xử lý điều hướng hoặc hành động khác dựa trên payload
}

async function handleNotificationClick(item) {
  try {

    // Điều hướng dựa theo loại thông báo
    switch(item.type) {
      case 'comment':
      case 'reply_comment':
      case 'vote':
      case 'post':
        if (item.post_id) {
          // Dùng path trực tiếp
          router.push(`/bai-dang?id=${item.post_id}`)
        }
        break
      case 'follow':
        if (item.sender?.id) {
          // Path vẫn đúng với router hiện tại
          router.push(`/nguoi-dung/${item.sender.name}?user_id=${item.sender.id}`)
        }
        break
      default:
        console.log('Unknown notification type')
    }
  } catch (err) {
    console.error('Failed to handle notification click:', err)
  }
}

// Đăng ký kênh Pusher
function subscribeNotificationChannel(userId) {
  const events = [
    "PostCreatedNotification",
    "VoteNotification",
    "replyCommentNotification",
    "FollowedNotification",
    "CommentNotification"
  ];

  // 1. Khởi tạo kênh trước
  const channel = echo.private(`notifications.${userId}`);

  // 2. Lặp qua từng sự kiện để lắng nghe
  events.forEach(eventName => {
    channel.listen(eventName, (payload) => {
      console.log(`🔔 New notification [${eventName}]:`, payload);

      // Thêm vào danh sách thông báo ở FE
      notifications.value.unshift({
        id: crypto.randomUUID(),
        post_id: payload.post_id,
        type: payload.type,
        title: payload.title,
        created_at: payload.created_at,
        read_at: null,
        sender: payload.sender ?? null,
      });

      // Tăng số lượng badge
      unreadCount.value++;

      // Hiển thị toast notification
      toastNotification.value?.showToast(
        "Thông báo mới",
        generateNotificationText(payload),
        payload // Gửi toàn bộ payload để xử lý khi click
      );
    });
  });
}


</script>
