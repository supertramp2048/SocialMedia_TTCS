<script setup lang="js">
import Layout from '../layout/layout.vue'
import { ref, watch, onMounted } from 'vue'
import api from "../../../../API/axios"
import { useRouter } from 'vue-router'
import { defineEmits, defineProps } from 'vue'

const router = useRouter()
const apiUrl = import.meta.env.VITE_API_BASE
// const props = defineProps({
//   pagination: Object // nhận obj từ cha
// })

 // sự kiện gửi lên cha
// function sortNewest(){
//   emit('update:pagination',{...props.pagination, sort:'newest'})
// }
// function sortHot(){
//   emit('update:pagination',{...props.pagination, sort:'hot'})
// }

</script>

<template>
  <Layout v-slot="{ posts, latestPost, featuredPosts, pagination, updatePagination }">
    <!-- Hero Section -->
    <section class="relative bg-gradient-to-br from-sky-50 via-blue-50 to-sky-100 overflow-hidden">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Left Content -->
          <div class="space-y-6 text-center lg:text-left">
            <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Góc nhìn đa chiều của thế hệ trẻ Việt Nam
            </h1>
            <div class="space-y-2">
              <p class="text-lg md:text-xl text-gray-700">
                Viết - Chia sẻ - Kết nối - Chiêm nghiệm
              </p>
              <p class="text-base md:text-lg text-gray-600">
                Tất cả tại Spiderum
              </p>
            </div>
            <button class="px-8 py-3 bg-white text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-md">
              Đăng ký ngay
            </button>
          </div>

          <!-- Right Content - Mascot -->
          <div class="flex justify-center lg:justify-end">
            <div class="relative w-64 h-64 md:w-80 md:h-80">
              <svg viewBox="0 0 200 200" class="w-full h-full">
                <!-- Blue blob background -->
                <ellipse cx="100" cy="140" rx="80" ry="60" fill="#7DD3FC" opacity="0.3"/>
                
                <!-- Mascot body -->
                <circle cx="100" cy="100" r="60" fill="#0EA5E9"/>
                
                <!-- Eyes -->
                <ellipse cx="85" cy="90" rx="12" ry="16" fill="white"/>
                <ellipse cx="115" cy="90" rx="12" ry="16" fill="white"/>
                <circle cx="87" cy="92" r="6" fill="#1e293b"/>
                <circle cx="117" cy="92" r="6" fill="#1e293b"/>
                <circle cx="89" cy="90" r="3" fill="white"/>
                <circle cx="119" cy="90" r="3" fill="white"/>
                
                <!-- Smile -->
                <path d="M 80 110 Q 100 120 120 110" stroke="#1e293b" stroke-width="3" fill="none" stroke-linecap="round"/>
                
                <!-- Arms -->
                <ellipse cx="50" cy="110" rx="8" ry="20" fill="#0EA5E9"/>
                <ellipse cx="150" cy="110" rx="8" ry="20" fill="#0EA5E9"/>
                
                <!-- Legs -->
                <ellipse cx="85" cy="160" rx="12" ry="8" fill="#0EA5E9"/>
                <ellipse cx="115" cy="160" rx="12" ry="8" fill="#0EA5E9"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating Plus Button -->
      <button class="absolute left-4 bottom-20 md:bottom-32 w-12 h-12 md:w-14 md:h-14 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sky-700 transition-colors">
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>

      <!-- Decorative circles -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-sky-200 rounded-full opacity-20 blur-2xl"></div>
      <div class="absolute bottom-10 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
    </section>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div class="grid lg:grid-cols-3 gap-8">
        <!-- Left Column - Main Content -->
        <div class="lg:col-span-2 space-y-8">
          <!-- Featured Posts Section -->
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">Mới nhất trên Spiderum</h2>
              <router-link to="/posts" class="text-sm text-gray-500 hover:text-gray-700">Xem tất cả →</router-link>
            </div>
            
            <div class="space-y-6">
              <div v-for="post in latestPost.data" :key="post.id" 
                   class="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2">
                <img :src="post.image" :alt="post.title" 
                     class="w-full sm:w-48 h-40 object-cover rounded-lg flex-shrink-0"/>
                <div class="flex-1 space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 hover:text-sky-600 cursor-pointer line-clamp-2">
                    {{ post.title }}
                  </h3>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <img
                        :src="post.author?.avatar || AVATAR_FALLBACK"
                        alt="avatar"
                        class="w-5 h-5 rounded-full object-cover"
                        loading="lazy"
                      />
                      {{ post.author.name || 'Ẩn sĩ'}}
                    </span>
                    <span class="flex items-center gap-1">
                      comment
                      {{ post.comments_count}}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" :class="{'text-red-500': post.user_vote == 1}" v-if() fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      </svg>
                      {{ post.vote_score}}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Xem tất cả →</a>
            </div>
            
            <div class="grid sm:grid-cols-2 gap-6">
              <div v-for="article in featuredPosts.data" :key="article.id" 
                   class="group cursor-pointer">
                <div class="mb-3 rounded-lg overflow-hidden">
                  <img :src="article.image" :alt="article.title" 
                       class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-sky-600 line-clamp-2 mb-2">
                  {{ article.title }}
                </h3>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <img
                        :src="article.author?.avatar || AVATAR_FALLBACK"
                        alt="avatar"
                        class="w-5 h-5 rounded-full object-cover"
                        loading="lazy"
                      />
                  <span>{{ article.author.name }}</span>
                  <span>{{ article.comments_count }} comment</span>
                  <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" :class="{'text-red-500': article.user_vote == 1}" v-if() fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      </svg>
                      {{ article.vote_score}}
                  </span>
                </div>
              </div>
            </div>
            <div class="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg overflow-hidden">
            <div class="p-8 text-center text-white">
              <h3 class="text-2xl md:text-3xl font-bold mb-2">THÁNG 9</h3>
              <p class="text-xl md:text-2xl mb-4">BACK TO SCHOOL</p>
              <p class="text-sm opacity-90">Khuyến mãi đặc biệt trong tháng này</p>
            </div>
          </div>

          <!-- lua chon sap xep -->
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex flex-row-reverse justify-between h-12">
              <nav class="hidden md:flex gap-3">
                <!-- 3 mục đầu -->
                <button
                  type="button"
                  class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                  @click="updatePagination({ sort:'newest', page:1 })"
                >
                  Mới nhất
                </button>

                <button
                  type="button"
                  class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
                  @click="updatePagination({ sort:'hot', page:1 })"
                >
                  Thịnh hành
                </button>
              </nav>
            </div>
          </div>
          <!-- // tất cả post có phân trang -->
          <div class="grid sm:grid-cols-2 gap-6">
              <div v-for="article in posts.data" :key="article.id" 
                   class="group cursor-pointer">
                <div class="mb-3 rounded-lg overflow-hidden">
                  <img :src="article.image" :alt="article.title" 
                       class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-sky-600 line-clamp-2 mb-2">
                  {{ article.title }}
                </h3>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <img
                        :src="article.author?.avatar || AVATAR_FALLBACK"
                        alt="avatar"
                        class="w-5 h-5 rounded-full object-cover"
                        loading="lazy"
                      />
                  <span>{{ article.author.name }}</span>
                  <span>{{ article.comments_count }} comment</span>
                  <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" :class="{'text-red-500': article.user_vote == 1}" v-if() fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      </svg>
                      {{ article.vote_score}}
                  </span>
                </div>
              </div>
            </div>
          </section>

        </div>

        <!-- <--Right Sidebar -->
        <div class="space-y-8">
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
                <circle cx="50" cy="50" r="40" fill="#0EA5E9"/>
                <ellipse cx="40" cy="45" rx="6" ry="8" fill="white"/>
                <ellipse cx="60" cy="45" rx="6" ry="8" fill="white"/>
                <circle cx="41" cy="46" r="3" fill="#1e293b"/>
                <circle cx="61" cy="46" r="3" fill="#1e293b"/>
                <path d="M 35 55 Q 50 65 65 55" stroke="#1e293b" stroke-width="2" fill="none" stroke-linecap="round"/>
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900 mb-2">CÁC BÀI VIẾT MỚI BẬT</h3>
            <p class="text-sm text-gray-600 mb-4">
              BẮN KHÔNG NẰM NỔI LỚI
            </p>
            <p class="text-xs text-gray-500 mb-4">
              Thứ bạn theo giỏi lúc Spiderum và nhận dòng cập nhật khác, thông báo dựa của chúng tôi để không bỏ lỡ bởi!
            </p>
            <input type="email" placeholder="Nhập email của bạn..." 
                   class="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
            <button class="w-full px-4 py-2 bg-sky-500 text-white text-sm font-medium rounded-lg hover:bg-sky-600 transition-colors">
              ĐĂNG KÝ
            </button>
          </section>

          <!-- App Download -->
          <section class="text-center">
            <div class="bg-gradient-to-r from-orange-400 to-pink-500 rounded-lg p-6 mb-4">
              <h3 class="text-white text-xl font-bold mb-2">THÁNG 9</h3>
              <p class="text-white text-lg">BACK TO SCHOOL</p>
            </div>
            <div class="flex gap-3 justify-center">
              <a href="#" class="inline-block">
                <img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-example-alternate.svg" 
                     alt="Download on App Store" class="h-10"/>
              </a>
              <a href="#" class="inline-block">
                <img src="https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png" 
                     alt="Get it on Google Play" class="h-10"/>
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  </Layout>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
