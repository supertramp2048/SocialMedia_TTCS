<template>
  <Layout>
    <div class="max-w-5xl mx-auto px-4 py-8">
      <div class="grid grid-cols-12 gap-8">
        <!-- Sidebar -->
        <aside class="col-span-12 md:col-span-3">
          <nav class="space-y-2 text-sm">
            <div class="font-semibold text-slate-700">Tài khoản</div>
            <button class="block w-full text-left text-slate-500 hover:text-slate-700">Tiểu sử</button>
            <button class="block w-full text-left text-slate-500 hover:text-slate-700">Series</button>
            <button class="block w-full text-left text-slate-500 hover:text-slate-700">Đã chặn</button>
          </nav>
        </aside>

        <!-- Main -->
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
                  :style="coverPreview ? `background-image: url('${coverPreview}')`: ''"
                  @click="() => fileInput.click()"
                  class="w-40 h-40 rounded-full overflow-hidden bg-slate-300 flex items-center justify-center bg-center bg-cover cursor-pointer relative">
                  <div
                  :class="coverPreview == null ? 'opacity-0': 'opacity-90'"
                  class="text-4xl text-gray-100"
                  >
                    <i v-if="isLoading == false" class="fa-solid fa-camera transform-gpu hover:scale-[1.05] transition duration-300"></i>
                    <Loader v-if="isLoading"></Loader>
                 </div>
                
                <input
                    type="file"
                    accept="image/*"
                    ref="fileInput"
                    class="hidden"
                    @change="onFilePick"
                />
              </div>
              <button
              class="btnEffect border"
              type="submit"
              >
              Change
              </button>
            </form>
            </div>
            <!-- Bio -->
            <div class="col-span-12 md:col-span-8">
              <label class="block text-sm font-semibold text-slate-700 mb-2">Giới thiệu</label>
              <textarea
                rows="5"
                maxlength="150"
                class="w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 p-3 bg-slate-50"
                placeholder="Viết đôi điều về bạn…"
              ></textarea>
              <div class="text-right text-xs text-slate-500 mt-1">0/150</div>
            </div>
          </div>

          <!-- Name + Email -->
          <div class="mt-8 grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">TÊN HIỂN THỊ</label>
              <input
                type="text"
                value="CT070325"
                class="w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 p-3 bg-slate-50"
                placeholder="Nhập tên hiển thị"
              />
            </div>
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">EMAIL</label>
              <div class="relative">
                <input
                  type="email"
                  value="phamhpham27082004@gmail.com"
                  readonly
                  class="w-full rounded-md border border-slate-300 p-3 bg-slate-50"
                />
                <button
                  type="button"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.414 2.586a2 2 0 0 0-2.828 0l-9.9 9.9a1 1 0 0 0-.263.465l-1.1 3.85a.75.75 0 0 0 .927.927l3.85-1.1a1 1 0 0 0 .465-.263l9.9-9.9a2 2 0 0 0 0-2.828zM12.586 4L16 7.414l-7.9 7.9-2.121-2.121L12.586 4z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Birthday + Gender -->
          <div class="mt-8 grid grid-cols-12 gap-6">
            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">NGÀY SINH</label>
              <div class="grid grid-cols-3 gap-3">
                <select class="rounded-md border border-slate-300 p-2.5 bg-white">
                  <option selected>Ngày</option>
                </select>
                <select class="rounded-md border border-slate-300 p-2.5 bg-white">
                  <option selected>Tháng</option>
                </select>
                <select class="rounded-md border border-slate-300 p-2.5 bg-white">
                  <option selected>Năm</option>
                </select>
              </div>
            </div>

            <div class="col-span-12 md:col-span-6">
              <label class="block text-sm font-semibold text-slate-700 mb-2">GIỚI TÍNH</label>
              <div class="flex items-center gap-6">
                <label class="flex items-center gap-2">
                  <input type="radio" name="gender" value="male" checked />
                  <span>Nam</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" name="gender" value="female" />
                  <span>Nữ</span>
                </label>
                <label class="flex items-center gap-2">
                  <input type="radio" name="gender" value="other" />
                  <span>Khác</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Divider -->
          <div class="my-10 h-px bg-slate-200"></div>

          <!-- Change password -->
          <h2 class="text-center text-lg font-semibold text-slate-700">Đổi mật khẩu</h2>

          <!-- Actions -->
          <div class="mt-8 flex justify-end gap-3">
            <button type="button" class="px-4 py-2 rounded-md border border-slate-300 text-slate-700">Hủy</button>
            <button type="button" class="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">
              Lưu thay đổi
            </button>
          </div>
        </section>
      </div>
    </div>
  </Layout>
</template>



<script setup lang="js">
import { ref, computed, defineComponent, h } from 'vue'
import Layout from '../../client/layout/layout.vue'
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

        fd.append('file', avatarFile.value)
        try {
            isLoading.value = true
            console.log('form data', fd);
            
            const res = await api.post('/api/user/avatar',fd,{
            headers: { 
                'Content-Type': 'multipart/form-data'
            }
        }) 
            console.log(res.data);
            await auth.fetchUser()
            
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

