<template>
  <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
    <!-- Bên trái: summary, ẩn trên mobile -->
    <div class="hidden sm:block">
      <p class="text-sm text-gray-700">
        Đang hiện từ bản ghi
        <span class="font-medium">{{ from }}</span>
        đến
        <span class="font-medium">{{ to }}</span>
        trên tổng
        <span class="font-medium">{{ total }}</span>
        bản ghi
      </p>
    </div>

    <!-- Bên phải: pagination, dùng chung cho cả mobile & desktop -->
    <div class="flex-1 flex items-center justify-between sm:justify-end">
      <!-- Summary rút gọn cho mobile -->
      <div class="sm:hidden text-xs text-gray-600 mr-2">
        {{ from }}–{{ to }} / {{ total }}
      </div>

      <nav
        class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
        aria-label="Pagination"
      >
        <!-- Prev -->
        <button
          @click="goPrev"
          :disabled="currentPage === 1"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon class="h-5 w-5" />
        </button>

        <!-- < 6 trang: hiện list số -->
        <template v-if="lastPage < 6">
          <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            class="relative inline-flex items-center px-3 sm:px-4 py-2 border text-xs sm:text-sm font-medium"
            :class="
              page === currentPage
                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
            "
          >
            {{ page }}
          </button>
        </template>

        <!-- >= 6 trang: input + / lastPage (áp dụng cho cả mobile & desktop) -->
        <template v-else>
          <div
            class="relative inline-flex items-center px-2 sm:px-3 py-1 border border-gray-300 bg-white text-xs sm:text-sm"
          >
            <span class="mr-1 sm:mr-2 text-gray-500">Page</span>
            <input
              type="number"
              v-model.number="inputPage"
              @keyup.enter="goToInputPage"
              @blur="goToInputPage"
              :min="1"
              :max="lastPage"
              class="w-12 sm:w-16 border border-gray-300 rounded-md text-center text-xs sm:text-sm
                     focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
            <span class="ml-1 sm:ml-2 text-gray-500">/ {{ lastPage }}</span>
          </div>
        </template>

        <!-- Next -->
        <button
          @click="goNext"
          :disabled="currentPage === lastPage"
          class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRightIcon class="h-5 w-5" />
        </button>
      </nav>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
  },
  lastPage: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  from: {
    type: Number,
    required: true,
  },
  to: {
    type: Number,
    required: true,
  },
})

const emit = defineEmits(['page-change'])

const visiblePages = computed(() => {
  const pages = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.lastPage, start + maxVisible - 1)

  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }

  for (let i = start; i <= end; i++) {
    pages.push(i)
  }

  return pages
})

// input dùng cho mode >= 6 trang
const inputPage = ref(props.currentPage)

watch(
  () => props.currentPage,
  (val) => {
    inputPage.value = val
  }
)

const goToPage = (page) => {
  if (page < 1 || page > props.lastPage || page === props.currentPage) return
  emit('page-change', page)
}

const goPrev = () => {
  if (props.currentPage > 1) {
    emit('page-change', props.currentPage - 1)
  }
}

const goNext = () => {
  if (props.currentPage < props.lastPage) {
    emit('page-change', props.currentPage + 1)
  }
}

const goToInputPage = () => {
  let page = Number(inputPage.value) || 1
  if (page < 1) page = 1
  if (page > props.lastPage) page = props.lastPage

  if (page !== props.currentPage) {
    emit('page-change', page)
  } else {
    inputPage.value = page
  }
}
</script>
