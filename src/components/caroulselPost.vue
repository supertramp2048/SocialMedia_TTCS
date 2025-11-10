<template>
  <!-- Section wrapper -->
  <section 
    class=" max-w-[875px] mx-auto px-0 sm:px-6 mb-20 sm:mb-24"
    aria-labelledby="featured-posts-heading"
  >

    <!-- Carousel container -->
    <div class="relative group">
      <!-- Nút Previous -->
      <button
        class="
          absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 z-20
          flex items-center justify-center
          w-10 h-10 sm:w-12 sm:h-12
          rounded-full
          bg-white/95
          backdrop-blur-sm
          shadow-lg hover:shadow-xl
          border border-gray-200
          text-gray-700
          transition-all duration-300 ease-out
          hover:scale-110 hover:bg-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
          disabled:opacity-0 disabled:pointer-events-none
          opacity-0 group-hover:opacity-100 sm:opacity-100
        "
        :disabled="isAtStart"
        @click="goPrev"
        aria-label="Xem bài viết trước"
        aria-controls="carousel-viewport"
        :aria-disabled="isAtStart"
      >
        <i class="fa-solid fa-chevron-left text-sm sm:text-base"></i>
      </button>

      <!-- Viewport -->
      <div
        id="carousel-viewport"
        ref="viewport"
        role="region"
        aria-label="Carousel bài viết nổi bật"
        aria-live="polite"
        class="
          carousel-viewport
          overflow-x-auto scroll-smooth snap-x snap-mandatory
          rounded-2xl
          border border-gray-200
          bg-gradient-to-br from-gray-50 to-white
        "
        @scroll.passive="onScroll"
        tabindex="0"
        @keydown.left.prevent="goPrev"
        @keydown.right.prevent="goNext"
      >
        <!-- Track -->
        <div 
          ref="track" 
          class="flex gap-4 sm:gap-6 p-0 sm:p-8 "
        >
          <!-- Empty state -->
          <div 
            v-if="!posts || posts.length === 0"
            class="w-full text-center py-12 text-gray-500"
          >
            <i class="fa-solid fa-inbox text-4xl mb-4 opacity-50"></i>
            <p class="text-sm">Chưa có bài viết nào</p>
          </div>

          <!-- Card bài viết -->
          <router-link
            v-for="post in posts"
            :key="post.id"
            class="
              card-post
              w-full sm:w-72 flex-shrink-0 snap-start
              group/card
              block
              rounded-2xl
              bg-white
              border border-gray-200
              shadow-md hover:shadow-2xl
              transition-all duration-300 ease-out
              hover:-translate-y-1
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
              overflow-hidden
            "
            :to="{ path: '/bai-dang/', query: { id: post.id } }"
            :aria-label="`Đọc bài viết: ${post.title || 'Không có tiêu đề'}`"
          >
            <!-- Ảnh thumbnail -->
            <div class="relative overflow-hidden rounded-t-2xl aspect-[16/10] bg-gray-200">
              <img
                v-if="post.thumbnail_url"
                :src="post.thumbnail_url"
                :alt="post.title || 'Article thumbnail'"
                class="
                  w-full h-full object-cover
                  transition-transform duration-500 ease-out
                  group-hover/card:scale-110
                "
                loading="lazy"
                @error="handleImageError"
              />
              <!-- Fallback -->
              <div 
                v-else
                class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200"
              >
                <i class="fa-solid fa-image text-4xl text-gray-400"></i>
              </div>
              
              <!-- Gradient overlay -->
              <div 
                class="
                  absolute inset-0 bg-gradient-to-t from-black/20 to-transparent
                  opacity-0 group-hover/card:opacity-100
                  transition-opacity duration-300
                "
              ></div>
            </div>

            <!-- Nội dung card -->
            <div class="p-5 sm:p-6 space-y-2.5">
              <!-- Danh mục -->
              <p 
                class="
                  text-xs font-semibold uppercase tracking-wider
                  text-sky-600
                  line-clamp-1
                "
              >
                {{ post.category?.name || 'Danh mục' }}
              </p>

              <!-- Tiêu đề -->
              <h3 
                class="
                  text-base sm:text-lg font-bold font-montserrat
                  text-gray-900
                  leading-snug line-clamp-2
                  group-hover/card:text-sky-600
                  transition-colors duration-200
                "
              >
                {{ post.title || 'Không có tiêu đề' }}
              </h3>

              <!-- Tác giả -->
              <!-- <p 
                class="
                  text-xs font-medium
                  text-gray-600
                  flex items-center gap-1.5
                "
              >
                <i class="fa-solid fa-user text-[10px]"></i>
                <span class="line-clamp-1">{{ post.author?.name || 'Không rõ tác giả' }}</span>
              </p> -->
              <SmallUserDiv :user="post.author"></SmallUserDiv>
            </div>
          </router-link>
        </div>
      </div>

      <!-- Nút Next -->
      <button
        class="
          absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 z-20
          flex items-center justify-center
          w-10 h-10 sm:w-12 sm:h-12
          rounded-full
          bg-white/95
          backdrop-blur-sm
          shadow-lg hover:shadow-xl
          border border-gray-200
          text-gray-700
          transition-all duration-300 ease-out
          hover:scale-110 hover:bg-white
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
          disabled:opacity-0 disabled:pointer-events-none
          opacity-0 group-hover:opacity-100 sm:opacity-100
        "
        :disabled="isAtEnd"
        @click="goNext"
        aria-label="Xem bài viết tiếp theo"
        aria-controls="carousel-viewport"
        :aria-disabled="isAtEnd"
      >
        <i class="fa-solid fa-chevron-right text-sm sm:text-base"></i>
      </button>
    </div>

    <!-- Dots -->
    <nav 
      v-if="pageCount > 1"
      class="flex items-center justify-center gap-2 mt-6 sm:mt-8"
      role="tablist"
      aria-label="Điều hướng trang"
    >
      <button
        v-for="i in pageCount"
        :key="i"
        role="tab"
        :aria-label="`Trang ${i}`"
        :aria-selected="i - 1 === currentPage"
        :aria-current="i - 1 === currentPage ? 'page' : undefined"
        class="
          transition-all duration-300 ease-out
          rounded-full
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2
        "
        :class="
          i - 1 === currentPage 
            ? 'w-8 h-2.5 bg-sky-500 scale-110' 
            : 'w-2.5 h-2.5 bg-gray-300 hover:bg-gray-400 hover:scale-125'
        "
        @click="goToPage(i - 1)"
      />
    </nav>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import SmallUserDiv from "../components/smallUserDiv.vue"
