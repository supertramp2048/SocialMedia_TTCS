<template>
  <div class="min-h-screen bg-white">
    <!-- Header & Category bar (giữ nguyên phần của bạn) -->
    <!-- Header -->
      <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo + Nav -->
            <div class="flex items-center gap-8">
              <router-link to="/" class="flex items-center gap-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0EA5E9" stroke="#0EA5E9" stroke-width="2" stroke-linejoin="round"/>
                  <path d="M2 17L12 22L22 17" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M2 12L12 17L22 12" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span class="text-xl font-bold text-gray-900">spiderum</span>
              </router-link>

              <nav class="hidden md:flex items-center gap-6">
                <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Vườn Học</a>
                <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Nghiên Cứu</a>
                <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Cộng đồng</a>
              </nav>
            </div>

            <!-- Right -->
            <div class="flex items-center gap-4">
              <button class="hidden md:block text-sm text-gray-600 hover:text-gray-900">Liên hệ</button>

              <div class="flex items-center gap-4" v-if="auth.user">
                <button @click="logout" class="hidden md:block text-sm text-gray-600 hover:text-gray-900">Đăng xuất</button>
                <router-link to="/" class="px-4 py-2 bg-sky-500 text-white text-sm rounded-full hover:bg-sky-600 transition-colors">
                  {{ auth.user.name }}
                </router-link>
              </div>

              <div class="flex items-center gap-4" v-else>
                <button class="hidden md:block text-sm text-gray-600 hover:text-gray-900">Đăng ký</button>
                <router-link to="/login" class="px-4 py-2 bg-sky-500 text-white text-sm rounded-full hover:bg-sky-600 transition-colors">
                  Đăng nhập
                </router-link>
              </div>

              <!-- Mobile Menu Button -->
              <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-2" aria-label="Toggle menu">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Mobile Menu -->
        <div v-if="showMobileMenu" class="md:hidden border-t border-gray-200">
          <div class="px-4 py-3 space-y-3">
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Vườn Học</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Nghiên Cứu</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Cộng đồng</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Liên hệ</a>
            <a href="#" class="block text-sm text-gray-600 hover:text-gray-900">Đăng ký</a>
          </div>
        </div>
      </header>
      <!-- Category bar (ADDED) -->
<div class="sticky z-40 bg-white border-b border-gray-200 top-16">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="flex items-center justify-between h-12">
      <nav class="hidden md:flex items-center gap-3">
        <!-- 3 mục đầu -->
        <button
          type="button"
          class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
          @click="goCategory(null,null)"
        >
          Tất cả
        </button>
        <button
          v-for="(category, idx) in visibleCategories"
          :key="category.id ?? idx"
          type="button"
          class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
          @click="goCategory(category.id,category.slug)"
        >
          {{ category.name }}
        </button>

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
            class="absolute left-0 mt-2 w-56 max-h-72 overflow-auto rounded-lg border border-gray-200 bg-white shadow-lg p-2 z-50"
            role="menu"
          >
            <button
              v-for="(category, idx) in overflowCategories"
              :key="category.id ?? `more-${idx}`"
              type="button"
              class="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md"
              @click="goCategory(category.id,category.slug)"
            >
              {{ category.name }}
            </button>
          </div>
        </div>
      </nav>
    </div>
  </div>
</div>

    <!-- Main -->
    <main>
      <slot :posts="posts" :latestPost="latestPost" :featuredPosts="featuredPosts" :pagination="objPagination" :updatePagination="updatePagination" />

      <!-- Pagination Sticky -->
      <!-- Pagination Sticky -->
      <form
        class="sticky bottom-0 z-30 bg-white border-t shadow-md 
              flex justify-center items-center gap-4 px-6 py-3
              max-w-2xl mx-auto rounded-t-lg"
        @submit.prevent="goPage"
      >
        <!-- Nút bên trái -->
        <button
          type="button"
          class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700"
          :disabled="inputPage <= 1 || loading"
          @click="inputPage--; goPage()"
        >
          Trước
        </button>

        <!-- Ô nhập ở giữa -->
        <label class="flex items-center gap-2 text-sm text-gray-700">
          Trang:
          <input
            type="number"
            v-model.number="inputPage"
            min="1"
            :max="totalPages"
            class="w-16 px-2 py-1 border rounded-md text-center"
          />
          / {{ totalPages }}
        </label>

        <!-- Nút bên phải -->
        <button
          type="button"
          class="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md text-sm font-medium text-white disabled:opacity-60"
          :disabled="inputPage >= totalPages || loading"
          @click="inputPage++; goPage()"
        >
          Tiếp
        </button>
      </form>

    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-gray-500 text-sm">
        © 2025 - Spiderum Clone by Huy
      </div>
    </footer>
  </div>
</template>

<script setup lang="js">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { useCategoryStore } from '../../../stores/categories'
import api from "../../../../API/axios"

const auth = useAuthStore()
const categoriesStore = useCategoryStore()
const router = useRouter()
const apiUrl = import.meta.env.VITE_API_BASE

// Dữ liệu hiển thị
const posts = ref({ data: [] })
const latestPost = ref({ data: [] })
const featuredPosts = ref({ data: [] })
// Phân trang
const objPagination = ref({ page: 1, limit: 2, sort: 'hot' })
const inputPage = ref(objPagination.value.page) // <--- thêm biến nhập tạm
const numberOfPost = ref(0)
const totalPages = computed(() => Math.max(1, Math.ceil(numberOfPost.value / objPagination.value.limit)))
const loading = ref(false)

// Hàm lấy bài viết
async function fetchPosts() {
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
function updatePagination(patch) {
  objPagination.value = { ...objPagination.value, ...patch }
}
function goPage() {
  let p = Number(inputPage.value) || 1
  p = Math.min(Math.max(1, p), totalPages.value)
  objPagination.value.page = p
  inputPage.value = p
  fetchPosts()
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

// Tự reload khi đổi category
 watch(() => objPagination.value, () => {
  clampPage()
  fetchPosts()
  fetchExtras()
 },
 { deep: true }
 )

// --- Bài mới & nổi bật ---
async function fetchExtras() {
  try {
    const res1 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 1, sort: 'newest', category:objPagination.value.category } })
    latestPost.value = res1.data

    const res2 = await api.get(`${apiUrl}/api/posts`, { params: { limit: 4, sort: 'hot', category:objPagination.value.category } })
    featuredPosts.value = res2.data
  } catch (error) {
    console.error('Lỗi lấy bài nổi bật:', error)
  }
}

// --- Mounted ---
onMounted(async () => {
  await fetchPosts()
  await fetchExtras()
})

// --- Logout ---
function logout() {
  if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) auth.logout?.()
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

function handleClickOutside(e) {
  if (moreMenuRef.value && !moreMenuRef.value.contains(e.target)) closeMore()
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))

function goCategory(id, slug) {
  // tuỳ route app: chuyển bằng query
  console.log(id);
  console.log(slug);
  objPagination.value.category=id
  objPagination.value.page = 1
  console.log(objPagination.value);
  
}


</script>
