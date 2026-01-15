<template>
  <div class="space-y-4">
    <div v-for="n in rows" :key="n" class="flex gap-3">
      <SkeletonLoader width="48px" height="48px" rounded="full" />
      <div class="flex-1 space-y-2">
        <SkeletonLoader width="33%" height="16px" rounded="md" />
        <SkeletonLoader width="83%" height="16px" rounded="md" />
        <SkeletonLoader width="66%" height="16px" rounded="md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import SkeletonLoader from './SkeletonLoader.vue'

defineProps({
  rows: {
    type: Number,
    default: 6
  }
})
</script>
