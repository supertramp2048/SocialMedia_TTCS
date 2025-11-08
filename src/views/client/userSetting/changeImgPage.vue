<template>
    <section class="col-span-12 md:col-span-9">
          <!-- Ảnh bìa -->
          <ChangeCoverPhoto></ChangeCoverPhoto>

          <!-- Avatar + Bio -->
          <div class="mt-8 grid grid-cols-12 gap-6">
            <!-- Avatar -->
            <div class="col-span-12 md:col-span-4 flex items-start justify-center">
              <form 
                class="relative"
                @submit.prevent="changeAvatar()"
              >
                <div 
                  :style="coverPreview ? `background-image: url('${coverPreview}')` : ''"
                  @click="() => fileInput.click()"
                  class="w-40 h-40 rounded-full overflow-hidden bg-slate-200
                        flex items-center justify-center bg-center bg-cover cursor-pointer relative
                        ring-1 ring-slate-300 shadow-sm hover:shadow-md transition"
                  role="button"
                  aria-label="Thay ảnh đại diện"
                  tabindex="0"
                >
                  <!-- overlay mờ + viền sáng nhẹ -->
                  <span class="pointer-events-none absolute inset-0 bg-black/0 hover:bg-black/15 transition"></span>
                  <span class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10"></span>

                  <!-- icon/loader ở giữa -->
                  <div
                    :class="coverPreview == null ? 'opacity-60' : 'opacity-90'"
                    class="relative z-[1] flex items-center justify-center w-16 h-16
                          rounded-full bg-black/25 backdrop-blur-sm text-gray-100
                          transform-gpu transition duration-300 hover:scale-105"
                  >
                    <i v-if="isLoading == false" class="fa-solid fa-camera text-2xl" aria-hidden="true"></i>
                    <Loader v-if="isLoading"></Loader>
                  </div>

                  <!-- input file (giữ nguyên) -->
                  <input
                    type="file"
                    accept="image/*"
                    ref="fileInput"
                    class="hidden"
                    @change="onFilePick"
                  />
                </div>

                <!-- nút submit -->
                <button
                  class="btnEffect border
                        absolute -right-1 bottom-0 translate-x-full md:translate-x-2
                        px-3 py-1.5 rounded-lg bg-white/90 text-slate-800
                        border-white/70 shadow hover:bg-white
                        focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition"
                  type="submit"
                >
                  Lưu thay đổi
                </button>
              </form>
            </div>
            
          </div>
          <!-- form đổi thông tin cơ bản -->
          <!-- Name + Email -->
          <div class="mt-8 grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">TÊN HIỂN THỊ</label>
              <input
                type="text"
                :value="auth.user.name"
                class="w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 p-3 bg-slate-50"
                placeholder="Nhập tên hiển thị"
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">EMAIL</label>
              <div class="relative">
                <input
                  type="email"
                  :value="auth.user.email"
                  readonly
                  class="w-full rounded-md border border-slate-300 p-3 bg-slate-50"
                />
                <button
                  type="button"
                  class="btnEffect absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 0 0-2.828 0l-9.9 9.9a1 1 0 0 0-.263.465l-1.1 3.85a.75.75 0 0 0 .927.927l3.85-1.1a1 1 0 0 0 .465-.263l9.9-9.9a2 2 0 0 0 0-2.828zM12.586 4L16 7.414l-7.9 7.9-2.121-2.121L12.586 4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Divider -->
          
        </section>
</template>
<script setup lang="js">
import { ref, computed, defineComponent, h } from 'vue'
import Loader from '../../../components/smallLoadingIcon.vue'
import ChangeCoverPhoto from '../../../components/changeCoverPhoto.vue'
import api from "../../../../API/axios"
import { useAuthStore } from '@/stores/auth';
    const isLoading = ref(false) 
    const fileInput = ref(null)
    const auth = useAuthStore()
    const coverPreview = ref(auth.user.avatar)
    const avatarFile = ref(null)

    function onFilePick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    coverPreview.value = URL.createObjectURL(file)
    avatarFile.value = file
    }
    async function changeAvatar(){
        const fd = new FormData()

        fd.append('avatar', avatarFile.value)
        try {
            isLoading.value = true
            console.log('form data', fd);
            
            const res = await api.post('/api/user/avatar',fd,{
            headers: { 
                'Content-Type': 'multipart/form-data'
            }
        }) 
            const data = res?.data?.data || res?.data || {}
            const newUrl = data.avatar || null
            if (newUrl) {
            // Cập nhật store
            auth.user = { ...(auth.user || {}), avatar: newUrl }

            // Cập nhật localStorage (nếu bạn đang lưu user ở đó)
            const raw = localStorage.getItem('user')
            if (raw) {
              const u = JSON.parse(raw)
              u.avatar = newUrl
              localStorage.setItem('user', JSON.stringify(u))
            }
          }  
        } catch (error) {
            console.error('❌ Upload failed')
            console.error('Status:', error.response?.status)
            console.error('Data:', error.response?.data)
            console.error('Errors:', error.response?.data?.errors)
        
        // Hiển thị lỗi cụ thể
        const errorMsg = error.response?.data?.message || 
                        error.response?.data?.errors?.avatar?.[0] ||
                        'Upload thất bại'
        alert(errorMsg)
        }
        finally{
            isLoading.value = false
        }
    }
</script>
<style scoped>
.pattern-dots-sm{
  background-image: radial-gradient(#cbd5e1 1px, transparent 1.5px);
  background-size: 12px 12px;
  background-position: 0 0;
}
</style>
