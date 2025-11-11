<template>
  <div
    :class="[
      'relative overflow-hidden bg-gray-100 dark:bg-gray-800',
      rounded ? 'rounded-md' : '',
      block ? 'w-full' : 'inline-block',
      customClass,
    ]"
    :style="{
      height: heightStyle,
      width: widthStyle,
      minHeight: minHeightStyle,
    }"
    role="status"
    aria-busy="true"
  >
    <slot v-if="$slots.default" />

    <template v-else>
      <div v-if="variant === 'card'" class="p-4 space-y-3">
        <div v-if="showImage" class="w-full h-40 rounded-md skeleton-bg"></div>
        <div class="h-4 w-3/4 rounded-md skeleton-bg"></div>
        <div class="h-4 w-2/3 rounded-md skeleton-bg"></div>
        <div class="h-4 w-1/2 rounded-md skeleton-bg"></div>
      </div>

      <div v-else-if="variant === 'list'" class="p-4 space-y-4">
        <div
          v-for="i in rows"
          :key="i"
          class="flex items-center gap-3"
        >
          <div v-if="avatar" class="h-10 w-10 rounded-full skeleton-bg shrink-0"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/5 rounded-md skeleton-bg"></div>
            <div class="h-3 w-2/5 rounded-md skeleton-bg"></div>
          </div>
        </div>
      </div>

      <div v-else-if="variant === 'detail'" class="p-4 space-y-4">
        <div class="h-7 w-4/5 rounded-md skeleton-bg"></div>
        <div class="flex gap-3">
          <div class="h-4 w-24 rounded-md skeleton-bg"></div>
          <div class="h-4 w-16 rounded-md skeleton-bg"></div>
        </div>
        <div class="space-y-2">
          <div class="h-4 w-full rounded-md skeleton-bg"></div>
          <div class="h-4 w-11/12 rounded-md skeleton-bg"></div>
          <div class="h-4 w-10/12 rounded-md skeleton-bg"></div>
          <div class="h-4 w-9/12 rounded-md skeleton-bg"></div>
        </div>
      </div>

      <div v-else class="w-full h-full skeleton-bg"></div>
    </template>

    <div class="absolute inset-0 shimmer" aria-hidden="true"></div>
    <span class="sr-only">Loading...</span>
  </div>
  </template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'card' | 'list' | 'detail' | 'block'

const props = withDefaults(defineProps<{
  variant?: Variant
  rows?: number
  avatar?: boolean
  showImage?: boolean
  block?: boolean
  width?: string | number
  height?: string | number
  minHeight?: string | number
  rounded?: boolean
  class?: string
}>(), {
  variant: 'block',
  rows: 5,
  avatar: false,
  showImage: true,
  block: true,
  width: '100%',
  height: '',
  minHeight: '',
  rounded: true,
  class: '',
})

const toCssSize = (v?: string | number) => {
  if (v === undefined || v === null || v === '') return ''
  return typeof v === 'number' ? `${v}px` : v
}

const widthStyle = computed(() => toCssSize(props.width))
const heightStyle = computed(() => toCssSize(props.height))
const minHeightStyle = computed(() => toCssSize(props.minHeight))
const customClass = computed(() => props.class)
</script>

<style scoped>
.skeleton-bg {
  background-color: rgb(229 231 235);
}
:global(.dark) .skeleton-bg {
  background-color: rgb(55 65 81);
}

.shimmer {
  transform: translateX(-100%);
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.35) 50%,
    transparent 100%
  );
  animation: shimmer 1.6s infinite;
}
@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>


