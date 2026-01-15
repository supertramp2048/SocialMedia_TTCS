<template>
  <router-link
  :to="currentAd?.link_url"
  >
    <img class="rounded-lg w-full h-[200px] overflow-hidden bg-cover bg-center"
    :src="currentAd?.image_url">
    </img>
  </router-link>
</template>
<script setup lang="js">
import { ref, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  ads: {
    type: Object,
    default: () => ({})
  }
})

const currentAd = ref(null) // URL
let index = 0
let timer = null

function getInfeedAds() {
  return props.ads?.InfeedAds || []
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

watch(
  () => props.ads?.InfeedAds,
  (newVal) => {
    if (newVal?.length) {
      index = 0
      setCurrentFromIndex()
      if (!timer) startRotate()
    } else {
      currentAd.value = null
    }
  },
  { immediate: true }
)

onMounted(() => {
  startRotate()
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
})
</script>
