<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-[120] bg-white border-b border-gray-200">
      <div v-if="showFormSearch === false">
        <div class="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div class="flex  items-center justify-between h-14 sm:h-16">
            <!-- Logo + Nav -->
            <div class="flex items-center gap-3 sm:gap-6 md:gap-8">
              <router-link to="/" class="flex items-center gap-1.5 sm:gap-2">
                <img :src="settingVar?.logoURL" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" alt="">
                <span class="text-base sm:text-lg md:text-xl font-bold text-gray-900">spiderum</span>
              </router-link>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-2 sm:gap-3 md:gap-4">
              <button 
                @click="showFormSearch = !showFormSearch" 
                class="bg-sky-300 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 btnEffect rounded-xl sm:rounded-2xl text-xs sm:text-sm"
              >
                <i class="fa-solid fa-magnifying-glass"></i>
                <span class="hidden sm:inline ml-1">Tìm kiếm</span>
              </button>

              <div class="flex items-center gap-2 sm:gap-3 md:gap-4" v-if="auth.user">
                <router-link
                  to='/bai-dang/viet-bai'
                  class="btnEffect border border-gray-400 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm"
                >
                  <i class="fa-solid fa-feather"></i>
                  <span class="hidden md:inline ml-1">Viết bài</span>
                </router-link>

                <router-link
                  to='/nhan-tin'
                  class="btnEffect border border-gray-400 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl text-xs sm:text-sm hidden sm:inline-block"
                >
                  <i class="fa-brands fa-signal-messenger"></i>
                </router-link>

                <!-- Notification icon -->
                <div class="relative" ref="notificationMenuRef">
                  <button
                    @click.stop="toggleNotificationMenu"
                    class="relative p-1.5 sm:p-2 rounded-full hover:bg-gray-100 text-gray-600 hover:text-blue-600 transition-colors duration-200 focus:outline-none"
                  >
                    <i class="fa-regular fa-bell text-base sm:text-lg md:text-xl"></i>

                    <span
                      v-if="unreadCount > 0"
                      class="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-[10px] sm:text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full ring-1 sm:ring-2 ring-white"
                    >
                      {{ unreadCount > 99 ? '99+' : unreadCount }}
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
                      class="fixed sm:absolute left-0 right-0 sm:left-auto sm:right-0 top-14 sm:top-auto sm:mt-3 w-full sm:w-80 md:w-96 bg-white rounded-none sm:rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 overflow-hidden z-50 origin-top-right"
                    >
                      <div class="px-3 sm:px-4 py-2.5 sm:py-3 border-b border-gray-100 bg-white">
                        <h3 class="font-bold text-sm sm:text-base text-gray-800">Thông báo</h3>
                      </div>

                      <div class="max-h-[60vh] sm:max-h-[400px] overflow-y-auto" @scroll.passive="handleScroll">
                        <div v-if="notifications.length > 0">
                          <div
                            v-for="item in notifications"
                            :key="item.id"
                            @click="handleNotificationClick(item)"
                            class="group relative px-3 sm:px-4 py-2.5 sm:py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 flex gap-2 sm:gap-3 items-start"
                          >
                            <div class="flex-shrink-0 mt-0.5 sm:mt-1">
                              <div v-if="item.type === 'comment'" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-green-100 flex items-center justify-center text-green-600 text-xs sm:text-sm">
                                <i class="fa-regular fa-comment"></i>
                              </div>
                              <div v-else-if="item.type === 'vote'" class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs sm:text-sm">
                                <i class="fa-solid fa-thumbs-up"></i>
                              </div>
                              <div v-else class="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 text-xs sm:text-sm">
                                <i class="fa-regular fa-bell"></i>
                              </div>
                            </div>

                            <div class="flex-1 min-w-0">
                              <p class="text-xs sm:text-sm text-gray-800 leading-snug mb-1">
                                {{ generateNotificationText(item) }}
                              </p>
                              <p class="text-[10px] sm:text-xs text-gray-400 flex items-center gap-1">
                                <i class="fa-regular fa-clock text-[9px] sm:text-[10px]"></i>
                                {{ formatDate(item.created_at) }}
                              </p>
                            </div>

                            <div class="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-blue-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </div>

                        <div v-else class="flex flex-col items-center justify-center py-6 sm:py-8 text-gray-400">
                          <i class="fa-regular fa-bell-slash text-2xl sm:text-3xl mb-2 text-gray-300"></i>
                          <p class="text-xs sm:text-sm">Không có thông báo nào</p>
                        </div>
                      </div>
                    </div>
                  </transition>
                </div>

                <!-- User Menu -->
                <div class="relative z-50 flex">
                  <button @click="showUserMenu = !showUserMenu">
                    <img :src="auth.user.avatar" class="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full object-cover" alt="">
                  </button>
                  <span
                    class="absolute bottom-1/2 -right-1/2 -translate-x-1/2 transform border-4 sm:border-8 border-b-red-400 border-t-transparent border-l-transparent border-r-transparent transition-all duration-300 ease-in-out"
                    :class="showUserMenu ? 'translate-y-2 rotate-180 opacity-100' : 'translate-y-0 opacity-70'"
                  ></span>

                  <!-- Menu dropdown -->
                  <transition name="fade">
                    <div
                      v-if="showUserMenu"
                      class="fixed sm:absolute z-[130] left-0 right-0 sm:left-auto sm:right-0 top-[4.5rem] sm:top-full sm:mt-3 w-full sm:w-60 md:w-72 bg-white border border-gray-200 shadow-xl rounded-none sm:rounded-2xl overflow-hidden"
                    >
                      <div class="p-3 sm:p-4 border-b flex flex-col border-gray-100 items-center gap-2 sm:gap-3">
                        <div class="relative">
                          <img :src="auth.user.avatar" class="w-12 h-12 sm:w-14 sm:h-14 rounded-full object-cover " alt="">
                          <p v-if="auth.user.email_verified_at == null" class="absolute text-sm text-gray-100 bg-sky-400 block rounded-2xl px-1 w-[130px] -bottom-2 right-1/3"> Email chưa xác thực</p>
                        </div>
                        <div class="text-center">
                          <p class="font-bold text-sm sm:text-base text-gray-800">{{ auth.user.name }}</p>
                          <p class="text-xs sm:text-sm text-gray-500 truncate max-w-[200px]">{{ auth.user.email }}</p>
                        </div>
                        <button
                          @click="goProfilePage(auth.user.id, auth.user.name)"
                          class="btnEffect border rounded-xl sm:rounded-2xl border-gray-300 py-1 px-3 text-xs sm:text-sm"
                        >
                          Xem trang cá nhân
                        </button>
                      </div>

                      <ul class="py-2 text-gray-700 text-sm">

                          <li v-if="auth.user.email_verified_at == null">
                            <button @click="verifyUserEmail" :disabled="auth.loading" class="w-full disabled:cursor-not-allowed text-left px-4 sm:px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                              <span v-if="auth.loading == false">Xác thực Email bạn đã đăng ký</span>
                              <span class="flex leading-4 justify-between" v-else-if="auth.loading == true">Đang gửi email <MoonLoader class="ml-1" v-if="auth.loading" color="#0ea5e9" size="14px"></MoonLoader>  </span>
                            </button>
                          </li>
                        <!-- <li>
                          <button class="w-full text-left px-4 sm:px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                            <i class="fa-regular fa-pen-to-square text-sm"></i> Bài viết của tôi
                          </button>
                        </li> -->
                        <li>
                          <router-link 
                          to='/bai-dang/viet-bai'
                          class="w-full text-left px-4 sm:px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                            <i class="fa-regular fa-file-lines text-sm"></i> Viết bài
                          </router-link>
                        </li>
                        <li>
                          <router-link
                            to='/nguoi-dung/cai-dat'
                            class="w-full text-left px-4 sm:px-5 py-2 hover:bg-gray-100 flex items-center gap-2"
                          >
                            <i class="fa-solid fa-gear text-sm"></i> Tùy chỉnh tài khoản
                          </router-link>
                        </li>
                        <li>
                          <button class="w-full text-left px-4 sm:px-5 py-2 hover:bg-gray-100 flex items-center gap-2">
                            <i class="fa-regular fa-envelope text-sm"></i> Liên hệ
                          </button>
                        </li>
                      </ul>

                      <div class="border-t border-gray-100">
                        <button
                          @click="logout"
                          class="w-full text-left px-4 sm:px-5 py-2.5 sm:py-3 hover:bg-gray-100 flex items-center gap-2 text-red-600 font-semibold text-sm"
                        >
                          <i class="fa-solid fa-right-from-bracket text-sm"></i> Đăng xuất
                        </button>
                      </div>
                    </div>
                  </transition>
                </div>
              </div>

              <div class="flex items-center gap-2 sm:gap-3 md:gap-4" v-else>
                <router-link 
                  to="/login" 
                  class="px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500 text-white text-xs sm:text-sm rounded-full hover:bg-sky-600 transition-colors"
                >
                  Đăng nhập
                </router-link>
                <router-link 
                  to="/dang-ky" 
                  class="hidden sm:inline-block px-3 sm:px-4 py-1.5 sm:py-2 bg-sky-500 text-white text-xs sm:text-sm rounded-full hover:bg-sky-600 transition-colors"
                >
                  Đăng ký
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Search form -->
      <div v-else>
        <SearchForm @hiddenSearchForm="showFormSearch = $event"></SearchForm>
      </div>
    </header>

    <!-- Category bar -->
    <div class="sticky z-[60] bg-white border-b border-gray-200 top-14 sm:top-16">
      <div class="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
        <div class="flex items-center justify-between h-10 sm:h-12">
          <nav class="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3">
            <!-- Scrollable category list -->
            <div class="flex items-center gap-0.5 sm:gap-1 md:gap-2 lg:gap-3 overflow-x-auto scrollbar-hide">
              <!-- Tất cả -->
              <router-link
                type="button"
                class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                :class="{'bg-sky-300': chossenCate == null}"
                :to="{ path: '/', query: { page:1 } }"
              >
                Tất cả
              </router-link>

              <!-- Visible categories -->
              <router-link
                v-for="(category, idx) in visibleCategories"
                :key="category.id ?? idx"
                type="button"
                class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                :class="{'bg-sky-300': chossenCate == category.id}"
                :to="{ path: '/', query: { page:1, category:category.id, slug: category.slug, sort: 'hot' } }"
              >
                {{ category.name }}
              </router-link>
            </div>

            <!-- Dropdown 'Thêm' - nằm ngoài vùng overflow để không bị clip -->
            <div v-if="overflowCategories.length" class="relative flex-shrink-0 z-[70]" ref="moreMenuRef">
              <button
                type="button"
                class="px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors flex items-center gap-1 whitespace-nowrap"
                @click.stop="toggleMore"
                @keydown.esc.stop="closeMore"
                :aria-expanded="showMoreMenu"
                aria-haspopup="menu"
              >
                <span class="hidden sm:inline">Thêm</span>
                <span class="sm:hidden">+</span>
                <span class="hidden sm:inline">({{ overflowCategories.length }})</span>
                <svg class="w-3 h-3 sm:w-4 sm:h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
                </svg>
              </button>

              <!-- Danh sách ẩn -->
              <div
                v-show="showMoreMenu"
                class="absolute z-[80] flex flex-col left-0 sm:left-auto sm:right-0 mt-2 w-48 sm:w-56 max-h-64 sm:max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg p-2"
                role="menu"
              >
                <router-link
                  v-for="(category, idx) in overflowCategories"
                  :key="category.id ?? `more-${idx}`"
                  type="button"
                  class="w-full text-left px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md"
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
    <main class="min-h-screen">
      <slot
        :ads="adsStore?.allAds"
        :setting="settingVar"
      />
    </main>

    <!-- Footer -->
    <FooterBar :footer="settingVar.footer"></FooterBar>
    <ToastNotification ref="toastNotification" @toast-click="handleToastClick"/>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch, inject, onMounted, onUnmounted, } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import {useAdsStore} from '../../../stores/advertisment.js'
