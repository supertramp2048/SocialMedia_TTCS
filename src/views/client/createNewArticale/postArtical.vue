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
      <input
        type="file"
        accept="image/*"
        class="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
        @change="onCoverChange"
      />
      <!-- Preview -->
      <div v-if="coverPreview" class="mt-3">
        <img :src="coverPreview" alt="Cover preview" class="max-h-64 rounded border" />
        <div class="mt-2">
          <button type="button" class="text-sm text-red-600 underline" @click="removeCover">
            Xoá ảnh bìa
          </button>
        </div>
      </div>
    </label>

    <!-- TinyMCE -->
    <Editor v-model="content" :init="editorInit" :api-key="TINYMCE_API_KEY" />

    <!-- Nút đăng -->
    <div class="flex items-center gap-3">
      <button
        :disabled="loading"
        class="px-4 py-2 rounded bg-sky-600 text-white disabled:opacity-60"
        @click="postArticle"
      >
        <span v-if="!loading">Đăng bài viết</span>
        <span v-else>Đang đăng ({{ progress.current }}/{{ progress.total }})…</span>
      </button>

      <button class="px-4 py-2 rounded border" @click="console.log(content)" type="button">
        Log HTML
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import api from '../../../../API/axios'
import { useCategoryStore } from '../../../stores/categories'

const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET
const TINYMCE_API_KEY = import.meta.env.VITE_TINYMCE_API_KEY // nhớ đúng key VITE_TINYMCE_API_KEY

const categoriesStore = useCategoryStore()
const allCategories = computed(() => categoriesStore?.categories?.data ?? [])

const title = ref('')
const content = ref('')
const loading = ref(false)
const progress = ref({ current: 0, total: 0 })
const selectedCategoryId = ref()

/* ====== ẢNH BÌA: state + handler ====== */
const coverFile = ref(null)       // File người dùng chọn
const coverPreview = ref('')      // URL preview (ObjectURL)

function onCoverChange(e) {
  const f = e.target.files?.[0]
  if (!f) return

  // Validate cơ bản
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
  // Tạo preview
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

/* ====== TinyMCE config (không upload auto) ====== */
const editorInit = {
  height: 460,
  menubar: false,
  paste_data_images: true,
  plugins: [
    'advlist autolink lists link image charmap preview anchor',
    'searchreplace visualblocks code fullscreen',
    'insertdatetime media table paste code help wordcount'
  ],
  toolbar:
    'undo redo | blocks | bold italic underline | alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | removeformat | code',
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

/* ====== HỖ TRỢ: upload Cloudinary & xử lý ảnh trong content ====== */
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

/* ====== Submit ====== */
async function postArticle() {
  if (!title.value) return alert('Vui lòng nhập tiêu đề.')
  if (!selectedCategoryId.value) return alert('Vui lòng chọn danh mục.')

  try {
    loading.value = true
    progress.value = { current: 0, total: 0 }

    // 1) Xử lý ảnh trong nội dung → đổi sang URL Cloudinary
    const finalHtml = await replaceInlineImagesWithCloudinary(content.value)

    // 2) Upload ảnh bìa (nếu có)
    let thumbnailUrl = null
    if (coverFile.value) {
      thumbnailUrl = await uploadToCloudinary(coverFile.value)
    }

    // 3) Gửi payload lên backend (thêm thumbnail_url)
    const payload = {
      title: title.value,
      content_html: finalHtml,           // hoặc 'content' nếu backend yêu cầu tên đó
      category_id: Number(selectedCategoryId.value),
      thumbnail_url: thumbnailUrl,       // <— URL ảnh bìa từ Cloudinary
    }

    await api.post('/api/posts', payload)
    alert('Đăng bài thành công!')

    // Tuỳ bạn: reset form
    // title.value = ''; content.value = ''; selectedCategoryId.value = null; removeCover()
  } catch (error) {
    console.log('status:', error?.response?.status)
    console.log('data:', error?.response?.data)
    console.log('errors:', error?.response?.data?.errors)
    alert('Đăng thất bại: ' + (error?.response?.data?.message || error?.message || 'Validation error'))
  } finally {
    loading.value = false
  }
}
</script>
