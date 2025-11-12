<template>
  <section class="col-span-12 md:col-span-9">
    <!-- Ảnh bìa -->
    <div class="relative rounded-xl overflow-hidden bg-slate-200 aspect-[16/5] ring-1 ring-slate-300/60">
      <div
        :style="coverPreview ? `background-image: url('${coverPreview}')` : ''"
        @click="() => coverFileInput.click()"
        class="absolute inset-0 flex flex-col items-center justify-center
               text-white/90 cursor-pointer select-none
               bg-center bg-cover bg-no-repeat
               transition-colors duration-300 ease-out
               hover:bg-black/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        role="button"
        aria-label="Thay ảnh bìa"
        tabindex="0"
      >
        <span class="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/20 via-black/0 to-black/10"></span>

        <div
          :class="coverPreview == null ? 'opacity-60' : 'opacity-90'"
          class="relative z-[1] flex items-center justify-center w-[84px] h-[84px]
                 rounded-full bg-black/25 backdrop-blur-sm
                 shadow-md transform-gpu transition duration-300 hover:scale-105"
        >
          <i v-if="!isCoverLoading" class="fa-solid fa-camera text-3xl" aria-hidden="true"></i>
          <Loader v-if="isCoverLoading" />
        </div>

        <input
          type="file"
          accept="image/*"
          ref="coverFileInput"
          class="hidden"
          @change="onPickCover"
        />

        <div
          v-if="!coverPreview"
          class="absolute inset-0 pattern-dots-sm text-slate-300 [mask-image:radial-gradient(circle_at_center,black,transparent_70%)]"
          aria-hidden="true"
        ></div>
      </div>
    </div>

    <!-- Avatar + Nút Lưu -->
    <div class="mt-8 grid grid-cols-12 gap-6">
      <div class="col-span-12 md:col-span-4 flex items-start justify-center">
        <div class="relative">
          <div 
            :style="avatarPreview ? `background-image: url('${avatarPreview}')` : ''"
            @click="() => avatarFileInput.click()"
            class="w-40 h-40 rounded-full overflow-hidden bg-slate-200
                  flex items-center justify-center bg-center bg-cover cursor-pointer relative
                  ring-1 ring-slate-300 shadow-sm hover:shadow-md transition"
            role="button"
            aria-label="Thay ảnh đại diện"
            tabindex="0"
          >
            <span class="pointer-events-none absolute inset-0 bg-black/0 hover:bg-black/15 transition"></span>
            <span class="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-black/10"></span>

            <div
              :class="avatarPreview == null ? 'opacity-60' : 'opacity-90'"
              class="relative z-[1] flex items-center justify-center w-16 h-16
                    rounded-full bg-black/25 backdrop-blur-sm text-gray-100
                    transform-gpu transition duration-300 hover:scale-105"
            >
              <i v-if="!isAvatarLoading" class="fa-solid fa-camera text-2xl" aria-hidden="true"></i>
              <Loader v-if="isAvatarLoading"></Loader>
            </div>

            <input
              type="file"
              accept="image/*"
              ref="avatarFileInput"
              class="hidden"
              @change="onPickAvatar"
            />
          </div>

          <!-- Nút Lưu thay đổi duy nhất -->
          <!-- <button
            @click="saveChanges"
            :disabled="isAvatarLoading || isCoverLoading"
            class="btnEffect border
                  absolute -right-1 bottom-0 translate-x-full md:translate-x-2
                  px-3 py-1.5 rounded-lg bg-white/90 text-slate-800
                  border-white/70 shadow hover:bg-white
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 transition
                  disabled:opacity-50 disabled:cursor-not-allowed"
            type="button"
          >
            {{ (isAvatarLoading || isCoverLoading) ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button> -->
        </div>
      </div>
    </div>

    <!-- Form đổi thông tin cơ bản -->
    <div class="mt-8 grid grid-cols-12 gap-6 relative">
      <div class="col-span-12 md:col-span-6">
        <label class="block text-sm font-semibold text-slate-700 mb-2">TÊN HIỂN THỊ</label>
        <input
          type="text"
          v-model="userName"
          class="w-full rounded-md border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 p-3 bg-slate-50"
          placeholder="Nhập tên hiển thị"
        />
      </div>
      
      <!-- Nút Lưu thay đổi (Save Changes) -->
        <div class="col-span-12 md:col-span-6 relative mt-2 flex justify-end">
          <button
            @click="saveChanges"
            :disabled="isAvatarLoading || isCoverLoading"
            class="btnEffect
                  bg-sky-500 hover:bg-sky-600 text-white font-semibold
                  shadow-md rounded-full
                  px-4 py-2 md:px-6 md:py-2.5
                  transition
                  disabled:opacity-60 disabled:cursor-not-allowed"
            type="button"
          >
            {{ (isAvatarLoading || isCoverLoading) ? 'Đang lưu...' : 'Lưu thay đổi' }}
          </button>
        </div>

    </div>
    
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import Loader from '../../../components/smallLoadingIcon.vue'
import api from "../../../../API/axios"
import { useAuthStore } from '@/stores/auth'
import { useToast } from 'vue-toastification'

const toast = useToast()
const auth = useAuthStore()
const isAvatarLoading = ref(false)
const isCoverLoading = ref(false)

// Avatar
const avatarFileInput = ref(null)
const avatarFile = ref(null)
const avatarPreview = ref(auth.user?.avatar || null)
const oldName = ref(auth?.user?.name)
const userName = ref(auth?.user?.name)
let lastAvatarUrl = null

// Cover
const coverFileInput = ref(null)
const coverFile = ref(null)
const coverPreview = ref(auth.user?.cover_photo_url || null)
let lastCoverUrl = null

onMounted(() => {
  console.log('Current user:', auth.user)
})

onUnmounted(() => {
  if (lastAvatarUrl) URL.revokeObjectURL(lastAvatarUrl)
  if (lastCoverUrl) URL.revokeObjectURL(lastCoverUrl)
})

function onPickAvatar(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (lastAvatarUrl) URL.revokeObjectURL(lastAvatarUrl)
  
  const previewUrl = URL.createObjectURL(file)
  lastAvatarUrl = previewUrl
  avatarPreview.value = previewUrl
  avatarFile.value = file
}

function onPickCover(e) {
  const file = e.target.files?.[0]
  if (!file) return

  if (lastCoverUrl) URL.revokeObjectURL(lastCoverUrl)
  
  const previewUrl = URL.createObjectURL(file)
  lastCoverUrl = previewUrl
  coverPreview.value = previewUrl
  coverFile.value = file
}

async function saveChanges() {
  const needAvatar = !!avatarFile.value
  const needCover = !!coverFile.value

  if (!needAvatar && !needCover && oldName.value == userName.value) {
    toast.info("Không có ảnh nào thay đổi")
    return
  }

  try {
    // Thử endpoint gộp trước
    const hasCombined = await checkCombinedEndpoint()
    
    if (hasCombined) {
      await uploadCombined()
    } else {
      await uploadSeparate()
    }
    // ✅ Cập nhật tên hiển thị
    if (oldName.value !== userName.value) {
      const res = await api.patch('/api/profile/details', { name: userName.value })
      // Tùy backend trả name ở đâu, ưu tiên name người dùng vừa nhập
      const newName = userName.value || res?.data?.name || res?.data?.data?.name
      updateUserCache({ name: newName })
      oldName.value = newName
    }

    // Reset files sau khi upload thành công
    avatarFile.value = null
    coverFile.value = null
    toast.success('Đã cập nhật ảnh')
    
  } catch (err) {
    console.error('Upload error:', err)
    toast.error("Đã xảy ra lỗi")
    const errorMsg = err.response?.data?.message ||
                     err.response?.data?.errors?.avatar?.[0] ||
                     err.response?.data?.errors?.cover_photo?.[0] ||
                     err.response?.data?.errors?.cover?.[0] ||
                     'Upload thất bại'
    alert(errorMsg)
  }
}

async function checkCombinedEndpoint() {
  // Kiểm tra xem có endpoint gộp không
  // Bạn có thể thay bằng logic kiểm tra thực tế hoặc hard-code
  return false // Mặc định là không có, sẽ dùng 2 endpoint riêng
}

async function uploadCombined() {
  const fd = new FormData()
  
  if (avatarFile.value) fd.append('avatar', avatarFile.value)
  if (coverFile.value) fd.append('cover_photo', coverFile.value)

  const res = await api.post('/api/user/profile-images', fd, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })

  const data = res?.data?.data || res?.data || {}
  
  updateUserCache({
    avatar: data.avatar,
    cover_photo_url: data.cover_photo || data.cover_photo_url
  })
}

async function uploadSeparate() {
  const promises = []

  if (avatarFile.value) {
    isAvatarLoading.value = true
    const fd = new FormData()
    fd.append('file', avatarFile.value)
    promises.push(
      api.post('/api/user/avatar', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(res => ({ type: 'avatar', data: res?.data?.data || res?.data }))
      .finally(() => { isAvatarLoading.value = false })
    )
  }

  if (coverFile.value) {
    isCoverLoading.value = true
    const fd = new FormData()
    fd.append('cover_photo', coverFile.value)
    promises.push(
      api.post('/api/user/cover-photo', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(res => ({ type: 'cover', data: res?.data?.data || res?.data }))
      .finally(() => { isCoverLoading.value = false })
    )
  }

  const results = await Promise.allSettled(promises)
  
  const updates = {}
  const errors = []

  results.forEach((result, idx) => {
    if (result.status === 'fulfilled') {
      const { type, data } = result.value
      if (type === 'avatar') {
        updates.avatar = data.avatar
      } else if (type === 'cover') {
        updates.cover_photo_url = data.cover_photo_url || data.cover || data.avatar
      }
    } else {
      errors.push(result.reason)
    }
  })

  if (errors.length > 0) {
    throw errors[0] // Throw lỗi đầu tiên để xử lý ở catch
  }

  updateUserCache(updates)
}

function updateUserCache(updates) {
  // Avatar
  if (updates.avatar) {
    auth.user = { ...(auth.user || {}), avatar: updates.avatar }
    avatarPreview.value = updates.avatar
  }

  // Cover
  if (updates.cover_photo_url) {
    auth.user = { ...(auth.user || {}), cover_photo_url: updates.cover_photo_url }
    coverPreview.value = updates.cover_photo_url
  }

  // ✅ Name
  if (updates.name) {
    auth.user = { ...(auth.user || {}), name: updates.name }
  }

  // ✅ Cập nhật localStorage an toàn
  const raw = localStorage.getItem('user')
  if (raw) {
    try {
      const u = JSON.parse(raw)
      if (updates.avatar) u.avatar = updates.avatar
      if (updates.cover_photo_url) u.cover_photo_url = updates.cover_photo_url
      if (updates.name) u.name = updates.name
      localStorage.setItem('user', JSON.stringify(u))
    } catch (e) {
      // ✅ Không chặn flow nếu JSON hỏng
    }
  }
}

</script>

<style scoped>
.pattern-dots-sm {
  background-image: radial-gradient(#cbd5e1 1px, transparent 1.5px);
  background-size: 12px 12px;
  background-position: 0 0;
}
</style>