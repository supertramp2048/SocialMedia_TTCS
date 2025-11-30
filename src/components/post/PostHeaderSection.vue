<template>
  <div>
    <!-- Top Banner Ad -->
    <div class="flex justify-center py-8 bg-white">
      <div class="w-full max-w-[680px] px-4">
        <img
          :src="post.data?.thumbnail_url"
          alt="Banner Ad"
          class="w-full h-auto rounded"
        />
      </div>
    </div>

    <!-- Article Content Container -->
    <div class="w-full mx-auto px-4 pb-16">
      <!-- Category -->
      <router-link class="inline-block text-sm text-text-secondary mb-4">
        {{ post.data?.category?.name }}
      </router-link>

      <!-- Article Title -->
      <h1 class="text-[42px] leading-[58px] font-bold font-montserrat text-[#2D3748] mb-6">
        {{ post.data?.title }}
      </h1>
      <UserDiv :user="post.data?.author" :date="post.data?.created_at"></UserDiv>

      <!-- Article Body -->
      <article class="prose prose-lg w-full" v-html="post.data?.content_html">
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

