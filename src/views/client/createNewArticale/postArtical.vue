<template>
  <div class="space-y-4">
    <!-- Tiêu đề -->
    <label class="block">
      <span class="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</span>
      <input
        v-model.trim="title"
        type="text"
        class="w-full text-2xl font-bold px-3 py-2 border rounded focus:outline-none focus:ring focus:ring-sky-200"
        placeholder="Nhập tiêu đề bài viết"
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
        @click.prevent.stop="openThumbDialog"
        class="relative h-[200px] m-auto w-full md:w-[900px] rounded-lg border-2 border-dashed cursor-pointer transition-all overflow-hidden"
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

    <!-- Dialog chọn phương thức -->
    <div v-if="showThumbDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50" @click.self="closeThumbDialog">
      <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
        <h3 class="text-lg font-semibold mb-4">Chọn cách nhập ảnh bìa</h3>
        
        <!-- Chọn phương thức -->
        <div v-if="!thumbMode" class="space-y-3">
          <button
            @click="thumbMode = 'url'"
            class="w-full px-4 py-3 border-2 border-sky-500 text-sky-600 rounded-lg hover:bg-sky-50 transition-colors font-medium"
          >
            📎 Dán URL ảnh
          </button>
          <button
            @click="selectLocalFile"
            class="w-full px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            📁 Chọn từ máy
          </button>
          <button
            @click="closeThumbDialog"
            class="w-full px-4 py-2 text-gray-500 hover:text-gray-700 transition-colors"
          >
            Hủy
          </button>
        </div>

        <!-- Nhập URL -->
        <div v-if="thumbMode === 'url'" class="space-y-3">
          <input
            v-model.trim="tempUrlInput"
            type="url"
            placeholder="https://example.com/image.jpg"
            class="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-sky-500"
            @keyup.enter="confirmUrlInput"
          />
          <div class="flex gap-2">
            <button
              @click="confirmUrlInput"
              :disabled="!isValidUrl(tempUrlInput)"
              class="flex-1 px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Xác nhận
            </button>
            <button
              @click="thumbMode = null; tempUrlInput = ''"
              class="px-4 py-2 border rounded hover:bg-gray-50 transition-colors"
            >
              Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>

    <p class="font-bold">Nội dung bài viết</p>
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
        @click="postArticle"
      >
        <span v-if="!loading">Đăng bài viết</span>
        <span v-else>Đang đăng ({{ progress.current }}/{{ progress.total }})…</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from 'vue'
import Editor from '@tinymce/tinymce-vue'
import api from '../../../../API/axios'
import { useCategoryStore } from '../../../stores/categories'
import { useRouter} from 'vue-router'
/* ====== QUAN TRỌNG: Import TinyMCE ĐÚNG THỨ TỰ ====== */
import tinymce from 'tinymce/tinymce'

if (typeof window !== 'undefined') {
  tinymce.baseURL = '/tinymce'
}

import 'tinymce/icons/default'
import 'tinymce/themes/silver'
import 'tinymce/models/dom'

// --- Import plugin (những plugin có sẵn trong node_modules/tinymce/plugins) ---
import 'tinymce/plugins/accordion';
import 'tinymce/plugins/advlist';
import 'tinymce/plugins/anchor';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/autoresize';
import 'tinymce/plugins/autosave';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/code';
import 'tinymce/plugins/codesample';
import 'tinymce/plugins/directionality';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/help';
import 'tinymce/plugins/image';
import 'tinymce/plugins/importcss';
import 'tinymce/plugins/insertdatetime';
import 'tinymce/plugins/link';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/media';
import 'tinymce/plugins/nonbreaking';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/quickbars';
import 'tinymce/plugins/save';
import 'tinymce/plugins/searchreplace';
import 'tinymce/plugins/table';
import 'tinymce/plugins/visualblocks';
import 'tinymce/plugins/visualchars';
import 'tinymce/plugins/wordcount';
// --- end plugins ---

import { useToast } from 'vue-toastification'


const toast = useToast()
const router = useRouter()
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET

const categoriesStore = useCategoryStore()
const allCategories = computed(() => categoriesStore?.categories?.data ?? [])

const title = ref('')
const content = ref('')
const loading = ref(false)
const progress = ref({ current: 0, total: 0 })
const selectedCategoryId = ref()

/* ====== ẢNH BÌA - Thêm state cho dialog ====== */
const coverFile = ref(null)
const coverPreview = ref('')
const fileInputEl = ref(null)

