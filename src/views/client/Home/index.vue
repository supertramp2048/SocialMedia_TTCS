<script setup lang="js">
import { ref } from 'vue'
const featuredPosts = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
    title: 'Nhìn vào một bức ảnh "con bạn" chụp về Chuyện về các bộ tộc Việt Nam Trang và Hà Giang',
    author: 'daydaymoon',
    views: 65,
    likes: 3,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=400&h=250&fit=crop',
    title: 'Sống thử đã là thủy chung lục hay không? Thảo luận của các bạn có ai qua giai đoạn này chưa?',
    author: 'Nguyen Van',
    views: 45,
    likes: 5
  }
]

const videos = [
  {
    id: 1,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300&h=200&fit=crop',
    title: 'Socrates - Trực giác triết học làm nên bậc thầy của nhân loại | Chuỗi triết học...',
    author: 'Spiderum',
    views: 1200
  },
  {
    id: 2,
    thumbnail: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&h=200&fit=crop',
    title: '20 LỢI ÍCH TỪ 10 BÀI HỌC ĐẾN TỪ 400 CUỐN SÁCH - Hành Cơ là gì?',
    author: 'Spiderum',
    views: 856
  },
  {
    id: 3,
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=300&h=200&fit=crop',
    title: 'Điều gì xảy ra nếu bạn đều đảm bảo RẰNG hành trình ấy?',
    author: 'Spiderum',
    views: 654
  },
  {
    id: 4,
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=300&h=200&fit=crop',
    title: 'Lỡ CÔNG LỖNG sẽ xây dựng một bộ nhà là KHÌ NHÌN XUỐNG chúng ta?',
    author: 'Spiderum',
    views: 432
  }
]

const latestArticles = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=150&fit=crop',
    title: 'Lưỡng tính chất người và lòng tin chuyện nghề nghiệp',
    author: 'Thiên Ấn muội',
    views: 23
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1505682634904-d7c8d95cdc50?w=200&h=150&fit=crop',
    title: '"Mẹ muốn cho bé" - Tâm lý Wildscreen\" và luyện mày...',
    author: 'Vidéo Ấnh muội',
    views: 18
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=200&h=150&fit=crop',
    title: 'Công xử tâm học và khủng long người xưa kể hậu...',
    author: '#a.tammuodi',
    views: 34
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=200&h=150&fit=crop',
    title: 'Nó thực nguyên mẫu đức Việt Nam "Sáu chi"',
    author: '#kakaemudude',
    views: 45
  }
]

const categories = [
  'Quan điểm - Tranh luận',
  'Khoa học',
  'Bút ký - Nhật ký',
  'Tản mạn',
  'Văn học',
  'Game',
  'Review',
  'Chuyện bên lề',
  'Lịch sử',
  'Tâm lý',
  'Tài chính',
  'Nghệ thuật',
  'Kiến trúc',
  'Cộng đồng Spiderum',
  'Thể thao',
  'Ẩm thực',
  'Du lịch',
  'Công nghệ',
  'Phim',
  'Nhạc',
  'Âm nhạc',
  'Truyện',
  'Khởi nghiệp'
]

const showMobileMenu = ref(false)
</script>

