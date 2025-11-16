<template>
  <div
    v-if="visible"
    class="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center"
    @click="handleClose"
  >
    <div class="relative w-full h-full flex items-center justify-center">
      <!-- Nút đóng -->
      <button
        @click="handleClose"
        class="absolute top-4 right-4 w-10 h-10 rounded-full bg-gray-800 bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white text-xl z-10"
      >
       <i class="fa-solid fa-x"></i>
      </button>

      <!-- Nút Previous (chỉ hiện khi ở gallery mode và không phải ảnh đầu) -->
      <button
        v-if="isGalleryMode && currentIndex > 0"
        @click.stop="prevImage"
        class="absolute left-4 w-12 h-12 rounded-full bg-gray-800 bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white text-2xl z-10"
      >
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <!-- Ảnh hiển thị -->
      <img
        :src="displayedImage"
        class="max-w-[90%] max-h-[90%] object-contain"
        alt="Full size image"
        @click.stop
      />

      <!-- Nút Next (chỉ hiện khi ở gallery mode và không phải ảnh cuối) -->
      <button
        v-if="isGalleryMode && currentIndex < images.length - 1"
        @click.stop="nextImage"
        class="absolute right-4 w-12 h-12 rounded-full bg-gray-800 bg-opacity-20 hover:bg-opacity-30 flex items-center justify-center text-white text-2xl z-10"
      >
        <i class="fa-solid fa-angle-right"></i>
      </button>

      <!-- Chỉ số ảnh (chỉ hiện khi ở gallery mode) -->
      <div
        v-if="isGalleryMode"
        class="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-full text-sm"
      >
        {{ currentIndex + 1 }} / {{ images.length }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  // Single image mode
  src: {
    type: String,
    default: ''
  },
  // Gallery mode
  images: {
    type: Array,
    default: () => []
  },
  startIndex: {
    type: Number,
    default: 0
  },
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

const currentIndex = ref(0)

// Kiểm tra xem đang ở gallery mode hay single image mode
const isGalleryMode = computed(() => {
  return props.images && props.images.length > 0
})

// Ảnh hiện tại được hiển thị
const displayedImage = computed(() => {
  if (isGalleryMode.value) {
    return props.images[currentIndex.value]
  }
  return props.src
})

// Watch để reset currentIndex khi mở viewer mới
watch(() => props.visible, (newVal) => {
  if (newVal) {
    currentIndex.value = props.startIndex
  }
})

const handleClose = () => {
  emit('close')
}

const nextImage = () => {
  if (currentIndex.value < props.images.length - 1) {
    currentIndex.value++
  }
}

const prevImage = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  }
}

// Keyboard navigation
const handleKeydown = (e) => {
  if (!props.visible) return
  
  if (e.key === 'Escape') {
    handleClose()
  } else if (e.key === 'ArrowRight' && isGalleryMode.value) {
    nextImage()
  } else if (e.key === 'ArrowLeft' && isGalleryMode.value) {
    prevImage()
  }
}

// Add/remove keyboard listener
watch(() => props.visible, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>