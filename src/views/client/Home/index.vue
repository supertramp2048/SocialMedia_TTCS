
<template>
  <Layout>
    <loader :show="globalLoading" />
    <!-- Hero Section -->
    <Banner></Banner>
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Featured Posts Section -->
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">Mới nhất trên Spiderum</h2>
            </div>
            <GridPost :posts="latestPost" :pageLimit="null"></GridPost>
          </section>

          <!-- Banner Ad -->
          <div class="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg overflow-hidden">
            <div class="p-8 text-center text-white">
              <h3 class="text-2xl md:text-3xl font-bold mb-2">THÁNG 9</h3>
              <p class="text-xl md:text-2xl mb-4">BACK TO SCHOOL</p>
              <p class="text-sm opacity-90">Khuyến mãi đặc biệt trong tháng này</p>
            </div>
          </div>
          <!-- Latest Articles Grid -->
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">Nổi bật trong tuần</h2>
            </div>
            <!-- so post noi bat -->
            <Carousel :posts="featuredPosts?.data"></Carousel>
            <!-- <GridPost :posts="featuredPosts" :pageLimit="null"></GridPost> -->

            <div class="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg overflow-hidden">
            <div class="p-8 text-center text-white">
              <h3 class="text-2xl md:text-3xl font-bold mb-2">THÁNG 9</h3>
              <p class="text-xl md:text-2xl mb-4">BACK TO SCHOOL</p>
              <p class="text-sm opacity-90">Khuyến mãi đặc biệt trong tháng này</p>
            </div>
          </div>
          <!-- grid post tất cả các post theo category id-->
          <GridPost :posts="posts" :pageLimit="totalPages"></GridPost>
          </section>
        </div>

        <!-- <--Right Sidebar -->
        <RightSider ></RightSider>
      </div>
    </div>
  </Layout>
</template>
<script setup lang="js">
import Layout from '../layout/layout.vue'
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from "../../../../API/axios"
import RightSider from "../Home/rightSider.vue"
import Banner from "../Home/banner.vue"
// loader cho trang
import { globalLoading } from '../../../../API/axios'
import loader from '../../../components/loader.vue'
import Carousel from '../../../components/caroulselPost.vue'
const router = useRouter()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
// du lieu cac posts
const posts = ref({ data: [] })
const latestPost = ref({ data: [] })
const featuredPosts = ref({ data: [] })
// Phân trang
const objPagination = ref({ page: 1, limit: 5, sort: 'hot' })
const inputPage = ref(objPagination.value.page) // <--- thêm biến nhập tạm
const numberOfPost = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(numberOfPost.value / objPagination.value.limit)))
import GridPost from '../../../components/gridPost.vue'
// che do sap xep bai viet
const loading = ref(false)
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
  console.log("fetch posts");
  
  loading.value = true
  try {
    const res = await api.get(`${apiUrl}/api/posts`, { params: objPagination.value })
    posts.value = res.data
    numberOfPost.value = res.data?.meta?.total ?? res.data?.total ?? 0
  } catch (error) {
    console.error('Lỗi tải posts:', error)
  } finally {
    loading.value = false
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
watch(() => route.query, (q) => {
  const page = q.page ? Number(q.page) : 1
  const cat = (q.category === undefined || q.category === '') ? null : Number(q.category)
  const sort = (typeof q.sort === 'string' && q.sort !== '') ? q.sort : 'hot'
  sortSetting.value= sort
  objPagination.value.page = Number.isNaN(page) ? 1 : page
  inputPage.value = objPagination.value.page
  objPagination.value.category = Number.isNaN(cat) ? null : cat
  objPagination.value.sort = sort
}, { immediate: true })

// Tự reload khi đổi category/page
watch(
  [() => objPagination.value.category, () => objPagination.value.page, () => objPagination.value.sort],
  ([newCat, newPage, newSort], [oldCat, oldPage, oldSort]) => {
    let needFetch = false

    if (newCat !== oldCat) {
      clampPage()         // có thể set lại page
      fetchExtras()
      needFetch = true
    }

    // Nếu page thay đổi do người dùng hoặc do clampPage()
    if (newPage !== oldPage || newSort != oldSort) {
      needFetch = true
    }

    if (needFetch) fetchPosts()

  },
  { immediate: true } // tải lần đầu
)
// --- Bài mới & nổi bật ---
async function fetchExtras() {
  console.log("fetchExtras");
  
  loading.value = true
  try {
    const res1 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 1, sort: 'newest', category: objPagination.value.category } })
    latestPost.value = res1.data

    const res2 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 4, sort: 'hot', category: objPagination.value.category } })
    featuredPosts.value = res2.data
  } catch (error) {
    console.error('Lỗi lấy bài nổi bật:', error)
  } finally {
    loading.value = false
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