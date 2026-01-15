<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full bg-white rounded-xl shadow-md p-6 text-center">
      <!-- Tiêu đề -->
      <h1 class="text-2xl font-bold text-gray-900 mb-4">
        Xác thực email
      </h1>

      <!-- Trạng thái: đang verify -->
      <div v-if="status === 'verifying'">
        <p class="text-gray-700 mb-4">
          Đang xác thực email của bạn, vui lòng chờ giây lát...
        </p>
        <div class="flex justify-center">
          <svg
            class="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      </div>

      <!-- Trạng thái: thành công -->
      <div v-else-if="status === 'success'">
        <p class="text-green-700 font-medium mb-2">
          Email của bạn đã được xác thực thành công! 🎉
        </p>
        <p class="text-gray-700 mb-4">
          Bạn có thể tiếp tục sử dụng tài khoản. Nếu trang không tự chuyển, hãy bấm nút bên dưới.
        </p>
        <button
          @click="goAfterSuccess"
          class="inline-flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg"
        >
          Đi tới trang chủ
        </button>
      </div>

      <!-- Trạng thái: lỗi -->
      <div v-else>
        <p class="text-red-600 font-medium mb-2">
          Xác thực email thất bại.
        </p>
        <p class="text-gray-700 mb-4">
          {{ errorMessage }}
        </p>
        <button
          @click="retry"
          class="inline-flex items-center justify-center px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium rounded-lg"
        >
          Thử lại
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../../../../API/axios' // chỉnh lại path nếu anh đặt khác
import {useAuthStore} from "../../../stores/auth"
import {useToast} from 'vue-toastification'
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const toast = useToast()
const status = ref('verifying') // 'verifying' | 'success' | 'error'
const errorMessage = ref('Đã có lỗi xảy ra khi xác thực email.')

const verifyEmail = async () => {
  status.value = 'verifying'
  errorMessage.value = 'Đã có lỗi xảy ra khi xác thực email.'

  const id = route.params.id
  const hash = route.params.hash
  const queryString = window.location.search || '' // ?expires=...&signature=...

  if (!id || !hash) {
    status.value = 'error'
    errorMessage.value = 'Thiếu thông tin xác thực trong đường dẫn.'
    return
  }

  try {
    // Gọi đúng endpoint verify của Laravel
    // Backend: Route::get('/verify-email/{id}/{hash}', ...)->middleware(['auth:sanctum', 'signed'])
    await api.get(`/api/verify-email/${id}/${hash}${queryString}`)

    status.value = 'success'
    auth.resetUserInLocal()
    toast.success('Xác Minh thành công')
    // Tuỳ anh: auto redirect sau vài giây
    setTimeout(() => {
      goAfterSuccess()
    }, 2000)
  } catch (error) {
    status.value = 'error'

    if (error.response?.status === 401) {
      errorMessage.value =
        'Bạn cần đăng nhập trước rồi bấm lại link xác thực trong email.'
    } else if (error.response?.status === 403) {
      // thường là Invalid signature / link hết hạn
      errorMessage.value =
        error.response?.data?.message ||
        'Đường dẫn xác thực không hợp lệ hoặc đã hết hạn.'
    } else {
      errorMessage.value =
        error.response?.data?.message ||
        'Đã có lỗi xảy ra khi xác thực email. Vui lòng thử lại sau.'
    }

    console.error('VERIFY ERROR:', error.response || error)
  }
}

const goAfterSuccess = () => {
  // Anh có thể đổi thành route login hoặc dashboard tuỳ ý
  router.push({ name: 'home' }) // hoặc { path: '/' }
}

const retry = () => {
  verifyEmail()
}

onMounted(() => {
  verifyEmail()
})
</script>
