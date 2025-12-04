<template>
  <!-- Horizontal Layout (Always visible on mobile, hidden on desktop when vertical mode) -->
  <div 
    :class="[
      'mt-4 flex flex-col sm:flex-row sm:items-center justify-between border-b border-border-lighter mb-6 gap-4 sm:gap-6 px-2 sm:px-0',
      layout === 'vertical' ? 'lg:hidden' : ''
    ]"
  >
    <div class="flex flex-col xs:flex-row xs:items-center gap-3 sm:gap-4 py-4">
      <div class="flex items-center gap-2">
        <!-- nút upvote -->
        <button @click="handleUpvote">
          <svg
            class="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200"
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
          class="w-7 h-7 sm:w-8 sm:h-8 transition-colors duration-200"
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
      <span class="text-text-muted hidden xs:inline">·</span>
      <span class="text-sm sm:text-base text-text-primary">{{ post.data?.comments_count }} bình luận</span>
    </div>

    <!-- option báo cáo bài viết -->
    <div class="relative" :ref="el => { if (menuRef) menuRef.value = el }">
      <button
        v-if="auth?.user?.id != post?.data?.author?.id"
        @click.stop="showOption = !showOption"
        :aria-expanded="showOption"
        aria-haspopup="menu"
        class="p-1 ml-auto"
        aria-label="More options"
      >
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

  <!-- Vertical Floating Layout (Desktop only) -->
  <Teleport to="body">
    <div
      v-if="layout === 'vertical'"
      ref="floatingBar"
      :class="[
        'hidden lg:flex flex-col items-center gap-3 bg-white rounded-lg shadow-lg border border-gray-200 p-3',
        'fixed z-40 transition-all duration-300',
        isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      ]"
      :style="floatingBarStyle"
    >
      <!-- Upvote Button -->
      <button 
        @click="handleUpvote"
        class="group flex flex-col items-center"
        aria-label="Upvote"
      >
        <svg
          class="w-7 h-7 transition-colors duration-200"
          :class="{
            'fill-sky-500': post?.data?.user_vote === 1,
            'fill-gray-400 group-hover:fill-sky-400': post?.data?.user_vote !== 1
          }"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M8.80974 5.27744L3.18474 14.294H14.4761L8.80974 5.27744ZM8.80974 1.92725L17.6609 16.0725H0L8.80974 1.92725Z" />
        </svg>
      </button>

      <!-- Vote Score -->
      <span class="font-bold text-base text-gray-800">
        {{ post?.data?.vote_score > 0 ? post.data.vote_score : 0 }}
      </span>

      <!-- Downvote Button -->
      <button 
        @click="handleDownvote"
        class="group flex flex-col items-center"
        aria-label="Downvote"
      >
        <svg
          class="w-7 h-7 transition-colors duration-200"
          :class="{
            'fill-red-500': post?.data?.user_vote === -1,
            'fill-gray-400 group-hover:fill-red-400': post?.data?.user_vote !== -1
          }"
          viewBox="0 0 18 18"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M9.19027 12.7223L14.8153 3.70574H3.5239L9.19027 12.7223ZM9.19027 16.0725L0.339157 1.92725L18 1.92725L9.19027 16.0725Z" />
        </svg>
      </button>

      <!-- Separator -->
      <div class="w-8 h-px bg-gray-300 my-1"></div>

      <!-- Comment Count -->
      <div
       @click="scrollToCommentSection"
       class="flex flex-col items-center gap-1">
        <svg 
          class="w-6 h-6 fill-gray-500"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H6L4 18V4H20V16Z"/>
        </svg>
        <span class="text-xs text-gray-600 font-medium">
          {{ post.data?.comments_count }}
        </span>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="js">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'
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
  },
  layout: {
    type: String,
    default: 'horizontal', // 'horizontal' | 'vertical'
    validator: (value) => ['horizontal', 'vertical'].includes(value)
  }
})

const emit = defineEmits(['update:modelValue', 'upvote', 'downvote'])

const auth = useAuthStore()
const floatingBar = ref(null)
const isVisible = ref(true) // Bắt đầu với true để hiển thị ngay
const floatingBarStyle = ref({
  left: '20px',
  top: '120px'
})

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
function scrollToCommentSection(){
  emit('scrollToComment')
}
// Tính toán vị trí floating bar
function calculateFloatingBarPosition() {
  if (props.layout !== 'vertical') return

  // Đợi một chút để đảm bảo DOM đã render
  nextTick(() => {
    // Lấy container chính (main.w-9/12.m-auto)
    const mainContainer = document.querySelector('main.w-9/12')
    if (!mainContainer) {
      // Fallback nếu không tìm thấy main container
      floatingBarStyle.value = {
        left: '20px',
        top: '120px'
      }
      return
    }

    const mainRect = mainContainer.getBoundingClientRect()
    
    // Tính toán khoảng cách từ cạnh trái màn hình đến cạnh trái của main container
    const leftOffset = mainRect.left
    
    // Đặt floating bar ở bên trái main container với khoảng cách 20px
    // 80px là chiều rộng ước tính của floating bar + gap
    const left = Math.max(20, leftOffset - 80)
    
    floatingBarStyle.value = {
      left: `${left}px`,
      top: '120px',
    }
  })
}

// Kiểm tra xem có nên hiển thị floating bar không
function checkVisibility() {
  if (props.layout !== 'vertical') return

  // Lấy phần tử PostHeaderSection để biết điểm bắt đầu
  const headerSection = document.querySelector('[class*="PostHeaderSection"]')
  
  // Lấy phần tử comments section để biết khi nào đến cuối bài
  const commentsSection = document.querySelector('[class*="CommentsSection"]')

  // Nếu chưa có comments section, luôn hiển thị
  if (!commentsSection) {
    isVisible.value = true
    return
  }

  const viewportHeight = window.innerHeight
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  
  // Lấy vị trí của comments section
  const commentsSectionTop = commentsSection.offsetTop
  
  // Ẩn floating bar khi scroll đến gần phần comments (trước 300px)
  if (scrollTop + viewportHeight > commentsSectionTop - 300) {
    isVisible.value = false
  } else if (headerSection) {
    // Chỉ hiển thị khi đã scroll qua header
    const headerBottom = headerSection.offsetTop + headerSection.offsetHeight
    isVisible.value = scrollTop > headerBottom - 200
  } else {
    isVisible.value = true
  }
}

// Handle scroll event
function handleScroll() {
  checkVisibility()
}

// Handle resize event
function handleResize() {
  calculateFloatingBarPosition()
  checkVisibility()
}

onMounted(() => {
  if (props.layout === 'vertical') {
    // Tính toán vị trí ngay lập tức
    calculateFloatingBarPosition()
    
    // Tính toán lại sau khi DOM hoàn toàn ready
    setTimeout(() => {
      calculateFloatingBarPosition()
      checkVisibility()
    }, 100)
    
    // Tính toán lại khi images load xong (có thể ảnh hưởng đến layout)
    setTimeout(() => {
      calculateFloatingBarPosition()
    }, 500)

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (props.layout === 'vertical') {
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)
  }
})
</script>