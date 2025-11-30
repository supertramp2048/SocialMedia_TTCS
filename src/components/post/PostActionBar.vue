<template>
  <div class="mt-3 flex justify-between border-b border-border-lighter mb-6">
    <div class="flex items-center gap-4 py-6">
      <div class="flex items-center gap-2">
        <!-- nút upvote -->
        <button @click="handleUpvote">
          <svg
            class="w-8 h-8 transition-colors duration-200"
            :class="{
              'fill-sky-500': post?.data?.user_vote === 1,
              'fill-gray-400 hover:fill-sky-400': post?.data?.user_vote !== 1
            }"
            viewBox="0 0 18 18"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M8.80974 5.27744L3.18474 14.294H14.4761L8.80974 5.27744ZM8.80974 1.92725L17.6609 16.0725H0L8.80974 1.92725Z" />
          </svg>
        </button>
        <span class="font-semibold text-base">
          {{ post?.data?.vote_score > 0 ? post.data.vote_score : 0 }}
        </span>
      </div>
      <!-- nút downvote -->
      <button @click="handleDownvote">
        <svg
          class="w-8 h-8 transition-colors duration-200"
          :class="{
            'fill-red-500': post?.data?.user_vote === -1,
            'fill-gray-400 hover:fill-red-400': post?.data?.user_vote !== -1
          }"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.19027 12.7223L14.8153 3.70574H3.5239L9.19027 12.7223ZM9.19027 16.0725L0.339157 1.92725L18 1.92725L9.19027 16.0725Z" />
        </svg>
      </button>

      <!-- hiển thị số bình luận bài viết -->
      <span class="text-text-muted">·</span>
      <span class="text-base text-text-primary"> {{ post.data?.comments_count }} bình luận</span>
    </div>

    <!-- option báo cáo bài viết, tác giả or bài viết -->
    <div class="relative" :ref="el => { if (menuRef) menuRef.value = el }">
      <button
        v-if="auth?.user?.id != post?.data?.author?.id"
        @click.stop="showOption = !showOption"
        :aria-expanded="showOption"
        aria-haspopup="menu"
        class="p-1 ml-auto"
        aria-label="More options">
        <svg width="4" height="16" viewBox="0 0 4 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2 4C0.89543 4 -4.82823e-08 3.10457 0 2C4.82823e-08 0.89543 0.895431 -4.82823e-08 2 0C3.10457 4.82823e-08 4 0.895431 4 2C4 3.10457 3.10457 4 2 4Z"
            fill="#111827"
          />
          <path
            d="M2 10C0.89543 10 -4.82823e-08 9.10457 0 8C4.82823e-08 6.89543 0.895431 6 2 6C3.10457 6 4 6.89543 4 8C4 9.10457 3.10457 10 2 10Z"
            fill="#111827"
          />
          <path
            d="M2 16C0.89543 16 -4.82823e-08 15.1046 0 14C4.82823e-08 12.8954 0.895431 12 2 12C3.10457 12 4 12.8954 4 14C4 15.1046 3.10457 16 2 16Z"
            fill="#111827"
          />
        </svg>
      </button>

      <!-- Sử dụng ReportMenu component -->
      <ReportMenu
        v-if="showOption"
        :items="postMenuItems"
        align="right"
        @close="showOption = false"
      />
    </div>
  </div>
</template>

<script setup lang="js">
import { computed, ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import ReportMenu from '../ReportMenu.vue'

const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  postMenuItems: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Boolean,
    default: false
  },
  menuRef: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'upvote', 'downvote'])

const auth = useAuthStore()

const showOption = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

function handleUpvote() {
  emit('upvote', props.post?.data?.id)
}

function handleDownvote() {
  emit('downvote', props.post?.data?.id)
}
</script>

