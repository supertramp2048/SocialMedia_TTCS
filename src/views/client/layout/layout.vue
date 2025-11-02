<template>
  <loader :show="globalLoading" />
  <div class="min-h-screen bg-white">
    <!-- Header & Category bar (giữ nguyên phần của bạn) -->
    <!-- Header -->
      <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div>
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
              <button @click="showFormSearch()" class="bg-sky-300 rounded-2xl pt-0.5 pb-0.5 pl-3 pr-3"> <i class="fa-solid fa-magnifying-glass"> </i> Tìm kiếm</button>
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

        <slot        />

      <!-- Pagination Sticky -->
      <!-- Pagination Sticky -->

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
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../../stores/auth'
import { useCategoryStore } from '../../../stores/categories'
import api from "../../../../API/axios"
// loader cho trang
import { globalLoading } from '../../../../API/axios'
import loader from '../../../components/loader.vue'
//-------------
const auth = useAuthStore()
const categoriesStore = useCategoryStore()
const router = useRouter()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
// hien thi cate dang chon
const chossenCate = ref(null)
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

function handleClickOutside(e) {
  if (moreMenuRef.value && !moreMenuRef.value.contains(e.target)) closeMore()
}
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))


</script>
