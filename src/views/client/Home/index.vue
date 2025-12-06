<template>
  <Layout v-slot="{ ads, setting, allCateGories }">
    <!-- Hero Section -->
    <Banner :setting="setting"></Banner>
    
    <!-- Main Content -->
    <div class="w-full mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 md:py-8 lg:py-12 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
          
          <!-- Featured Posts Section -->
          <section>
            <div class="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <h2 class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Mới nhất trên La Plume
              </h2>
            </div>
            <div v-if="loadingExtras" class="grid gap-4 sm:gap-6">
              <SkeletonCard v-for="n in 1" :key="'sk-latest-'+n" />
            </div>
            <GridPost v-else :posts="latestPost" :pageLimit="null"></GridPost>
          </section>

          <!-- Banner Ad -->
          <div class="my-4 sm:my-6 lg:my-8">
            <BannerAds :ads="ads"></BannerAds>
          </div>
          
          <!-- Latest Articles Grid -->
          <section>
            <div class="flex items-center justify-between mb-3 sm:mb-4 md:mb-6">
              <h2 class="text-sm sm:text-base md:text-xl lg:text-2xl font-bold text-gray-900 uppercase tracking-wide">
                Nổi bật trong tuần
              </h2>
            </div>
            
            <!-- so post noi bat -->
            <div v-if="loadingExtras" class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <SkeletonCard v-for="n in 4" :key="'sk-featured-'+n" />
            </div>
            <div v-else class="mb-4 sm:mb-6 lg:mb-8">
              <Carousel :posts="featuredPosts?.data"></Carousel>
            </div>

            <!-- Banner Ad -->
            <div class="my-4 sm:my-6 lg:my-8">
              <BannerAds :ads="ads"></BannerAds>
            </div>

            <!-- grid post tất cả các post theo category id-->
            <div v-if="loadingPosts" class="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <SkeletonCard v-for="n in objPagination.limit || 6" :key="'sk-grid-'+n" />
            </div>
            <GridPost v-else :posts="posts" :pageLimit="totalPages"></GridPost>
          </section>
        </div>

        <!-- Right Sidebar -->
        <aside class="lg:col-span-1 hidden lg:block">
          <div class="sticky top-4">
            <RightSider :ads="ads" :allCateGories="allCateGories"></RightSider>
          </div>
        </aside>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="js">
import Layout from '../layout/layout.vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from "../../../../API/axios"
import {useSettingStore} from '../../../stores/settingPage.js'
import RightSider from "../Home/rightSider.vue"
import Banner from "../Home/banner.vue"
import BannerAds from "../Home/bannerAds.vue"
// loader cho trang
import { globalLoading } from '../../../../API/axios'
import Carousel from '../../../components/caroulselPost.vue'
import SkeletonCard from '../../../components/skeleton/SkeletonCard.vue'
const settingStore = useSettingStore()
const router = useRouter()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
// du lieu cac posts
const posts = ref({ data: [] })
const latestPost = ref({ data: [] })
const featuredPosts = ref({ data: [] })
// Phân trang
const objPagination = ref({ page: 1, limit: 10, sort: 'hot' })
const inputPage = ref(objPagination.value.page) // <--- thêm biến nhập tạm
const numberOfPost = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(numberOfPost.value / objPagination.value.limit)))
import GridPost from '../../../components/gridPost.vue'
// che do sap xep bai viet
const loadingPosts = ref(false)   // loading cho danh sách bài chính (grid)
const loadingExtras = ref(false)  // loading cho latest/featured (extras)
const sortSetting = ref('hot')
function updatePagination(patch) {
  const next = { ...route.query }
    if (patch == null || patch === '')
      delete next.category
    else{
      next.sort = patch
    }
  router.replace({ query: next })   // 👉 KHÔNG đụng objPagination ở đây
}

