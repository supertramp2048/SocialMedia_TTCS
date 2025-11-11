<template>
  <div class="flex min-h-screen flex-col justify-center px-6 py-12 lg:px-8 bg-white">
    <div class="sm:mx-auto sm:w-full sm:max-w-sm">
      <!-- <img
        src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
        alt="Your Company"
        class="mx-auto h-10 w-auto"
      /> -->
      <h2 class="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">
        Đăng nhập vào tài khoản của bạn
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

        <!-- Password -->
        <div>
          <div class="flex items-center justify-between">
            <label for="password" class="block text-sm font-medium text-gray-900">Password</label>
            <div class="text-sm">
              <router-link to="/quen-mat-khau" class="font-semibold text-indigo-600 hover:text-indigo-500">
                Quên mật khẩu?
              </router-link>
            </div>
          </div>
          <div class="mt-2">
            <input
              v-model="password"
              id="password"
              type="password"
              name="password"
              required
              autocomplete="current-password"
              class="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder:text-gray-400
                     focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="••••••••"
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
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600
                   disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Sign in</span>
            <span v-else class="inline-flex items-center" aria-live="polite">
              <span class="mr-2">Signing in</span>
              <!-- spinner thuần Tailwind -->
              <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            </span>
          </button>
        </div>
      </form>

      <p class="mt-10 text-center text-sm text-gray-600">
        Bạn chưa có tài khoản?
        <router-link to="/dang-ky" class="text-indigo-600 font-medium hover:text-indigo-500">
          Đăng ký
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '../../../stores/auth'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'

const auth = useAuthStore()
const router = useRouter()
const toast = useToast()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit () {
  if (!email.value || !password.value) {
    error.value = 'Vui lòng nhập email và mật khẩu.'
    return
  }

  loading.value = true
  error.value = ''
  try {
    await auth.login(email.value, password.value)
    toast.success('Đăng nhập thành công!')
    router.push('/')
  } catch (err) {
    // tuỳ backend: lấy message từ response
    const msg = err?.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.'
    error.value = msg
    toast.error(msg)
  } finally {
    loading.value = false
  }
}
</script>