<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <div class="flex items-center gap-8">
            <a href="/" class="flex items-center gap-2">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0EA5E9" stroke="#0EA5E9" stroke-width="2" stroke-linejoin="round"/>
                <path d="M2 17L12 22L22 17" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M2 12L12 17L22 12" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <span class="text-xl font-bold text-gray-900">spiderum</span>
            </a>
            
            <!-- Desktop Navigation -->
            <nav class="hidden md:flex items-center gap-6">
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Vườn Học</a>
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Nghiên Cứu</a>
              <a href="#" class="text-sm text-gray-600 hover:text-gray-900">Cộng đồng</a>
            </nav>
          </div>

          <!-- Right Side Actions -->
          <div class="flex items-center gap-4">
            <button class="hidden md:block text-sm text-gray-600 hover:text-gray-900">Liên hệ</button>
            <button class="hidden md:block text-sm text-gray-600 hover:text-gray-900">Đăng ký</button>
            <router-link to="/login" class="px-4 py-2 bg-sky-500 text-white text-sm rounded-full hover:bg-sky-600 transition-colors">
              Đăng nhập
            </router-link>
            
            <!-- Mobile Menu Button -->
            <button @click="showMobileMenu = !showMobileMenu" class="md:hidden p-2">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Xem tất cả →</a>
            </div>
            
            <div class="space-y-6">
              <div v-for="post in featuredPosts" :key="post.id" 
                   class="flex flex-col sm:flex-row gap-4 pb-6 border-b border-gray-200 hover:bg-gray-50 transition-colors rounded-lg p-2 -m-2">
                <img :src="post.image" :alt="post.title" 
                     class="w-full sm:w-48 h-40 object-cover rounded-lg flex-shrink-0"/>
                <div class="flex-1 space-y-2">
                  <h3 class="text-lg font-semibold text-gray-900 hover:text-sky-600 cursor-pointer line-clamp-2">
                    {{ post.title }}
                  </h3>
                  <div class="flex items-center gap-4 text-sm text-gray-500">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"/>
                      </svg>
                      {{ post.author }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                        <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
                      </svg>
                      {{ post.views }}
                    </span>
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
                      </svg>
                      {{ post.likes }}
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

          <!-- Video Section -->
          <section>
            <h2 class="text-xl md:text-2xl font-bold text-gray-900 mb-6">Video Spiderum</h2>
            <div class="grid sm:grid-cols-2 gap-6">
              <div v-for="video in videos" :key="video.id" 
                   class="group cursor-pointer">
                <div class="relative mb-3 rounded-lg overflow-hidden">
                  <img :src="video.thumbnail" :alt="video.title" 
                       class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                    <div class="w-14 h-14 bg-white bg-opacity-90 rounded-full flex items-center justify-center">
                      <svg class="w-6 h-6 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-sky-600 line-clamp-2 mb-2">
                  {{ video.title }}
                </h3>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <span>{{ video.author }}</span>
                  <span>{{ video.views }} views</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Latest Articles Grid -->
          <section>
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-wide">Nổi bật trong tuần</h2>
              <a href="#" class="text-sm text-gray-500 hover:text-gray-700">Xem tất cả →</a>
            </div>
            
            <div class="grid sm:grid-cols-2 gap-6">
              <div v-for="article in latestArticles" :key="article.id" 
                   class="group cursor-pointer">
                <div class="mb-3 rounded-lg overflow-hidden">
                  <img :src="article.image" :alt="article.title" 
                       class="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"/>
                </div>
                <h3 class="font-semibold text-gray-900 group-hover:text-sky-600 line-clamp-2 mb-2">
                  {{ article.title }}
                </h3>
                <div class="flex items-center gap-3 text-sm text-gray-500">
                  <span>{{ article.author }}</span>
                  <span>{{ article.views }} views</span>
                </div>
              </div>
            </div>
          </section>

          <!-- Banner Ad 2 -->
          <div class="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg overflow-hidden">
            <div class="p-8 text-center text-white">
              <h3 class="text-2xl md:text-3xl font-bold mb-2">VŨ TRỤ CRYPTO</h3>
              <p class="text-lg opacity-90">Tham gia ngay</p>
            </div>
          </div>

          <!-- Pagination -->
          <div class="flex items-center justify-center gap-2 pt-8">
            <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50">
              ←
            </button>
            <button class="w-8 h-8 flex items-center justify-center rounded bg-sky-500 text-white">1</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50">2</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50">3</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50">4</button>
            <span class="px-2">...</span>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50">10</button>
            <button class="w-8 h-8 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50">
              →
            </button>
          </div>
        </div>

        <!-- Right Sidebar -->
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

          <!-- Topics Section -->
          <section>
            <h3 class="text-lg font-bold text-gray-900 mb-4 uppercase tracking-wide">Chủ đề</h3>
            <div class="flex flex-wrap gap-2">
              <a v-for="(category, index) in categories" :key="index"
                 href="#" 
                 class="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-sky-100 hover:text-sky-700 rounded-full transition-colors">
                {{ category }}
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

    <!-- Footer -->
    <footer class="bg-gray-50 border-t border-gray-200 mt-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 class="font-bold text-gray-900 mb-4">Về Spiderum</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-sky-600">Giới thiệu</a></li>
              <li><a href="#" class="hover:text-sky-600">Điều khoản</a></li>
              <li><a href="#" class="hover:text-sky-600">Bảo mật</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-4">Hỗ trợ</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-sky-600">Liên hệ</a></li>
              <li><a href="#" class="hover:text-sky-600">Hướng dẫn</a></li>
              <li><a href="#" class="hover:text-sky-600">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-4">Cộng đồng</h4>
            <ul class="space-y-2 text-sm text-gray-600">
              <li><a href="#" class="hover:text-sky-600">Diễn đàn</a></li>
              <li><a href="#" class="hover:text-sky-600">Sự kiện</a></li>
              <li><a href="#" class="hover:text-sky-600">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-bold text-gray-900 mb-4">Theo dõi</h4>
            <div class="flex gap-3">
              <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-sky-500 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </a>
              <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-sky-500 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a href="#" class="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 hover:bg-sky-500 hover:text-white transition-colors">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
        
        <div class="border-t border-gray-200 pt-8 text-center">
          <div class="flex items-center justify-center gap-2 mb-4">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#0EA5E9" stroke="#0EA5E9" stroke-width="2" stroke-linejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="#0EA5E9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="font-bold text-gray-900">spiderum</span>
          </div>
          <p class="text-sm text-gray-500">
            © 2024 - Bản quyền thuộc Spiderum
          </p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