import {useSettingStore} from '../../../stores/settingPage.js'
import { useCategoryStore } from '../../../stores/categories'
import FooterBar from './footerBar.vue'
import api from "../../../../API/axios"
import SearchForm from '../../../components/searchForm.vue'
import ToastNotification from './ToastNotification.vue'
import { useToast } from 'vue-toastification'
import { MoonLoader } from "vue3-spinner"
const toast = useToast()
const echo = inject('echo')
const settingStore = useSettingStore()
const showFormSearch = ref(false)
const toastNotification = ref(null)
const auth = useAuthStore()
const categoriesStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const settingVar =ref({})
const adsStore = useAdsStore()
const apiUrl = import.meta.env.VITE_API_BASE
const chossenCate = ref(null)
const showUserMenu = ref(false)

watch(() => route.query, (q) => {
  chossenCate.value = (q.category === undefined || q.category === '') ? null : Number(q.category)
},{immediate:true})

const loading = ref(false)

function logout() {
  if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')){
    auth.logout?.()
    router.push('/')
  }
}

async function verifyUserEmail() {
  console.log("da bam ");
  
  const res = await auth.verifyUserEmail()
  if(res.status == 200 ){
    console.log("ress",res);
    toast.info(`Chúng tôi đã gửi một email xác nhận tới tài khoản ${auth.user.email} `)
  }
}

