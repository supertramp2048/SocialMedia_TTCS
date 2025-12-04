<template>
  <div class="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
    <UserDiv :user="post.data?.author" :date="null"></UserDiv>
    <div v-if="post?.data?.author?.id != auth?.user?.id" class="w-full sm:w-auto">
      <button
        @click="handleFollow"
        v-if="post?.data?.is_following_author == false"
        :disabled="isLoading"
        :aria-busy="isLoading"
        class="relative flex items-center justify-center gap-2 btnEffect w-full sm:w-auto px-4 py-2.5 rounded border border-[#E3E3E3] text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none">
        <span v-if="!isLoading">Theo dõi</span>
        <span v-else class="inline-flex items-center" aria-live="polite">
          <span class="mr-2">Đang theo dõi</span>
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        </span>
      </button>
      <button
        v-else-if="post?.data?.is_following_author == true"
        @click="handleFollow"
        :disabled="isLoading"
        :aria-busy="isLoading"
        class="relative flex items-center justify-center gap-2 btnEffect w-full sm:w-auto bg-sky-300 px-4 py-2.5 rounded border border-[#E3E3E3] text-sm text-text-primary disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none">
        <span v-if="!isLoading"><i class="fa-solid fa-check pr-1"></i> Đã Theo dõi</span>
        <span v-else class="inline-flex items-center" aria-live="polite">
          <span class="mr-2">Đang xử lý</span>
          <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="js">
import { useAuthStore } from '@/stores/auth'
import UserDiv from '../userDiv.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  isLoading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['follow'])

const auth = useAuthStore()

function handleFollow() {
  emit('follow')
}
</script>

