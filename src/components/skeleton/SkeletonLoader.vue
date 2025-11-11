<template>
  <div
    :class="[
      'skeleton-shimmer',
      baseClass,
      roundedClass,
      widthClass,
      heightClass
    ]"
    :style="customStyle"
  />
</template>

<script setup lang="js">
import { computed } from 'vue'

const props = defineProps({
  // Kích thước
  width: {
    type: [String, Number],
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: '1rem'
  },
  // Bo góc
  rounded: {
    type: [String, Boolean],
    default: 'md'
  },
  // Class tùy chỉnh
  class: {
    type: String,
    default: ''
  }
})

const baseClass = computed(() => props.class || '')

const roundedClass = computed(() => {
  if (props.rounded === true) return 'rounded-full'
  if (props.rounded === false) return ''
  return `rounded-${props.rounded}`
})

const widthClass = computed(() => {
  if (typeof props.width === 'number') return ''
  if (props.width.includes('px') || props.width.includes('%') || props.width.includes('rem')) return ''
  return `w-${props.width}`
})

const heightClass = computed(() => {
  if (typeof props.height === 'number') return ''
  if (props.height.includes('px') || props.height.includes('%') || props.height.includes('rem')) return ''
  return `h-${props.height}`
})

const customStyle = computed(() => {
  const style = {}
  
  if (typeof props.width === 'number') {
    style.width = `${props.width}px`
  } else if (props.width.includes('px') || props.width.includes('%') || props.width.includes('rem')) {
    style.width = props.width
  }
  
  if (typeof props.height === 'number') {
    style.height = `${props.height}px`
  } else if (props.height.includes('px') || props.height.includes('%') || props.height.includes('rem')) {
    style.height = props.height
  }
  
  return style
})
</script>

<style scoped>
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Dark mode support (optional) */
@media (prefers-color-scheme: dark) {
  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      #2d3748 0%,
      #4a5568 50%,
      #2d3748 100%
    );
    background-size: 200% 100%;
  }
}
</style>

