<template>
  <footer class="bg-gray-900 text-gray-300 mt-16">
    <!-- Top -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid gap-8 md:grid-cols-3">
      <!-- Mô tả -->
      <div>
        <h3 class="text-lg font-semibold text-white mb-3">
          Spiderum Clone
        </h3>
        <p class="text-sm leading-relaxed">
          {{ footer?.description }}
        </p>
      </div>

      <!-- Links -->
      <div>
        <h4 class="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
          Liên kết
        </h4>
        <ul class="space-y-2">
          <li
            v-for="link in footer?.links"
            :key="link.label"
          >
            <a
              :href="link.url"
              target="_blank"
              rel="noopener"
              class="text-sm hover:text-sky-400 transition-colors"
            >
              {{ link.label }}
            </a>
          </li>
        </ul>
      </div>

      <!-- Socials -->
      <div>
        <h4 class="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
          Kết nối
        </h4>
        <div class="flex items-center gap-3">
          <a
            v-for="(social, idx) in footer?.socials"
            :key="idx"
            :href="social.url"
            target="_blank"
            rel="noopener"
            class="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-sky-500 hover:text-white transition"
          >
            <!-- platform đang là chuỗi '<i class=...></i>' nên dùng v-html -->
            <span v-html="cleanPlatform(social.platform)"></span>
          </a>
        </div>
      </div>
    </div>

    <!-- Bottom -->
    <div class="border-t border-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-gray-400 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
        <span>© {{ year }} - {{ footer?.copyright }}</span>
        <span class="italic">
          {{ footer?.description }}
        </span>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  footer: {
    type: Object,
    required: true
  }
})

const year = new Date().getFullYear()

// Vì dữ liệu của anh đang kiểu: "'<i class='fa-...'></i>'" (thừa dấu nháy)
// nên em strip bớt nháy đầu/cuối cho sạch
const cleanPlatform = (platform) => {
  if (typeof platform !== 'string') return platform
  return platform.replace(/^'+|'+$/g, '')
}
</script>