// Hàm lấy bài viết
async function fetchPosts() {
  //console.log("fetch posts");
  
  loadingPosts.value = true
  try {
    const res = await api.get(`${apiUrl}/api/posts`, { params: objPagination.value })
    posts.value = res.data
    numberOfPost.value = res.data?.meta?.total ?? res.data?.total ?? 0
  } catch (error) {
    console.error('Lỗi tải posts:', error)
  } finally {
    loadingPosts.value = false
  }
}
function goPage() {
  let p = Number(inputPage.value) || 1
  p = Math.min(Math.max(1, p), totalPages.value)
  objPagination.value.page = p
  inputPage.value = p
  // set URL (giữ lại các query khác nếu có)
  const next = { ...route.query, page: p }
  if (objPagination.value.category == null) {
    delete next.category
  } else {
    next.category = objPagination.value.category
    next.sort = objPagination.value.sort
  }
  router.replace({ query: next })
}

// Kiểm tra giới hạn trang
function clampPage() {
  const p = Number(objPagination.value.page) || 1
  objPagination.value.page = Math.min(Math.max(1, p), totalPages.value)
}

// Nút phân trang
function nextPage() {
  if (objPagination.value.page < totalPages.value) objPagination.value.page++
}
function prevPage() {
  if (objPagination.value.page > 1) objPagination.value.page--
}

// Đọc params từ URL → gán vào state
watch(
  () => route.query,
  (q) => {
    const page = q.page ? Number(q.page) : 1
    const cat =
      q.category === undefined || q.category === ''
        ? null
        : Number(q.category)

    // 🔹 Quy ước: sortMode = 'hot' | 'newest' | 'following'
    let sortMode

    if (q.feed != null && q.feed !== '') {
      // Có feed → đang ở mode 'following'
      sortMode = q.feed // thường là 'following'

      // Cập nhật objPagination cho feed
      objPagination.value.feed = sortMode
      delete objPagination.value.sort
    } else {
      // Không có feed → dùng sort (hot / newest)
      sortMode =
        typeof q.sort === 'string' && q.sort !== ''
          ? q.sort
          : 'hot'

      objPagination.value.sort = sortMode
      delete objPagination.value.feed
    }

    // 🔹 Đồng bộ về sortSetting (để button active đúng)
    sortSetting.value = sortMode

    // 🔹 Các phần còn lại giữ nguyên
    objPagination.value.page = Number.isNaN(page) ? 1 : page
    inputPage.value = objPagination.value.page
    objPagination.value.category = Number.isNaN(cat) ? null : cat
  },
  { immediate: true }
)


// Watch A: chỉ khi đổi category → fetchExtras + fetchPosts (và reset page = 1)
watch(() => objPagination.value.category, async (newCat, oldCat) => {
  if (newCat === oldCat) return
  // Reset page về 1 khi đổi category để kết quả nhất quán
  objPagination.value.page = 1
  inputPage.value = 1
  // Cập nhật URL giữ nguyên sort và category
  const next = { ...route.query, page: 1 }
  if (newCat == null) {
    delete next.category
  } else {
    next.category = newCat
    next.sort = objPagination.value.sort
  }
  router.replace({ query: next })
  // Thực thi fetch
  clampPage()
  await fetchExtras()   // ✅ chỉ chạy ở đây và onMounted
  await fetchPosts()
}, { immediate: false })

// Watch B: đổi page hoặc sort → chỉ fetchPosts (KHÔNG fetchExtras)
watch(
  [() => objPagination.value.page, () => objPagination.value.sort],
  async ([p, s], [op, os]) => {
    if (p === op && s === os) return
    await fetchPosts() // ❌ tuyệt đối không gọi fetchExtras() ở đây
  },
  { immediate: false }
)
// --- Bài mới & nổi bật ---
async function fetchExtras() {
  console.log("fetchExtras");
  
  loadingExtras.value = true
  try {
    const res1 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 1, sort: 'newest', category: objPagination.value.category } })
    latestPost.value = res1.data

    const res2 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 4, sort: 'hot', category: objPagination.value.category } })
    featuredPosts.value = res2.data
  } catch (error) {
    console.error('Lỗi lấy bài nổi bật:', error)
  } finally {
    loadingExtras.value = false
  }
}

// --- Mounted ---
onMounted(async () => {
  await fetchPosts()
  await fetchExtras()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>