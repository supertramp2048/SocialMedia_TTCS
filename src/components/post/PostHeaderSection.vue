<template>
  <div>
    <!-- Top Banner Ad -->
    <div class="flex justify-center py-6 sm:py-8 bg-white">
      <div class="w-full max-w-[680px] px-3 sm:px-4">
        <img
          :src="post.data?.thumbnail_url"
          alt="Banner Ad"
          class="w-full h-auto rounded object-cover"
        />
      </div>
    </div>

    <!-- Article Content Container -->
    <div class="w-full mx-auto px-4 lg:px-6 pb-12 lg:pb-16">
      <!-- Category -->
      <router-link class="inline-block text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">
        {{ post.data?.category?.name }}
      </router-link>

      <!-- Article Title -->
      <h1 class="text-2xl sm:text-[32px] lg:text-[42px] leading-snug sm:leading-[44px] lg:leading-[58px] font-bold font-montserrat text-[#2D3748] mb-4 sm:mb-6">
        {{ post.data?.title }}
      </h1>
      <UserDiv :user="post.data?.author" :date="post.data?.created_at"></UserDiv>

      <!-- Article Body -->
      <article class="prose prose-sm sm:prose lg:prose-lg w-full max-w-none mt-6" v-html="post.data?.content_html">
      </article>
    </div>
  </div>
</template>

<script setup lang="js">
import UserDiv from '../userDiv.vue'

defineProps({
  post: {
    type: Object,
    required: true
  }
})
</script>

