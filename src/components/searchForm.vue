<template>
  <form class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-border-lighter pb-6 "
        @submit.prevent="sendSearchForm">
    <div class="relative w-full group">
    <div class="flex">
        <button 
        type="button"
        @click="hiddenSearchForm"
        class="text-3xl px-3 py-1 font-bold hover:bg-sky-200 rounded-2xl">
        <i class="fa-solid fa-arrow-left"></i>
        </button>
        <input
        type="text"
        class="leading-[80px] w-full text-lg text-black border-none focus:outline-none"
        v-model="search_content"
        placeholder="Tìm kiếm bài viết hoặc tên tác giả"
        />
        <button @click="sendSearchForm" class="text-3xl px-3 py-1 font-bold hover:bg-sky-200 rounded-2xl">
        <i class="fa-solid fa-magnifying-glass"></i>
        </button>
    </div>

    <span class="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gray-200"></span>
    <span
        class="pointer-events-none absolute left-0 bottom-0 h-[2px] w-0 bg-black
            transition-all duration-300 ease-out group-focus-within:w-full">
    </span>
    </div>

  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const search_content = ref('')
const emit = defineEmits(['hiddenSearchForm'])
function hiddenSearchForm(){
    emit('hiddenSearchForm', false)
}
function sendSearchForm () {
  const q = (search_content.value || '').trim()
  if (!q) return
  // đổi URL mà không reload trang
  router.push({ path: '/tim-kiem', query: { page: 1, limit:5, q } })
}
</script>
