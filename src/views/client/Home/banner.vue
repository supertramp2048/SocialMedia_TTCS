<template>
    <section class="relative  from-sky-50 via-blue-50 to-sky-100 overflow-hidden">
      <div class="max-w-7xl min-h-[500px] mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24"
      :style="{
        backgroundImage: `url(${setting.backGroundURL})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }"
      >
        <div class="grid lg:grid-cols-2 gap-8 items-center">
          <!-- Left Content -->
          <div class="space-y-6 absolute right-1/2 bottom-5 text-center lg:text-left">
            <router-link
            v-if="auth.user == null"
            to="/dang-ky" class="px-8 py-3 bg-white shadow-2xl text-gray-900 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-md">
                  Đăng ký
            </router-link>
          </div>

        </div>
      </div>

      <!-- Floating Plus Button -->
      <button class="absolute left-4 bottom-20 md:bottom-32 w-12 h-12 md:w-14 md:h-14 bg-sky-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-sky-700 transition-colors">
        <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
        </svg>
      </button>

      <!-- Decorative circles -->
      <div class="absolute top-10 right-10 w-32 h-32 bg-sky-200 rounded-full opacity-20 blur-2xl"></div>
      <div class="absolute bottom-10 left-20 w-40 h-40 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
    </section>
</template>
<script setup lang='js'>
    import Spline from "../../../components/spline.vue"
    import { useAuthStore } from '../../../stores/auth'
    const auth = useAuthStore()
    const props = defineProps({
      setting : {type:Object, required: true}
    })
</script>
