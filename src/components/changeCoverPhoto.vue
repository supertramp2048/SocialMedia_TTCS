<template>
  <form
    class="relative rounded-xl overflow-hidden bg-slate-200 aspect-[16/5] ring-1 ring-slate-300/60"
    @submit.prevent="changeCoverPhoto()"
  >
    <div
      :style="coverPhotoPreview ? `background-image: url('${coverPhotoPreview}')` : ''"
      @click="() => fileInput.click()"
      class="absolute inset-0 flex flex-col items-center justify-center
             text-white/90 cursor-pointer select-none
             bg-center bg-cover bg-no-repeat
             transition-colors duration-300 ease-out
             hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
      role="button"
      aria-label="Thay ảnh bìa"
      tabindex="0"
    >
      <!-- Overlay gradient ở viền để tăng độ nổi khối -->
      <span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/10"></span>

      <!-- Khối trung tâm: camera / loader -->
      <div
        :class="coverPhotoPreview == null ? 'opacity-60' : 'opacity-90'"
        class="relative z-[1] flex items-center justify-center w-[84px] h-[84px]
               rounded-full bg-black/25 backdrop-blur-sm
               shadow-md transform-gpu transition duration-300 hover:scale-105"
      >
        <i
          v-if="isLoading == false"
          class="fa-solid fa-camera text-3xl"
          aria-hidden="true"
        ></i>

        <Loader v-if="isLoading" />
      </div>

      <!-- Input file ẩn (giữ nguyên) -->
      <input
        type="file"
        accept="image/*"
        ref="fileInput"
        class="hidden"
        @change="onFilePick"
      />

      <!-- Nút submit -->
      <button
       @click.stop
        class="btnEffect border
               absolute right-4 bottom-4 z-[1]
               px-4 py-2 rounded-lg
               bg-white/85 text-slate-800
               border-white/60 shadow-sm
               hover:bg-white focus:outline-none
               focus-visible:ring-2 focus-visible:ring-sky-400
               transition"
        type="submit"
      >
        Change
      </button>

      <!-- Trạng thái chưa có ảnh: nền pattern nhẹ (không ảnh hưởng logic) -->
      <div
        v-if="!coverPhotoPreview"
        class="absolute inset-0 pattern-dots-sm text-slate-300 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
        aria-hidden="true"
      ></div>
    </div>
  </form>
</template>

<script setup lang='js'>
import Loader from '../components/smallLoadingIcon.vue'
import api from "../../API/axios"
import { useAuthStore } from '@/stores/auth';
import { ref, computed, defineComponent, h } from 'vue'
const isLoading = ref(false) 
    const fileInput = ref(null)
    const auth = useAuthStore()
    const coverPhotoPreview = ref(auth.user.cover_photo_url)
    const CoverPhotoFile = ref(null)

    function onFilePick(e) {
    const file = e.target.files?.[0]
    if (!file) return
    coverPhotoPreview.value = URL.createObjectURL(file)
    CoverPhotoFile.value = file
    }
    async function changeCoverPhoto(){
        const fd = new FormData()

        fd.append('cover_photo', CoverPhotoFile.value)
        try {
            isLoading.value = true
            console.log('form data', fd);
            
            const res = await api.post('/api/user/cover-photo',fd,{
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

<style scoped>
/* Pattern chấm nhỏ nhã nhặn khi chưa có ảnh xem trước */
.pattern-dots-sm {
  background-image:
    radial-gradient(currentColor 1px, transparent 1.5px);
  background-size: 12px 12px;
  background-position: 0 0;
}
</style>