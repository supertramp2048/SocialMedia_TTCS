<template>
    <section class="bg-gray-50 col-span-12 md:col-span-9">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
            <div class="w-full p-6 bg-white rounded-lg shadow border md:mt-0 sm:max-w-md sm:p-8">
                <h2 class="mb-1 text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
                    Change Password
                </h2>
                <form 
                @submit.prevent="sendFormChangePassword"
                class="mt-4 space-y-4 lg:mt-5 md:space-y-5" action="#">
                    <div>
                        <label for="current_password" class="block mb-2 text-sm font-medium text-gray-900">Mật khẩu cũ</label>
                        <input 
                        v-model="form.current_password"
                        type="password" name="current_password" id="current_password"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                            placeholder="••••••••" required>
                    </div>
                    <div>
                        <label for="password" class="block mb-2 text-sm font-medium text-gray-900">New Password</label>
                        <input 
                        v-model="form.password"
                        type="password" name="password" id="password" placeholder="••••••••"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required>
                    </div>
                    <div>
                        <label for="password_confirmation" class="block mb-2 text-sm font-medium text-gray-900">Confirm password</label>
                        <input 
                        v-model="form.password_confirmation"
                        type="password" name="password_confirmation" id="password_confirmation" placeholder="••••••••"
                            class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg 
                                    focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5" required>
                    </div>
                    <button
                        type="submit"
                        :disabled="loading"
                        :aria-busy="loading"
                        class="w-full relative flex items-center justify-center gap-2 text-white btnEffect bg-sky-400 hover:bg-primary-700 focus:ring-4 
                                focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm 
                                px-5 py-2.5 text-center disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none">
                        <span v-if="!loading">Reset password</span>
                        <span v-else class="inline-flex items-center" aria-live="polite">
                            <span class="mr-2">Đang gửi</span>
                            <span class="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                        </span>
                    </button>
                </form>
            </div>
        </div>
    </section>
</template>
<script setup lang='js'>
    import {ref, onMounted, watch} from 'vue'
    import {useRoute, useRouter} from 'vue-router'
    import api from "../../../../API/axios"
    const loading = ref(false)
    const form = ref({
        current_password: '',
        password: '',
        password_confirmation: ''
    }) 
    async function sendFormChangePassword() {
        try {
            loading.value = true
            const res = await api.patch('/api/profile/password',form.value)
            if(res.status == 200){
                alert("Mật khẩu đã được cập nhật thành công.")
            }
            else if(res.status == 422 ){
            alert("Mật khẩu mới không được giống mật khẩu cũ")
            }
        } catch (error) {
            alert("Đổi mật khẩu thất bại")
        }
        finally {
            loading.value = false
        }
    }
</script>