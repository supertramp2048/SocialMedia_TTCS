<template>
  <div class="space-y-4">
    <!-- Tiêu đề -->
    <label class="block">
      <span class="block text-sm font-medium text-gray-700 mb-1">Title</span>
      <input
        v-model.trim="title"
        type="text"
        class="w-full text-2xl font-bold px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
        placeholder="Enter article title"
      />
    </label>

    <!-- Danh mục -->
    <label class="block">
      <span class="block text-sm font-medium text-gray-700 mb-1">Danh mục</span>
      <select v-model.number="selectedCategoryId" class="border px-3 py-2 rounded">
        <option v-for="c in allCategories" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </label>

    <!-- Ảnh bìa -->
    <label class="block">
      <span class="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa cho bài viết</span>
      
      <!-- Input file ẩn -->
      <input
        ref="fileInputEl"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onCoverChange"
      />
      
      <!-- Div trigger để chọn file -->
      <div
        @click="fileInputEl?.click()"
        class="relative h-[200px] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden"
        :class="coverPreview 
          ? 'border-sky-500 hover:border-sky-600' 
          : 'border-gray-300 hover:border-sky-400 hover:bg-gray-50'"
        :style="coverPreview ? { backgroundImage: `url(${coverPreview})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' } : {}"
      >
        <div v-if="!coverPreview" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <svg class="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="text-sm font-medium">Chọn ảnh bìa</span>
          <span class="text-xs mt-1">Click để tải lên</span>
        </div>

        <div v-if="coverPreview" class="absolute flex text-amber-50 inset-0 opacity-0 hover:opacity-100 hover:bg-black/50  items-center justify-center transition-all">
          
            Click để thay đổi

        </div>
      </div>

      
      <!-- Nút xóa ảnh (hiện khi đã có preview) -->
      <div v-if="coverPreview" class="mt-2">
        <button 
          type="button" 
          class="text-sm text-red-600 hover:text-red-700 underline hover:no-underline transition-all" 
          @click="removeCover"
        >
          Xoá ảnh bìa
        </button>
      </div>
    </label>

    <!-- TinyMCE Editor -->
    <Editor 
      v-model="content" 
      :init="editorInit"
      :api-key="'no-api-key'"
    />

    <!-- Nút đăng -->
    <div class="flex items-center gap-3">
      <button
        :disabled="loading"
        class="px-4 py-2 rounded bg-sky-600 text-white disabled:opacity-60"
        @click="updateArticle"
      >
        <span v-if="!loading">Cập nhật bài viết</span>
        <span v-else>Đang đăng ({{ progress.current }}/{{ progress.total }})…</span>
      </button>

      <button class="px-4 py-2 rounded border" @click="console.log(content)" type="button">
        Log HTML
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import api from '../../../../API/axios'
import { useCategoryStore } from '../../../stores/categories'
import {useRoute} from 'vue-router'
/* ====== QUAN TRỌNG: Import TinyMCE ĐÚNG THỨ TỰ ====== */
// 1. Import core TRƯỚC TIÊN
import tinymce from 'tinymce/tinymce'

// 2. CẤU HÌNH base_url NGAY SAU KHI import core (TRƯỚC KHI import bất kỳ plugin nào)
// Vite sẽ serve /public/tinymce thành /tinymce
if (typeof window !== 'undefined') {
  // Set base_url globally trước khi load bất cứ thứ gì
  tinymce.baseURL = '/tinymce'
}

// 3. SAU ĐÓ mới import theme, icons, models
import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/models/dom'

// 4. CUỐI CÙNG import plugins
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/autolink'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/link'
import 'tinymce/plugins/image'
import 'tinymce/plugins/charmap'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/anchor'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/code'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/insertdatetime'
import 'tinymce/plugins/media'
import 'tinymce/plugins/table'
import 'tinymce/plugins/help'
import 'tinymce/plugins/wordcount'

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET

const categoriesStore = useCategoryStore()
const allCategories = computed(() => categoriesStore?.categories?.data ?? [])

const title = ref('')
const content = ref('')
const thumbnailUrl = ref('')
const loading = ref(false)
const progress = ref({ current: 0, total: 0 })
const selectedCategoryId = ref()
const route = useRoute()
const apiUrl = import.meta.env.VITE_API_BASE
const post = ref()
const postId = ref(null)
/* ====== ẢNH BÌA ====== */
const coverFile = ref(null)
const coverPreview = ref('')

function onCoverChange(e) {
  const f = e.target.files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) {
    alert('Chỉ chọn tệp ảnh.')
    e.target.value = ''
    return
  }
  const MAX = 5 * 1024 * 1024
  if (f.size > MAX) {
    alert('Ảnh quá lớn (>5MB).')
    e.target.value = ''
    return
  }
  coverFile.value = f
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
  coverPreview.value = URL.createObjectURL(f)
}