// State cho dialog chọn phương thức
const showThumbDialog = ref(false)
const thumbMode = ref(null)
const thumbnailUrlManual = ref('')
const tempUrlInput = ref('')

// Mở dialog chọn phương thức
function openThumbDialog() {
  showThumbDialog.value = true
  thumbMode.value = null
  tempUrlInput.value = ''
}

// Đóng dialog
function closeThumbDialog() {
  showThumbDialog.value = false
  thumbMode.value = null
  tempUrlInput.value = ''
}

// Kiểm tra URL hợp lệ
function isValidUrl(url) {
  return url && (url.startsWith('http://') || url.startsWith('https://'))
}

// Xác nhận nhập URL
function confirmUrlInput() {
  if (!isValidUrl(tempUrlInput.value)) {
    toast.error("Vui lòng nhập URL hợp lệ")
    return
  }
  
  // Reset coverFile nếu đang có
  if (coverFile.value) {
    coverFile.value = null
  }
  if (coverPreview.value && coverPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value)
  }
  
  // Set URL manual và preview
  thumbnailUrlManual.value = tempUrlInput.value
  coverPreview.value = tempUrlInput.value
  
  closeThumbDialog()
}

// Chọn file từ máy
function selectLocalFile() {
  closeThumbDialog()
  // Reset URL manual nếu đang có
  thumbnailUrlManual.value = ''
  // Trigger input file
  fileInputEl.value?.click()
}

function onCoverChange(e) {
  const f = e.target.files?.[0]
  if (!f) return
  if (!f.type.startsWith('image/')) {
    toast.error('Chỉ chọn tệp ảnh.')
    e.target.value = ''
    return
  }
  const MAX = 5 * 1024 * 1024
  if (f.size > MAX) {
    toast.error('Ảnh quá lớn (>5MB).')
    
    e.target.value = ''
    return
  }
  
  // Reset URL manual nếu đang có
  thumbnailUrlManual.value = ''
  
  coverFile.value = f
  if (coverPreview.value && coverPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value)
  }
  coverPreview.value = URL.createObjectURL(f)
}

function removeCover() {
  // Reset tất cả
  coverFile.value = null
  thumbnailUrlManual.value = ''
  
  if (coverPreview.value && coverPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value)
  }
  coverPreview.value = ''
  
  if (fileInputEl.value) {
    fileInputEl.value.value = ''
  }
}

onBeforeUnmount(() => {
  if (coverPreview.value && coverPreview.value.startsWith('blob:')) {
    URL.revokeObjectURL(coverPreview.value)
  }
})