const showMobileMenu = ref(false)
const safeCategories = computed(() => categoriesStore?.categories?.data ?? [])
const MAX_VISIBLE = 3
const visibleCategories = computed(() => safeCategories.value.slice(0, MAX_VISIBLE))
const overflowCategories = computed(() => safeCategories.value.slice(MAX_VISIBLE))
console.log('safeCategories', safeCategories.value)
console.log('overflowCategories', overflowCategories.value)

const showMoreMenu = ref(false)
const moreMenuRef = ref(null)

function toggleMore() { showMoreMenu.value = !showMoreMenu.value

  console.log('showMoreMenu =', showMoreMenu.value)
 }
function closeMore() { showMoreMenu.value = false }
function goProfilePage(id, name) {
  router.push({
    name: 'Trang cá nhân',
    params: { name },
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

    pagination.value.current_page = data.current_page;
    pagination.value.last_page = data.last_page;
    unreadCount.value = data.unread_count || 0;
  } catch (err) {
    console.error('Failed to load notifications:', err);
  } finally {
    loading.value = false;
  }
}

async function handleScroll(e) {
  const container = e.target;
  if (loadingMore.value) return;

  if (container.scrollTop + container.clientHeight >= container.scrollHeight - 50) {
    if (pagination.value.current_page < pagination.value.last_page) {
      loadingMore.value = true;
      await loadNotifications(pagination.value.current_page + 1, true);
      loadingMore.value = false;
    }
  }
}

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
  const obj = {
    logoURL: settingStore.logoURL.logo_url,
    backGroundURL: settingStore.backGroundURL.background_url,
    footer: settingStore.footer,
  }
  settingVar.value = obj
  console.log("setting variable", settingVar.value);
  
  await adsStore.getAllAds()
  console.log("allAds ",adsStore.allAds);
})