function removeCover() {
  coverFile.value = null
  if (coverPreview.value) {
    URL.revokeObjectURL(coverPreview.value)
    coverPreview.value = ''
  }
}

onBeforeUnmount(() => {
  if (coverPreview.value) URL.revokeObjectURL(coverPreview.value)
})

/* ====== TinyMCE config (SELF-HOST với GPL license) ====== */
const editorInit = {
  // ⭐ QUAN TRỌNG NHẤT: Khai báo license GPL (miễn phí, self-host)
  license_key: 'gpl',
  
  // Base URL cho self-host (backup, đã set trong tinymce.baseURL ở trên)
  base_url: '/tinymce',
  suffix: '.min',
  
  // Skin paths (tùy chọn, nhưng nên set rõ ràng)
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.min.css',
  
  height: 460,
  menubar: false,
  paste_data_images: true,
  
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  
  toolbar:
    'undo redo | blocks | bold italic underline forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | removeformat | code',
  
  // Tắt các feature cloud/premium
  promotion: false,
  branding: false,
  
  // File picker cho ảnh local
  automatic_uploads: false,
  file_picker_types: 'image',
  file_picker_callback: async (cb, _value, meta) => {
    if (meta.filetype !== 'image') return
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      const dataURL = await new Promise((res, rej) => {
        const fr = new FileReader()
        fr.onload = () => res(fr.result)
        fr.onerror = rej
        fr.readAsDataURL(file)
      })
      cb(dataURL, { alt: file.name })
    }
    input.click()
  },
}

/* ====== Cloudinary upload helpers (giữ nguyên) ====== */
async function uploadToCloudinary(file) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Thiếu VITE_CLOUD_NAME hoặc VITE_UPLOAD_PRESET trong .env')
  }
  const form = new FormData()
  form.append('file', file)
  form.append('upload_preset', UPLOAD_PRESET)
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'Cloudinary upload failed')
  return data.secure_url
}

async function srcToFile(src, nameHint = 'image') {
  const r = await fetch(src)
  const blob = await r.blob()
  const ext = (blob.type && blob.type.split('/')[1]) || 'png'
  return new File([blob], `${nameHint}.${ext}`, { type: blob.type || 'image/png' })
}

async function replaceInlineImagesWithCloudinary(html) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const imgs = Array.from(doc.querySelectorAll('img'))
  const targets = imgs.filter(img => {
    const s = img.getAttribute('src') || ''
    return s.startsWith('data:') || s.startsWith('blob:')
  })

  progress.value.total = targets.length
  progress.value.current = 0

  for (const img of targets) {
    const src = img.getAttribute('src') || ''
    try {
      const file = await srcToFile(src, img.getAttribute('alt') || 'image')
      const secureUrl = await uploadToCloudinary(file)
      img.setAttribute('src', secureUrl)
    } finally {
      progress.value.current += 1
    }
  }

  return doc.body.innerHTML
}

/* ====== update ====== */
async function updateArticle() {
  if (!title.value) return alert('Vui lòng nhập tiêu đề.')
  if (!selectedCategoryId.value) return alert('Vui lòng chọn danh mục.')

  try {
    loading.value = true
    progress.value = { current: 0, total: 0 }

    const finalHtml = await replaceInlineImagesWithCloudinary(content.value)

    if (coverFile.value) {
      thumbnailUrl.value = await uploadToCloudinary(coverFile.value)
    }

    const payload = {
      title: title.value,
      content_html: finalHtml,
      category_id: Number(selectedCategoryId.value),
      thumbnail_url: thumbnailUrl.value,
    }

    await api.put(`/api/posts/${postId.value}`, payload)
    alert('Cập nhật bài viết thành công!')
  } catch (error) {
    console.log('status:', error?.response?.status)
    console.log('data:', error?.response?.data)
    console.log('errors:', error?.response?.data?.errors)
    alert('Đăng thất bại: ' + (error?.response?.data?.message || error?.message || 'Validation error'))
  } finally {
    loading.value = false
  }
}

onMounted(async () =>{
  const id = route.query.postId ? Number(route.query.postId) : null
  console.log("id ben put" , id);
  
  if (!id) return 
  postId.value = id
  
  try {
    const res = await api.get(`${apiUrl}/api/posts/${postId.value}`)
    post.value = res.data
    content.value = post.value.data?.content_html
    title.value = post.value.data?.title
    thumbnailUrl.value = post.value.data?.thumbnail_url
    coverPreview.value = post.value.data?.thumbnail_url
    selectedCategoryId.value = post.value.data?.category?.id
  } catch (error) {
    console.error('❌ Lỗi khi tải bài viết:', error)
    alert("Đã xảy ra lỗi")
  }
  
})


</script>