const props = defineProps({
  posts: { type: Array, default: () => [] },
  minCardWidth: { type: Number, default: 256 },
  gap: { type: Number, default: 24 }
})

const viewport = ref(null)
const track = ref(null)
const cardsPerView = ref(1)
const currentPage = ref(0)

const totalCards = computed(() => props.posts?.length || 0)
const pageCount = computed(() => Math.max(1, Math.ceil(totalCards.value / cardsPerView.value)))
const isAtStart = computed(() => currentPage.value <= 0)
const isAtEnd = computed(() => currentPage.value >= pageCount.value - 1)

let resizeObs

onMounted(() => {
  nextTick(() => {
    measure()
    setupResizeObserver()
  })
})

onBeforeUnmount(() => {
  resizeObs?.disconnect?.()
  window.removeEventListener('resize', onResize)
})

watch(() => props.posts, async () => {
  await nextTick()
  measure()
  currentPage.value = 0
  goToPage(0)
}, { deep: true })

function setupResizeObserver() {
  if ('ResizeObserver' in window) {
    resizeObs = new ResizeObserver(() => {
      measure()
      clampPage()
    })
    viewport.value && resizeObs.observe(viewport.value)
  } else {
    window.addEventListener('resize', onResize, { passive: true })
  }
}

function onResize() {
  measure()
  clampPage()
}

function measure() {
  const vp = viewport.value
  const tr = track.value
  if (!vp || !tr) return
  const firstCard = tr.querySelector('.card-post')
  const cardW = firstCard ? firstCard.getBoundingClientRect().width : props.minCardWidth
  const vpW = vp.getBoundingClientRect().width
  cardsPerView.value = Math.max(1, Math.floor((vpW + props.gap) / (cardW + props.gap)))
}

function clampPage() {
  if (currentPage.value > pageCount.value - 1) {
    currentPage.value = Math.max(0, pageCount.value - 1)
    goToPage(currentPage.value)
  }
}

function pageWidthPx() {
  return viewport.value?.getBoundingClientRect().width || 0
}

function goPrev() { if (!isAtStart.value) goToPage(currentPage.value - 1) }
function goNext() { if (!isAtEnd.value) goToPage(currentPage.value + 1) }

function goToPage(pageIdx) {
  const vp = viewport.value
  if (!vp) return
  currentPage.value = Math.min(Math.max(0, pageIdx), pageCount.value - 1)
  vp.scrollTo({ left: currentPage.value * pageWidthPx(), behavior: 'smooth' })
}

function onScroll() {
  const vp = viewport.value
  if (!vp) return
  const p = Math.round(vp.scrollLeft / pageWidthPx())
  if (p !== currentPage.value) currentPage.value = p
}

function handleImageError(event) {
  event.target.style.display = 'none'
  const parent = event.target.parentElement
  if (parent) {
    parent.innerHTML = `
      <div class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
        <i class='fa-solid fa-image text-4xl text-gray-400'></i>
      </div>
    `
  }
}
</script>

<style scoped>
.carousel-viewport::-webkit-scrollbar {
  height: 6px;
}
.carousel-viewport::-webkit-scrollbar-track {
  background-color: #f3f4f6;
  border-radius: 9999px;
}
.carousel-viewport::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 9999px;
  transition: background-color 0.2s ease;
}
.carousel-viewport::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
.carousel-viewport {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}
@media (max-width: 640px) {
  .carousel-viewport::-webkit-scrollbar { display: none; }
  .carousel-viewport { scrollbar-width: none; }
}
.card-post { --tw-ring-offset-color: #ffffff; }
@media (prefers-reduced-motion: reduce) {
  * , *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  .carousel-viewport { scroll-behavior: auto; }
}
@media (pointer: coarse) {
  button { min-width: 44px; min-height: 44px; }
}
@media print {
  .carousel-viewport { overflow: visible !important; }
  button, nav { display: none !important; }
  .card-post { page-break-inside: avoid; }
}
</style>