async function toggleNotificationMenu() {
  showNotificationMenu.value = !showNotificationMenu.value

  if (showNotificationMenu.value && unreadCount.value > 0) {
    try {
      await api.post('/realtime/notifications/mark-all-read')

      notifications.value = notifications.value.map(n => ({
        ...n,
        read_at: n.read_at || new Date().toISOString()
      }))

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
}

async function handleNotificationClick(item) {
  try {
    switch(item.type) {
      case 'comment':
      case 'reply_comment':
      case 'vote':
      case 'post':
        if (item.post_id) {
          router.push(`/bai-dang?id=${item.post_id}`)
        }
        break
      case 'follow':
        if (item.sender?.id) {
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

function subscribeNotificationChannel(userId) {
  const events = [
    "PostCreatedNotification",
    "VoteNotification",
    "replyCommentNotification",
    "FollowedNotification",
    "CommentNotification"
  ];

  const channel = echo.private(`notifications.${userId}`);

  events.forEach(eventName => {
    channel.listen(eventName, (payload) => {
      console.log(` New notification [${eventName}]:`, payload);

      notifications.value.unshift({
        id: crypto.randomUUID(),
        post_id: payload.post_id,
        type: payload.type,
        title: payload.title,
        created_at: payload.created_at,
        read_at: null,
        sender: payload.sender ?? null,
      });

      unreadCount.value++;

      toastNotification.value?.showToast(
        "Thông báo mới",
        generateNotificationText(payload),
        payload
      );
    });
  });
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>