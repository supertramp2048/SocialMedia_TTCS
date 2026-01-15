<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Nhập email bạn dùng để đăng ký tài khoản
      </h2>
    </div>

    <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form @submit.prevent="onSubmit" method="POST" class="space-y-6" novalidate>
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-900">Email </label>
          <div class="mt-2">
            <input
              v-model.trim="email"
              id="email"
              type="email"
              name="email"
              required
              autocomplete="email"
              inputmode="email"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              aria-invalid="false"
            />
          </div>
        </div>

        <!-- Error message -->
        <p v-if="error" class="text-sm text-red-600" role="alert">{{ error }}</p>

        <!-- Submit -->
        <div>
          <button
            type="submit"
            :disabled="loading"
            :aria-busy="loading"
            class="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2
                   text-sm font-semibold text-white hover:bg-indigo-500
                   focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                   disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Gửi</span>
            <span v-else class="inline-flex items-center" aria-live="polite">
              <span class="mr-2">...Đang gửi</span>
              <!-- spinner thuần Tailwind -->
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-600">
        Quay lại trang đăng nhập
        <router-link to="/login" class="text-indigo-600 font-medium hover:text-indigo-500">
          Đăng nhập
        </router-link>
      </p>
    </div>
  </div>
</template>
<script setup lang='js'>
    import { ref } from 'vue'
    import api from "../../../../API/axios.js"
    import {useToast} from 'vue-toastification'
    const loading=ref(false)
    const email = ref('')
    const toast = useToast()
    async function onSubmit() {
        if(!email){
            toast.error('Nhập email của bạn')
            return
        }
        try {
            loading.value = true
            const res = await api.post('/api/forgot-password',{
                email:email.value
            })
            if(res.status == 200){
                toast.success("Bạn hãy kiểm tra email của bạn và nhấn vào link chúng tôi vừa gửi ")
            }
        } catch (error) {
            if(error.status == 422){
                toast.error('Email không đúng')
            }
        }
        finally{
            loading.value = false
        }
    }
</script>

