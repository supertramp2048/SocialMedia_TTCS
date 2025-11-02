<template>
  <div class="max-w-[875px] mx-auto px-4 mb-16">
    <h2 class="font-bold text-sm text-text-primary mb-4">Bài viết nổi bật khác</h2>

    <div class="relative">
      <!-- Nút Prev -->
      <button
        class="flex absolute left-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:shadow-md border text-gray-700 disabled:opacity-40"
        :disabled="isAtStart"
        @click="goPrev"
        aria-label="Prev"
      >
        <i class="fa-solid fa-arrow-left"></i>
      </button>

      <!-- Track cuộn ngang -->
      <div
        ref="viewport"
        class="overflow-x-auto scroll-smooth snap-x snap-mandatory border border-border-lighter rounded"
        @scroll.passive="onScroll"
        tabindex="0"
        @keydown.left.prevent="goPrev"
        @keydown.right.prevent="goNext"
      >
        <div ref="track" class="flex gap-6 p-8 min-w-max">
          <router-link
            v-for="post in postsForRender"
            :key="post.id"
            class="w-64 flex-shrink-0 snap-start"
            :to="{ path: '/bai-dang/', query: { id:post.id } }"
          >
            <img
              :src="post.thumbnail_url"
              :alt="post.title || 'Related Article'"
              class="w-full h-40 object-cover rounded mb-4"
            />
            <p class="text-xs uppercase text-text-primary mb-2">
              {{ post.category?.name || 'Danh mục' }}
            </p>
            <h3 class="text-base font-bold font-montserrat text-text-primary leading-6 mb-2 line-clamp-2">
              {{ post.title || 'Không có tiêu đề' }}
            </h3>
            <p class="text-xs font-semibold text-text-primary">
              {{ post.author?.name || 'Không rõ tác giả' }}
            </p>
          </router-link>
        </div>
      </div>

      <!-- Nút Next -->
      <button
        class="flex absolute right-2 top-1/2 -translate-y-1/2 z-10 items-center justify-center w-9 h-9 rounded-full bg-white shadow hover:shadow-md border text-gray-700 disabled:opacity-40"
        :disabled="isAtEnd"
        @click="goNext"
        aria-label="Next"
      >
        <i class="fa-solid fa-arrow-right"></i>
      </button>
    </div>

    <!-- Dots -->
    <div class="flex items-center justify-center gap-2 mt-4" v-if="pageCount > 1">
      <button
        v-for="i in pageCount"
        :key="i"
        class="w-2.5 h-2.5 rounded-full"
        :class="i - 1 === currentPage ? 'bg-sky-500' : 'bg-gray-300 hover:bg-gray-400'"
        @click="goToPage(i - 1)"
        :aria-label="`Page ${i}`"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import api from '../../API/axios'

/**
 * Props:
 * - categoryId: danh mục để lấy bài gợi ý
 * - currentId: id bài hiện tại (để filter bỏ khỏi gợi ý)
 */
const props = defineProps({
  categoryId: { type: [Number, String], required: true },
  currentId: { type: [Number, String], default: null },
  // Số card hiển thị 1 trang (gợi ý: 1 mobile, 2 tablet, 3 desktop — sẽ auto tính)
  minCardWidth: { type: Number, default: 256 }, // px, ~ w-64
  gap: { type: Number, default: 24 } // px, ~ gap-6
})

const rawPosts = ref([])       // dữ liệu thô từ API
const postsForRender = computed(() => {
  const arr = normalizeArray(rawPosts.value)
  if (props.currentId != null) {
    const cur = Number(props.currentId)
    return arr.filter(item => Number(item?.id) !== cur)
  }
  return arr
})

// --- Carousel state ---
const viewport = ref(null)
const track = ref(null)
const cardsPerView = ref(1)
const currentPage = ref(0)
const totalCards = computed(() => postsForRender.value.length)
const pageCount = computed(() => {
  if (!cardsPerView.value) return 1
  return Math.max(1, Math.ceil(totalCards.value / cardsPerView.value))
})
const isAtStart = computed(() => currentPage.value <= 0)
const isAtEnd = computed(() => currentPage.value >= pageCount.value - 1)

// --- Fetch data khi đổi category ---
watch(
  () => props.categoryId,
  async (newCate) => {
    if (!newCate) return
    currentPage.value = 0
    await fetchSuggestedPosts(newCate)
    await nextTick()
    measure()
    // Snap về đầu trang
    goToPage(0)
  },
  { immediate: true }
)

async function fetchSuggestedPosts (id) {
  try {
    const res = await api.get('/api/posts', {
      params: { limit: 20, sort: 'hot', category: id }
    })
    // chuẩn hoá để luôn là []
    rawPosts.value = normalizeArray(res?.data)
  } catch (e) {
    console.error('Lỗi lấy bài gợi ý:', e)
    rawPosts.value = []
  }
}

function normalizeArray (payload) {
  return Array.isArray(payload) ? payload
    : Array.isArray(payload?.data) ? payload.data
    : []
}

// --- Tính cardsPerView dựa theo viewport width và card width ---
let resizeObs
onMounted(() => {
  measure()
  if ('ResizeObserver' in window) {
    resizeObs = new ResizeObserver(() => {
      measure()
      clampPage()
    })
    viewport.value && resizeObs.observe(viewport.value)
  } else {
    window.addEventListener('resize', onResize, { passive: true })
  }
})
onBeforeUnmount(() => {
  resizeObs?.disconnect?.()
  window.removeEventListener('resize', onResize)
})

function onResize () {
  measure()
  clampPage()
}

function measure () {
  const vp = viewport.value
  const tr = track.value
  if (!vp || !tr) return

  // Lấy card đầu để đo width (w-64 = 256px). Cộng thêm gap.
  const firstCard = tr.querySelector('.w-64')
  const cardW = firstCard ? firstCard.getBoundingClientRect().width : props.minCardWidth
  const vpW = vp.getBoundingClientRect().width
  const perView = Math.max(1, Math.floor((vpW + props.gap) / (cardW + props.gap)))
  cardsPerView.value = perView
}

function clampPage () {
  if (currentPage.value > pageCount.value - 1) {
    currentPage.value = Math.max(0, pageCount.value - 1)
    goToPage(currentPage.value)
  }
}

function pageWidthPx () {
  const vp = viewport.value
  if (!vp) return 0
  return vp.getBoundingClientRect().width
}

function goPrev () {
  if (isAtStart.value) return
  goToPage(currentPage.value - 1)
}
function goNext () {
  if (isAtEnd.value) return
  goToPage(currentPage.value + 1)
}
function goToPage (pageIdx) {
  const vp = viewport.value
  if (!vp) return
  currentPage.value = Math.min(Math.max(0, pageIdx), pageCount.value - 1)
  const x = currentPage.value * pageWidthPx()
  vp.scrollTo({ left: x, behavior: 'smooth' })
}

function onScroll () {
  // Cập nhật currentPage dựa theo scrollLeft
  const vp = viewport.value
  if (!vp) return
  const w = pageWidthPx()
  if (w <= 0) return
  const p = Math.round(vp.scrollLeft / w)
  if (p !== currentPage.value) currentPage.value = p
}
</script>

<style scoped>
/* Nếu muốn thêm animation cho line-clamp, có thể dùng plugin tailwind line-clamp */
</style>
