<template>
  <div class="w-full">
    <!-- Grid danh sách user -->
    <div 
      v-if="users && users.length > 0" 
      class="grid grid-cols-1 sm:grid-cols-2 gap-4"
    >
      <button
        v-for="user in users"
        :key="user.id"
        @click="goProfilePage(user.id, user.name)"
        class="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-sky-400 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <!-- Avatar -->
        <div class="flex-shrink-0">
          <img
            :src="user.avatar || user.avatar_url || 'https://via.placeholder.com/80'"
            :alt="user.name || user.username"
            class="w-16 h-16 rounded-full object-cover border-2 border-gray-100 group-hover:border-sky-200 transition-colors"
          />
        </div>

        <!-- Thông tin user -->
        <div class="flex-1 min-w-0">
          <h3 class="font-semibold text-gray-900 text-lg truncate group-hover:text-sky-600 transition-colors">
            {{ user.name || user.username || 'Unknown User' }}
          </h3>
          
          <!-- Thông tin phụ (nếu có) -->
          <p 
            v-if="user.email || user.bio" 
            class="text-sm text-gray-500 truncate mt-1"
          >
            {{ user.email || user.bio }}
          </p>

          <!-- Số bài viết (nếu có) -->
          <div 
            v-if="user.posts_count !== undefined" 
            class="flex items-center gap-2 mt-2 text-xs text-gray-400"
          >
            <svg 
              class="w-4 h-4" 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd"/>
            </svg>
            <span>{{ user.posts_count }} bài viết</span>
          </div>
        </div>

        <!-- Icon mũi tên -->
        <div class="flex-shrink-0">
          <svg 
            class="w-5 h-5 text-gray-400 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
          </svg>
        </div>
      </button>
    </div>

    <!-- Trạng thái rỗng -->
    <div 
      v-else 
      class="flex flex-col items-center justify-center py-12 px-4"
    >
      <svg 
        class="w-16 h-16 text-gray-300 mb-4" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"/>
      </svg>
      <p class="text-center text-gray-500 text-lg font-medium">
        Không có user nào
      </p>
      <p class="text-center text-gray-400 text-sm mt-2">
        Danh sách người dùng đang trống
      </p>
    </div>
  </div>
</template>

<script setup lang="js">
import {useRoute, useRouter } from 'vue-router'
import { defineProps } from 'vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  users: {
    type: Array,
    default: () => [],
    validator: (value) => {
      // Validate rằng mỗi user phải có ít nhất id
      return value.every(user => user && typeof user.id !== 'undefined')
    }
  }
})

function goProfilePage(id, name){
        router.push({
            path: `/nguoi-dung/${name}`,
            query: {
                user_id: id,
                page: 1,
                limit: 2,
                sort: 'hot'
            }
        })
    }  
</script>

<style scoped>
/* Thêm animation mượt hơn */
.group:hover img {
  transform: scale(1.05);
}

/* Responsive cho mobile nhỏ */
@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>