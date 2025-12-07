<template>
  <div class="space-y-8 hidden xl:block">
    <!-- Following sidebar -->
    <section class="bg-white rounded-lg p-6 border border-gray-200">
      <h3 class="text-lg font-bold text-gray-900 mb-4">
        Tác giả bạn đang theo dõi
      </h3>

      <!-- Loading lần đầu -->
      <div v-if="isFirstLoading" class="space-y-3">
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
        <div class="h-4 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <!-- Không có following -->
      <p v-else-if="!followingUsers.length" class="text-sm text-gray-500">
        Bạn chưa theo dõi ai.
      </p>

      <!-- Danh sách following với infinite scroll -->
      <div
        v-else
        ref="followingBox"
        class="max-h-80 overflow-y-auto space-y-4 pr-2"
        @scroll.passive="handleScroll"
      >
        <div
          v-for="user in followingUsers"
          :key="user.id"
          class="flex items-center gap-3"
        >
          <router-link
            :to="{ path: `/nguoi-dung/${user.name}`, query: { user_id: user.id,page: 1,limit: 10,sort: 'hot' } }"
            class="flex items-center gap-3 group"
          >
            <img
              :src="user.avatar"
              :alt="user.name"
              class="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p class="text-sm font-medium text-gray-900 group-hover:text-sky-600">
                {{ user.name }}
              </p>
              <p class="text-xs text-gray-500">
                Tham gia: {{ formatDate(user.created_at) }}
              </p>
            </div>
          </router-link>
        </div>

        <!-- Loading khi load thêm -->
        <div
          v-if="follow.loadingMoreFollowing"
          class="py-3 text-center text-xs text-gray-500"
        >
          Đang tải thêm...
        </div>

        <!-- Hết dữ liệu -->
        <div
          v-else-if="!hasMoreFollowing"
          class="py-2 text-center text-[11px] text-gray-400"
        >
          Đã hiển thị tất cả
        </div>
      </div>
    </section>

    <!-- Popular Links Section -->
    <section class="bg-gray-50 rounded-lg p-6">
      <h3 class="text-lg font-bold text-gray-900 mb-4">Liên kết - Thảo luận</h3>
      <div class="space-y-3 text-sm">
        <a href="#" class="block text-gray-700 hover:text-sky-600">
          Relocation - Tìm hiểu quá trình và hương vị của
        </a>
        <a href="#" class="block text-gray-700 hover:text-sky-600">
          Thật sự tôi đã từng phải thưa thường sử một năm mà chỉ có mỗi món thịt muôi
        </a>
        <a href="#" class="block text-gray-700 hover:text-sky-600">
          VẬN RỘI SCHEDULING
        </a>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section class="bg-sky-50 rounded-lg p-6 text-center">
      <div class="mb-4">
        <svg viewBox="0 0 100 100" class="w-24 h-24 mx-auto">
          <circle cx="50" cy="50" r="40" fill="#0EA5E9" />
          <ellipse cx="40" cy="45" rx="6" ry="8" fill="white" />
          <ellipse cx="60" cy="45" rx="6" ry="8" fill="white" />
          <circle cx="41" cy="46" r="3" fill="#1e293b" />
          <circle cx="61" cy="46" r="3" fill="#1e293b" />
          <path
            d="M 35 55 Q 50 65 65 55"
            stroke="#1e293b"
            stroke-width="2"
            fill="none"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <h3 class="text-lg font-bold text-gray-900 mb-2">CÁC BÀI VIẾT MỚI BẬT</h3>
      <p class="text-sm text-gray-600 mb-4">
        BẮN KHÔNG NẰM NỔI LỚI
      </p>
      <p class="text-xs text-gray-500 mb-4">
        Theo dõi La Plume và nhận dòng cập nhật khác, thông báo dựa của chúng tôi để không bỏ lỡ bởi!
      </p>
      <input
        type="email"
        placeholder="Nhập email của bạn..."
        class="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
      />
      <button
        class="w-full px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors"
      >
        ĐĂNG KÝ
      </button>
    </section>

    <!-- App Download -->
    <section class="text-center">
      <router-link>
        <img
          class="rounded-lg p-6 mb-4 w-full h-[200px] overflow-hidden bg-cover bg-center"
          :src="currentAd?.image_url"
        />
      </router-link>
      <div class="flex gap-3 justify-center">
        <a href="#" class="inline-block">
          <img
            src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-alternate.svg"
            alt="Download on App Store"
            class="h-10"
          />
        </a>
        <a href="#" class="inline-block">
          <img
            src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png"
            alt="Get it on Google Play"
            class="h-10"
          />
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useFollowStore } from '../../../stores/followAccount.js'
import { useAuthStore } from '../../../stores/auth.js'

const follow = useFollowStore()
const auth = useAuthStore()

const props = defineProps({
  ads: {
    type: Object,
    default: () => ({})
  }
})

const followingBox = ref(null)

// danh sách following (người user đang theo dõi)
const followingUsers = computed(() => follow.following?.data || [])

// còn trang tiếp theo không
const hasMoreFollowing = computed(() => {
  const meta = follow.following?.meta
  if (!meta) return false
  return meta.current_page < meta.last_page
})

// loading lần đầu (trang 1) cho following
const isFirstLoading = computed(() => follow.loading && !follow.loadedFollowing)

// format ngày join
function formatDate (isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN')
}

// scroll gần cuối thì load thêm
function handleScroll (e) {
  const el = e.target
  const threshold = 40 // px

  if (
    el.scrollTop + el.clientHeight >= el.scrollHeight - threshold &&
    hasMoreFollowing.value &&
    !follow.loadingMoreFollowing
  ) {
    const id = auth.user?.id
    if (!id) return
    follow.loadMoreFollowing(id)
  }
}

// --- Ads rotation logic của anh (giữ nguyên) ---
const currentAd = ref(null) // URL
let index = 0
let timer = null

function getInfeedAds () {
  return props.ads || []
}

function setCurrentFromIndex () {
  const list = getInfeedAds()
  if (!list.length) {
    currentAd.value = null
    return
  }
  index = index % list.length
  const ad = list[index]
  currentAd.value = ad
}

function startRotate () {
  const list = getInfeedAds()
  if (!list.length || timer) return

  setCurrentFromIndex()

  timer = setInterval(() => {
    const arr = getInfeedAds()
    if (!arr.length) return
    index = (index + 1) % arr.length
    setCurrentFromIndex()
  }, 4000)
}

watch(
  () => props.ads,
  (newVal) => {
    if (newVal?.length) {
      index = 0
      setCurrentFromIndex()
      if (!timer) startRotate()
    } else {
      currentAd.value = null
    }
  },
  { immediate: true }
)

// load following trang 1 khi mount
onMounted(async () => {
  const id = auth.user?.id
  if (id) {
    follow.loadedFollowing = false
    follow.following = null
    await follow.getFollowing(id, { page: 1 })
  }

  startRotate()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
