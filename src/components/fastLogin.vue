<template>
    <div class="mt-6">
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-gray-300"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="bg-white px-2 text-gray-500">Hoặc đăng nhập với</span>
          </div>
        </div>

        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            @click="loginWithGoogle"
            type="button"
            class="flex w-full items-center justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#EA4335]"
          >
            <svg class="h-5 w-5 mr-2" viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>

          <button
          @click="loginWithGithub"
          type="button"
          class="flex w-full items-center justify-center rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          <svg class="h-5 w-5 mr-2 fill-current" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303
            3.438 9.8 8.205 11.387.6.113.82-.258.82-.577
            0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.757-1.333-1.757-1.086-.744.084-.729.084-.729
            1.205.084 1.84 1.237 1.84 1.237 1.067 1.835 2.8
            1.304 3.487.997.108-.774.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93
            0-1.31.468-2.38 1.236-3.22-.135-.303-.54-1.523.105-3.176
            0 0 1.005-.322 3.3 1.23a11.48 11.48 0 0 1 3.003-.404
            11.48 11.48 0 0 1 3.003.404c2.28-1.552 3.285-1.23
            3.285-1.23.645 1.653.24 2.873.12 3.176.765.84
            1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475
            5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015
3.286 0 .315.21.69.825.57C20.565 22.092 24
            17.592 24 12.297c0-6.627-5.373-12-12-12"/>
          </svg>
            GitHub
        </button>
        </div>
      </div>
</template>
<script setup lang='js'>
import { onUnmounted } from 'vue';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import Cookies from 'js-cookie';
const toast = useToast();
const router = useRouter();
const auth = useAuthStore();
    // Hàm xử lý login Google
// 1. Hàm mở Popup
function loginWithGoogle() {
    // URL Backend xử lý login Google
    const url = `${import.meta.env.VITE_API_BASE}/api/login/google/redirect`;

    // Cấu hình kích thước Popup giữa màn hình
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // Mở cửa sổ
    window.open(url, 'google_login', `width=${width},height=${height},top=${top},left=${left}`);

    // Đăng ký lắng nghe tin nhắn từ Popup gửi về
    window.addEventListener('message', handlePopupMessage);
}

function loginWithGithub() {
    // URL Backend xử lý login Google
    const url = `${import.meta.env.VITE_API_BASE}/api/login/github/redirect`;

    // Cấu hình kích thước Popup giữa màn hình
    const width = 500;
    const height = 600;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    // Mở cửa sổ
    window.open(url, 'github_login', `width=${width},height=${height},top=${top},left=${left}`);

    // Đăng ký lắng nghe tin nhắn từ Popup gửi về
    window.addEventListener('message', handlePopupMessage);
}

// 2. Hàm xử lý khi nhận tin nhắn
function handlePopupMessage(event) {
    // (Tùy chọn) Kiểm tra nguồn gửi để bảo mật
    // if (event.origin !== "http://127.0.0.1:8000") return;

    const { status, token, user, message } = event.data;

    if (status === 'success') {
        // --- ĐĂNG NHẬP THÀNH CÔNG ---

        // 1. Lưu Token
        //localStorage.setItem('auth_token', token);
        auth.user = user; // Cập nhật Pinia Store
        console.log('Đăng nhập thành công:', token);
        console.log("user ", user);
        Cookies.set('token',token,{
                    expires: 7,            // thời hạn 7 ngày
                    secure: false,          // true nếu chạy HTTPS
                    sameSite: 'lax'         // tránh lỗi CORS
                })
        localStorage.setItem('user', JSON.stringify(user))
        // Lưu token trong 7 ngày
        // 2. Thông báo
        toast.success(`Xin chào, ${user.name}!`);

        // 3. Chuyển hướng vào trang chủ (Home)
        router.push('/');

    } else if (status === 'error') {
        toast.error(message || 'Đăng nhập thất bại');
    }

    // Dọn dẹp: Gỡ bỏ lắng nghe để tránh lỗi memory leak
    window.removeEventListener('message', handlePopupMessage);
}

// Dọn dẹp khi component bị hủy (người dùng rời trang Login)
onUnmounted(() => {
    window.removeEventListener('message', handlePopupMessage);
});
</script>
