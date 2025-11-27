<template>
  <Layout>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <!-- Header tìm kiếm -->
      <div class="max-w-7xl flex flex-col mx-auto px-1 sm:px-2 lg:px-3 py-3 md:py-3 justify-center">
        <h1 class="text-3xl mb-2 font-bold">
          Kết quả tìm kiếm cho: 
          <span class="font-bold italic">"{{ search_content }}"</span> 
        </h1>

        <!-- Tab switcher -->
        <div class="w-full border border-gray-400">
          <div class="flex leading-[50px] justify-center">
            <button 
              @click="optionSearch = 'posts'"
              :class="optionSearch == 'posts' ? 'border-b-sky-400 text-black' : 'border-b-transparent text-gray-400'"
              class="mx-2 flex-1 text-xl font-bold btnEffect text-center border-b-4"
            >
              Post
            </button>
            <button 
              @click="optionSearch = 'users'"
              :class="optionSearch == 'users' ? 'border-b-sky-400 text-black' : 'border-b-transparent text-gray-400'"
              class="mx-2 flex-1 text-xl font-bold btnEffect text-center border-b-4"
            >
              User
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div>
      </div>

      <!-- Nội dung kết quả -->
      <div v-else>
        <!-- Hiển thị Posts -->
        <div v-if="optionSearch === 'posts'">
          <GridPost 
            v-if="searchResult?.data?.length > 0"
            :posts="searchResult" 
            :pageLimit="page_limit"
          />
          <div v-else class="py-12">
            <p class="text-center text-gray-500 italic text-lg">
              Không tìm thấy bài viết nào.
            </p>
          </div>
        </div>

        <!-- Hiển thị Users -->
        <div v-else-if="optionSearch === 'users'">
          <UserList 
            v-if="searchResult?.data?.length > 0"
            :users="searchResult.data"
            :pageLimit="page_limit"
          />
          <div v-else class="py-12">
            <p class="text-center text-gray-500 italic text-lg">
              Không tìm thấy người dùng nào.
            </p>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup lang="js">
import Layout from '../layout/layout.vue'
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import api from "../../../../API/axios"
import GridPost from '../../../components/gridPost.vue'
import UserList from '../../../components/UserList.vue'

// Refs
const optionSearch = ref('posts')
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
const loading = ref(false)
const searchResult = ref({ data: [], meta: { total: 0 } })
const search_content = ref('')
const page_limit = ref(1)

// ✅ Hàm fetch dữ liệu dựa trên loại tìm kiếm
async function fetchSearchResults() {
  // Kiểm tra query
  if (!route.query.q) {
    console.warn('Không có query tìm kiếm')
    return
  }

  search_content.value = route.query.q.trim()
  loading.value = true

  try {
    // Xác định endpoint dựa trên optionSearch
    const endpoint = optionSearch.value === 'posts' 
      ? `/api/posts` 
      : `/api/users/search`

    // Gọi API với query params
    const res = await api.get(endpoint, {
      params: route.query
    })

    // Cập nhật kết quả
    searchResult.value = res.data
    
    // Tính số trang (chỉ cho posts)
    if (optionSearch.value === 'posts' && res.data.meta) {
      const limit = parseInt(route.query.limit) || 10
      page_limit.value = Math.ceil(res.data.meta.total / limit)
    }
    else if (optionSearch.value === 'users' && res.data.meta) {
      const limit = parseInt(route.query.limit) || 10
      page_limit.value = Math.ceil(res.data.meta.total / limit)
    }
    console.log('✅ Kết quả:', res)

  } catch (error) {
    console.error('❌ Lỗi khi tìm kiếm:', error)
    
    // Reset kết quả nếu lỗi
    searchResult.value = { data: [], meta: { total: 0 } }
    
    // Hiển thị thông báo lỗi nếu cần
    if (error.response?.status === 404) {
      console.log('Không tìm thấy kết quả')
    }
  } finally {
    loading.value = false
  }
}

// ✅ Watch để refetch khi đổi tab hoặc query thay đổi
watch(
  [optionSearch, () => route.query],
  async ([newOption, newQuery]) => {
    
    // Chỉ fetch nếu có query search
    if (newQuery?.q) {
      await fetchSearchResults()
    }
  },
  { 
    immediate: true,  // Fetch ngay khi component mount
    deep: true        // Bắt thay đổi sâu trong route.query
  }
)
</script>

<style scoped>
/* Animation cho nút tab */
.btnEffect {
  transition: all 0.3s ease;
}

.btnEffect:hover {
  transform: translateY(-2px);
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}
</style>