/* ====== TinyMCE config (SELF-HOST với GPL license) ====== */
const editorInit = {
  license_key: 'gpl',
  base_url: '/tinymce',
  suffix: '.min',
  skin_url: '/tinymce/skins/ui/oxide',
  content_css: '/tinymce/skins/content/default/content.min.css',
  height: 600,
  menubar: false,
  paste_data_images: true,
  
  // Định nghĩa formats cho font-size và font-family
  formats: {
    fontsize_12px: { inline: 'span', styles: { 'font-size': '12px' } },
    fontsize_14px: { inline: 'span', styles: { 'font-size': '14px' } },
    fontsize_16px: { inline: 'span', styles: { 'font-size': '16px' } },
    fontsize_18px: { inline: 'span', styles: { 'font-size': '18px' } },
    fontsize_24px: { inline: 'span', styles: { 'font-size': '24px' } },
    fontsize_32px: { inline: 'span', styles: { 'font-size': '32px' } },
    fontsize_48px: { inline: 'span', styles: { 'font-size': '48px' } },
    
    fontfamily_arial: { inline: 'span', styles: { 'font-family': 'Arial, sans-serif' } },
    fontfamily_times: { inline: 'span', styles: { 'font-family': 'Times New Roman, serif' } },
    fontfamily_courier: { inline: 'span', styles: { 'font-family': 'Courier New, monospace' } },
    fontfamily_verdana: { inline: 'span', styles: { 'font-family': 'Verdana, sans-serif' } },
    fontfamily_georgia: { inline: 'span', styles: { 'font-family': 'Georgia, serif' } },
  },
  
  // Cho phép inline styles (font-size, font-family) không bị strip
  extended_valid_elements: 'span[style|class]',
  valid_styles: {
    '*': 'font-size,font-family,color,text-align,text-decoration,font-weight,font-style,background-color'
  },
  
  plugins: [
    'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
    'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
    'insertdatetime', 'media', 'table', 'help', 'wordcount'
  ],
  
  // Thêm custom buttons vào toolbar
  toolbar:
    'undo redo | blocks | customFontSize customFontFamily | bold italic underline forecolor backcolor | ' +
    'alignleft aligncenter alignright alignjustify | ' +
    'bullist numlist outdent indent | link image | removeformat | code',
  
  promotion: false,
  branding: false,
  automatic_uploads: false,
  file_picker_types: 'image',
  
  // Setup custom dropdowns
  setup: (editor) => {
    // Custom Font Size Dropdown
    editor.ui.registry.addMenuButton('customFontSize', {
      text: 'Cỡ chữ',
      tooltip: 'Chọn cỡ chữ',
      fetch: (callback) => {
        const items = [
          { type: 'menuitem', text: '12px', onAction: () => editor.formatter.apply('fontsize_12px') },
          { type: 'menuitem', text: '14px', onAction: () => editor.formatter.apply('fontsize_14px') },
          { type: 'menuitem', text: '16px', onAction: () => editor.formatter.apply('fontsize_16px') },
          { type: 'menuitem', text: '18px', onAction: () => editor.formatter.apply('fontsize_18px') },
          { type: 'menuitem', text: '24px', onAction: () => editor.formatter.apply('fontsize_24px') },
          { type: 'menuitem', text: '32px', onAction: () => editor.formatter.apply('fontsize_32px') },
          { type: 'menuitem', text: '48px', onAction: () => editor.formatter.apply('fontsize_48px') },
        ];
        callback(items);
      }
    });

    // Custom Font Family Dropdown
    editor.ui.registry.addMenuButton('customFontFamily', {
      text: 'Font chữ',
      tooltip: 'Chọn font chữ',
      fetch: (callback) => {
        const items = [
          { type: 'menuitem', text: 'Arial', onAction: () => editor.formatter.apply('fontfamily_arial') },
          { type: 'menuitem', text: 'Times New Roman', onAction: () => editor.formatter.apply('fontfamily_times') },
          { type: 'menuitem', text: 'Courier New', onAction: () => editor.formatter.apply('fontfamily_courier') },
          { type: 'menuitem', text: 'Verdana', onAction: () => editor.formatter.apply('fontfamily_verdana') },
          { type: 'menuitem', text: 'Georgia', onAction: () => editor.formatter.apply('fontfamily_georgia') },
        ];
        callback(items);
      }
    });
  },
  
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

/* ====== Cloudinary upload helpers ====== */
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

/* ====== Submit với logic ưu tiên thumbnailUrlManual ====== */
async function postArticle() {
  if (!selectedCategoryId.value) return toast.error('Vui lòng chọn danh mục.') 

  try {
    loading.value = true
    progress.value = { current: 0, total: 0 }

    const finalHtml = await replaceInlineImagesWithCloudinary(content.value)

    let thumbnailUrl = null
    
    // Ưu tiên URL manual trước
    if (thumbnailUrlManual.value) {
      thumbnailUrl = thumbnailUrlManual.value
    } else if (coverFile.value) {
      // Nếu không có URL manual, mới upload file
      thumbnailUrl = await uploadToCloudinary(coverFile.value)
    }

    const payload = {
      title: title.value,
      content_html: finalHtml,
      category_id: Number(selectedCategoryId.value),
      thumbnail_url: thumbnailUrl,
    }

    const res = await api.post('/api/posts', payload)

    toast.success('Đăng bài thành công!')
    router.push({
      path:'/bai-dang',
      query: {
      id: res.data.data.id
    } 
   })
    
  } catch (error) {
    console.log('status:', error?.response?.status)
    console.log('data:', error?.response?.data)
    console.log('errors:', error?.response?.data?.errors)
    toast.error('Đăng thất bại: '+ (error?.response?.data?.message || error?.message || 'Validation error'))

  } finally {
    loading.value = false
  }
}

/* ====== Debug ====== */
onMounted(() => {
  console.log('🔍 TinyMCE Debug Info:')
  console.log('- baseURL:', tinymce.baseURL)
  console.log('- TinyMCE version:', tinymce.majorVersion + '.' + tinymce.minorVersion)
  console.log('- Loaded from:', tinymce.baseURI?.source)
})
</script>