<template>
  <div class="rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
    <!-- Image skeleton -->
    <div class="w-full aspect-[16/10] bg-gray-100 relative overflow-hidden">
      <div class="skeleton-shimmer absolute inset-0"></div>
    </div>
    
    <!-- Content skeleton -->
    <div class="p-4 space-y-3 flex-1">
      <!-- Category badge -->
      <SkeletonLoader width="80px" height="20px" rounded="full" />
      
      <!-- Title lines -->
      <div class="space-y-2">
        <SkeletonLoader width="95%" height="24px" rounded="md" />
        <SkeletonLoader width="75%" height="24px" rounded="md" />
      </div>
      
      <!-- Author info -->
      <div class="flex items-center gap-3 pt-2">
        <SkeletonLoader width="40px" height="40px" rounded="full" />
        <div class="flex-1 space-y-2">
          <SkeletonLoader width="120px" height="16px" rounded="md" />
          <SkeletonLoader width="80px" height="14px" rounded="md" />
        </div>
      </div>
      
      <!-- Stats -->
      <div class="flex items-center gap-4 pt-2">
        <SkeletonLoader width="60px" height="16px" rounded="md" />
        <SkeletonLoader width="80px" height="16px" rounded="md" />
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import SkeletonLoader from './SkeletonLoader.vue'
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
</style>

