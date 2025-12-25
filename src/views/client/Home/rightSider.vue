<template>
  <div class="space-y-8 hidden xl:block">
    <!-- Following sidebar -->
    <section v-if="auth?.user != null" class="bg-white rounded-lg p-6 border border-gray-200">
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
      <div class="space-y-3 text-sm flex flex-wrap">
        <router-link
                type="button"
                class="px-2 border m-2 border-sky-700 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                :class="{'bg-sky-300': chossenCate == null}"
                :to="{ path: '/', query: { page:1 } }"
              >
                Tất cả
        </router-link>
        <router-link
                v-for="(category, idx) in props.allCateGories"
                :key="category.id ?? idx"
                type="button"
                class="px-2 border m-2 border-sky-700 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors whitespace-nowrap flex-shrink-0"
                :class="{'bg-sky-300': chossenCate == category.id}"
                :to="{ path: '/', query: { page:1, category:category.id, slug: category.slug, sort: 'hot' } }"
              >
                {{ category.name }}
        </router-link>
      </div>
    </section>

    <!-- Newsletter Section -->
    <section v-if="auth?.user != null" class="bg-sky-50 rounded-lg p-6 text-center">
      <div v-if="auth?.user?.email_verified_at == null">
      <div   
       class="mb-4">
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
      <h3 class="text-lg font-bold text-gray-900 mb-2">Bạn chưa xác thực tài khoản email</h3>
      <p class="text-sm text-gray-600 mb-4">
        Xác thực tài khoản Email để có thể đăng bài viết và nhắn tin với mọi người bạn nhé ;)) 
      </p>
      <button @click="verifyUserEmail" :disabled="auth.loading" class="w-full disabled:cursor-not-allowed text-left text-white px-4 sm:px-5 py-2 bg-sky-400 hover:bg-sky-500 rounded-2xl flex items-center gap-2">
        <span v-if="auth.loading == false">Xác thực Email bạn đã đăng ký tại đây</span>
        <span class="flex leading-4 justify-between" v-else-if="auth.loading == true">Đang gửi email <MoonLoader class="ml-1" v-if="auth.loading" color="#f7f7ef" size="14px"></MoonLoader>  </span>
      </button>
      </div>
      <div
       v-else
       class="w-full h-full">
        <router-link>
        <img
          class="rounded-lg p-6 mb-4 w-full h-full overflow-hidden bg-cover bg-center"
          :src="currentLongAd?.image_url"
        />
      </router-link>
      </div>
    </section>
    <section v-else class="bg-sky-50 rounded-lg p-6 text-center">
        <div
       class="w-full h-full">
        <router-link>
        <img
          class="rounded-lg p-6 mb-4 w-full h-full overflow-hidden bg-cover bg-center"
          :src="currentLongAd?.image_url"
        />
      </router-link>
      </div>
    </section>
    <!-- \small ads  -->
    <section class="text-center">
      <router-link>
        <img
          class="rounded-lg p-6 mb-4 w-full h-[200px] overflow-hidden bg-cover bg-center"
          :src="currentAd?.image_url"
        />
      </router-link>
    </section>

  </div>
</template>

<script setup lang="js">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useFollowStore } from '../../../stores/followAccount.js'
import { useAuthStore } from '../../../stores/auth.js'
import { useRoute } from 'vue-router'
import { useToast } from 'vue-toastification'
import { MoonLoader } from "vue3-spinner"
const toast = useToast()
const route = useRoute()
const follow = useFollowStore()
const auth = useAuthStore()

const chossenCate = ref(null)

async function verifyUserEmail() {
  //console.log("da bam ");
  
  const res = await auth.verifyUserEmail()
  if(res.status == 200 ){
    //console.log("ress",res);
    toast.info(`Chúng tôi đã gửi một email xác nhận tới tài khoản ${auth.user.email} `)
  }
}

watch(
  () => route.query,
  (q) => {
    chossenCate.value =
      q.category === undefined || q.category === '' ? null : Number(q.category)
  },
  { immediate: true }
)

const props = defineProps({
  ads: {
    type: Object,
    default: () => ({})
  },
  allCateGories: { type: Array, required: true }
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
function formatDate(isoString) {
  if (!isoString) return ''
  const d = new Date(isoString)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('vi-VN')
}

// scroll gần cuối thì load thêm
function handleScroll(e) {
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

// --- Ads rotation logic ---
const currentAd = ref(null) // URL
const currentLongAd = ref(null) // ads dài bên trên

let index = 0
let timer = null

let longIndex = 0
let LongTimer = null

function getInfeedAds() {
  return props.ads?.sidebarRightAds || []
}
function getInfeedLongAds() {
  return props.ads?.sidebarLeftAds || []
}

function setCurrentFromIndex() {
  const list = getInfeedAds()
  if (!list.length) {
    currentAd.value = null
    return
  }
  index = index % list.length
  const ad = list[index]
  currentAd.value = ad
}

function setLongCurrentFromIndex() {
  const list = getInfeedLongAds()
  if (!list.length) {
    currentLongAd.value = null
    return
  }
  longIndex = longIndex % list.length
  const ad = list[longIndex]
  currentLongAd.value = ad
}

function startRotate() {
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

function startRotateLong() {
  const list = getInfeedLongAds()
  if (!list.length || LongTimer) return

  setLongCurrentFromIndex()

  LongTimer = setInterval(() => {
    const arr = getInfeedLongAds()
    if (!arr.length) return
    longIndex = (longIndex + 1) % arr.length
    setLongCurrentFromIndex()
  }, 4000)
}

watch(
  () => props.ads?.sidebarRightAds,
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

watch(
  () => props.ads?.sidebarLeftAds,
  (newVal) => {
    if (newVal?.length) {
      longIndex = 0
      setLongCurrentFromIndex()
      if (!LongTimer) startRotateLong()
    } else {
      currentLongAd.value = null
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
  startRotateLong()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
  if (LongTimer) {
    clearInterval(LongTimer)
    LongTimer = null
  }
})
</script>
