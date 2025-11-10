<template>
    <section class="bg-gray-50 h-screen dark:bg-gray-900">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <a href="#" class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                <img class="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo">
                Flowbite    
            </a>
            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                        Create an account
                    </h1>
                    <form 
                      @submit.prevent="createAccount()"
                       class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="email" 
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Email của bạn 
                            </label>
                            <input 
                                v-model="emailInput"
                                type="text" 
                                name="email" 
                                id="email" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""
                            >
                        </div>
                        <div>
                            <label for="email" 
                                class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                  Tên hiển thị trên trang 
                            </label>
                            <input 
                                v-model="nameInput"
                                type="text" 
                                name="name" 
                                id="name" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required=""
                            >
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Mật khẩu
                                </label>
                            <input 
                                v-model="passwordInput" 
                                type="password" name="password" 
                                id="password" placeholder="••••••••" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                        </div>
                        <div>
                            <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                Xác nhận mật khẩu
                                </label>
                            <input 
                                v-model="confirmPasswordInput"
                                type="password" 
                                name="confirm-password" 
                                id="confirm-password" placeholder="••••••••" 
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="">
                        </div>
                        <div class="flex items-start">
                            <div class="flex items-center h-5">
                                <input id="terms" aria-describedby="terms" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800" required="">
                            </div>
                            <div class="ml-3 text-sm">
                                <label for="terms" class="font-light text-gray-500 dark:text-gray-300">I accept the <a class="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Terms and Conditions</a></label>
                            </div>
                        </div>
                        <button
                          :disabled="isLoading"
                          :aria-busy="isLoading"
                          type="submit"
                          class="w-full relative flex items-center justify-center gap-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none">
                          <span v-if="!isLoading">Create an account</span>
                          <span v-else class="inline-flex items-center" aria-live="polite">
                            <span class="mr-2">Đang tạo</span>
                            <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                          </span>
                        </button>
                        <p class="text-sm font-light text-gray-500 dark:text-gray-400">
                            Already have an account? 
                            <router-link to="/login" class="font-medium text-primary-600 hover:underline dark:text-primary-500">Login here</router-link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>
<script setup lang='js'>
    import {ref} from 'vue'
    import {useRouter} from 'vue-router'
    import api from "../../../../API/axios"
    const router = useRouter()
    const isLoading = ref(false)
    const emailInput = ref('')
    const passwordInput = ref('')
    const confirmPasswordInput = ref('')
    const nameInput = ref('')
    async function createAccount() {
  if (passwordInput.value !== confirmPasswordInput.value) {
    alert('Mật khẩu xác nhận không giống')
    return
  }
  try {
    isLoading.value = true
    const res = await api.post('/api/register', {
      name: nameInput.value,
      email: emailInput.value,
      password: passwordInput.value,
      password_confirmation: confirmPasswordInput.value
    })
    alert('Tạo tài khoản thành công')
    router.push('/login')
  } catch (error) {
    const status = error?.response?.status
    const data = error?.response?.data
    console.error('Status:', status, 'Data:', data)

    if (status === 422) {
      const errs = data?.errors || {}
      const first = Object.values(errs).flat()?.[0] || 'Dữ liệu không hợp lệ'
      alert(first)
    } else if (status === 409) {
      alert('Email đã tồn tại')
    } else {
      alert(data?.message || 'Đăng ký thất bại (500). Kiểm tra server logs.')
    }
  } finally {
    isLoading.value = false
  }
}

</script>