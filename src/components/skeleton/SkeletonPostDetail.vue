<template>
  <div class="min-h-screen bg-white">
    <!-- Banner skeleton -->
    <div class="flex justify-center py-8 bg-white">
      <div class="w-full max-w-[680px] px-4">
        <SkeletonLoader width="100%" height="300px" rounded="lg" />
      </div>
    </div>

    <!-- Article Content Container -->
    <div class="max-w-[700px] mx-auto px-4 pb-16">
      <!-- Category -->
      <SkeletonLoader width="100px" height="20px" rounded="md" class="mb-4" />

      <!-- Title -->
      <div class="space-y-3 mb-6">
        <SkeletonLoader width="100%" height="48px" rounded="md" />
        <SkeletonLoader width="85%" height="48px" rounded="md" />
      </div>

      <!-- Author Info -->
      <div class="flex items-center gap-3 mb-8">
        <SkeletonLoader width="48px" height="48px" rounded="full" />
        <div class="flex-1 space-y-2">
          <SkeletonLoader width="150px" height="20px" rounded="md" />
          <SkeletonLoader width="120px" height="16px" rounded="md" />
        </div>
      </div>

      <!-- Article Body -->
      <article class="prose prose-lg max-w-none space-y-4 mb-6">
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="95%" height="20px" rounded="md" />
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="90%" height="20px" rounded="md" />
        
        <!-- Paragraph break -->
        <div class="h-4"></div>
        
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="85%" height="20px" rounded="md" />
        
        <!-- Paragraph break -->
        <div class="h-4"></div>
        
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="100%" height="20px" rounded="md" />
        <SkeletonLoader width="92%" height="20px" rounded="md" />
      </article>

      <!-- Action buttons -->
      <div class="flex items-center gap-4 py-6 border-b border-gray-200 mb-6">
        <SkeletonLoader width="100px" height="32px" rounded="md" />
        <SkeletonLoader width="100px" height="32px" rounded="md" />
        <SkeletonLoader width="120px" height="32px" rounded="md" />
      </div>

      <!-- Follow button -->
      <div class="flex items-center gap-4 mb-8">
        <SkeletonLoader width="48px" height="48px" rounded="full" />
        <SkeletonLoader width="120px" height="40px" rounded="md" />
      </div>
    </div>

    <!-- Comments Section Skeleton -->
    <div class="max-w-[768px] mx-auto px-4 mb-16">
      <div class="border border-gray-200 rounded shadow-sm p-6">
        <!-- Comment Form -->
        <div class="border-b border-gray-200 pb-6 mb-6">
          <SkeletonLoader width="100%" height="50px" rounded="md" class="mb-4" />
          <div class="flex justify-end">
            <SkeletonLoader width="80px" height="36px" rounded="full" />
          </div>
        </div>

        <!-- Comments List -->
        <div class="space-y-6">
          <div v-for="n in 3" :key="n" class="flex gap-3">
            <SkeletonLoader width="48px" height="48px" rounded="full" />
            <div class="flex-1 space-y-2">
              <SkeletonLoader width="150px" height="18px" rounded="md" />
              <SkeletonLoader width="100%" height="16px" rounded="md" />
              <SkeletonLoader width="90%" height="16px" rounded="md" />
              <div class="flex gap-3 pt-2">
                <SkeletonLoader width="60px" height="24px" rounded="full" />
                <SkeletonLoader width="50px" height="24px" rounded="full" />
              </div>
            </div>
          </div>
        </div>
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

