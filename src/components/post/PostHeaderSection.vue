<template>
  <div>
    <!-- Top Banner Ad -->
    <div class="flex justify-center py-6 sm:py-8 bg-white">
      <div class="w-full px-3 sm:px-4">
        <img
          :src="currentAd?.image_url"
          alt="Banner Ad"
          class="w-full max-h-[200px] rounded object-fill"
        />
      </div>
    </div>

    <!-- Article Content Container -->
    <div class="w-full mx-auto px-4 lg:px-6 pb-12 lg:pb-16">
      <!-- Category -->
      <p class="inline-block shadow-2xl border rounded-3xl p-1 border-gray-200 text-xs sm:text-sm text-text-secondary mb-3 sm:mb-4">
        {{ post.data?.category?.name }}
      </p>

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
import {ref, onMounted} from 'vue'
import {useAdsStore} from "@/stores/advertisment.js"
const adsStore = useAdsStore()
const currentAd = ref(null) // URL
let index = 0
let timer = null
function getInfeedAds() {
  return adsStore?.sidebarTopAds || []
}
function setCurrentFromIndex() {
  const list = getInfeedAds()
  if (!list.length) {
    currentAd.value = null
    return
  }
  index = index % list.length
  const ad = list[index]
  currentAd.value = ad
}
function startRotate() {
  const list = getInfeedAds()
  if (!list.length || timer) return

  setCurrentFromIndex()

  timer = setInterval(() => {
    const arr = getInfeedAds()
    if (!arr.length) return
    index = (index + 1) % arr.length
    setCurrentFromIndex()
  }, 4000)
}
defineProps({
  post: {
    type: Object,
    required: true
  }
})
onMounted(async () => {
  try {
    await adsStore.getAllAds()
  } catch (error) {
    console.log(error);
  }
  startRotate()
})
</script>

