<template>
  <div class="min-h-screen bg-gray-50 col-span-12 md:col-span-9 flex items-center justify-center">
    <form
      @submit.prevent="handleSubmit"
      class="w-full max-w-sm bg-white rounded-xl shadow-md px-6 py-8 flex flex-col gap-4"
    >
      <h1 class="text-xl font-semibold text-gray-900 text-center mb-2">
        Hãy nhập mật khẩu của bạn để xóa tài khoản
      </h1>

      <input
        v-model="userPass"
        type="text"
        placeholder="Nhập mật khẩu..."
        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />

      <button
        type="submit"
        :disabled="auth.loading"
        class="w-full inline-flex items-center justify-center rounded-lg px-4 py-2.5 text-sm font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                bg-blue-600 text-white hover:bg-blue-700
                disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:hover:bg-gray-300"
        >
        <span v-if="auth.loading">
            Đang xử lý...
        </span>
        <span v-else>
            Xóa tài khoản
        </span>
      </button>

    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {useAuthStore} from '../../../stores/auth'
import { useToast } from 'vue-toastification'
import {useRouter, useRoute} from 'vue-router'
const router = useRouter()
const route = useRoute()
const toast = useToast()
const userPass = ref('')
const auth = useAuthStore()
const handleSubmit = async () => {
    try {
        console.log("pass", userPass.value);
        
        const res = await auth.deleteAcc(userPass.value)
        if(res.status == 200){
            router.push("/")
            toast.success("xóa tài khoản thành công")
        }
    } catch (error) {
        alert('that bai')
    }
}
</script>
