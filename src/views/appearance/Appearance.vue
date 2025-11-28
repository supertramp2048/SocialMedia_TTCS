<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Appearance Settings</h1>

    <div class="bg-white rounded-lg shadow p-6">
      <div class="space-y-6">
        <!-- Thông báo -->
        <div v-if="successMessage" class="p-3 rounded bg-green-50 text-green-700 text-sm">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="p-3 rounded bg-red-50 text-red-700 text-sm">
          {{ errorMessage }}
        </div>

        <!-- LOGO -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Site Logo</label>

          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <input
                type="file"
                accept="image/*"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                @change="handleLogoChange"
              />
              <p class="mt-1 text-sm text-gray-500">
                Upload a logo for your site (png, jpg, svg - Max 2MB)
              </p>
            </div>

            <div v-if="logoPreview" class="w-20 h-20 border rounded flex items-center justify-center bg-gray-50">
              <img
                :src="logoPreview"
                alt="Current logo"
                class="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        </div>

        <!-- BACKGROUND / BANNER -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Site Banner / Background</label>

          <div class="flex items-center space-x-4">
            <div class="flex-1">
              <input
                type="file"
                accept="image/*"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg"
                @change="handleBackgroundChange"
              />
              <p class="mt-1 text-sm text-gray-500">
                Upload a banner / background image (png, jpg, svg - Max 2MB)
              </p>
            </div>

            <div
              v-if="backgroundPreview"
              class="w-32 h-20 border rounded overflow-hidden bg-gray-50"
            >
              <img
                :src="backgroundPreview"
                alt="Current background"
                class="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <!-- PRIMARY COLOR (hiện chỉ lưu local, chưa có API backend) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
          <input
            v-model="primaryColor"
            type="color"
            class="h-10 w-20 border border-gray-300 rounded"
          />
        </div>

        <!-- FOOTER CONTENT -->
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Footer Description
            </label>
            <textarea
              rows="3"
              v-model="footerDescription"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="Mạng xã hội chia sẻ quan điểm và kiến thức..."
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Footer Copyright
            </label>
            <input
              type="text"
              v-model="footerCopyright"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg"
              placeholder="© 2025 My Awesome Site. All rights reserved."
            />
          </div>

          <!-- FOOTER LINKS -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">
                Footer Links
              </label>
              <button
                type="button"
                class="text-sm text-blue-600 hover:underline"
                @click="addFooterLink"
              >
                + Add link
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(link, index) in footerLinks"
                :key="index"
                class="flex space-x-2"
              >
                <input
                  v-model="link.label"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Label (vd: Về chúng tôi)"
                />
                <input
                  v-model="link.url"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="URL (vd: /about)"
                />
                <button
                  type="button"
                  class="px-2 text-red-500 text-sm"
                  @click="removeFooterLink(index)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>

          <!-- FOOTER SOCIALS -->
          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="block text-sm font-medium text-gray-700">
                Footer Socials
              </label>
              <button
                type="button"
                class="text-sm text-blue-600 hover:underline"
                @click="addFooterSocial"
              >
                + Add social
              </button>
            </div>

            <div class="space-y-2">
              <div
                v-for="(social, index) in footerSocials"
                :key="index"
                class="flex space-x-2"
              >
                <input
                  v-model="social.platform"
                  type="text"
                  class="w-32 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="Platform (facebook, youtube...)"
                />
                <input
                  v-model="social.url"
                  type="text"
                  class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  placeholder="URL (vd: https://facebook.com/spiderum)"
                />
                <button
                  type="button"
                  class="px-2 text-red-500 text-sm"
                  @click="removeFooterSocial(index)"
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVE BUTTON -->
        <div class="flex justify-end">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
            :disabled="isSaving"
            @click="handleSave"
          >
            <span v-if="isSaving">Saving...</span>
            <span v-else>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useSettingStore } from '../../stores/pageSetting' // chỉnh lại nếu đường dẫn khác

const settingStore = useSettingStore()

// ===== LOCAL STATE =====
const logoFile = ref(null)
const backgroundFile = ref(null)

const primaryColor = ref('#2563eb') // tạm local, nếu sau này có API thì gửi lên

const footerDescription = ref('')
const footerCopyright = ref('')
const footerLinks = ref([])
const footerSocials = ref([])

const successMessage = ref('')
const errorMessage = ref('')
const isSaving = ref(false)

// ===== PREVIEW =====
const logoPreview = computed(() => {
  if (logoFile.value) {
    return URL.createObjectURL(logoFile.value)
  }
  return settingStore.logoUrl || null
})

const backgroundPreview = computed(() => {
  if (backgroundFile.value) {
    return URL.createObjectURL(backgroundFile.value)
  }
  return settingStore.backgroundUrl || null
})

// ===== HANDLERS =====
const handleLogoChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  logoFile.value = file
}

const handleBackgroundChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) return
  backgroundFile.value = file
}

const addFooterLink = () => {
  footerLinks.value.push({ label: '', url: '' })
}

const removeFooterLink = (index) => {
  footerLinks.value.splice(index, 1)
}

const addFooterSocial = () => {
  footerSocials.value.push({ platform: '', url: '' })
}

const removeFooterSocial = (index) => {
  footerSocials.value.splice(index, 1)
}

// Đồng bộ dữ liệu footer từ store vào local form
const syncFooterFromStore = () => {
  const f = settingStore.footer || {}
  footerDescription.value = f.footer_description || ''
  footerCopyright.value = f.footer_copyright || ''
  footerLinks.value = Array.isArray(f.footer_links) ? [...f.footer_links] : []
  footerSocials.value = Array.isArray(f.footer_socials) ? [...f.footer_socials] : []
}

// ===== SAVE =====
const handleSave = async () => {
  successMessage.value = ''
  errorMessage.value = ''
  isSaving.value = true

  try {
    // 1. Upload logo nếu có file mới
    if (logoFile.value) {
      await settingStore.updateLogo(logoFile.value)
    }

    // 2. Upload background nếu có file mới
    if (backgroundFile.value) {
      await settingStore.updateBackground(backgroundFile.value)
    }

    // 3. Gửi footer
    const payload = {
      footer_description: footerDescription.value,
      footer_copyright: footerCopyright.value,
      footer_links: footerLinks.value,
      footer_socials: footerSocials.value,
    }
    await settingStore.updateFooter(payload)

    successMessage.value = 'Settings have been saved successfully.'
  } catch (error) {
    console.error(error)
    errorMessage.value = 'Failed to save settings. Please try again.'
  } finally {
    isSaving.value = false
  }
}

// ===== INIT =====
onMounted(async () => {
  try {
    await Promise.all([
      settingStore.fetchLogo(),
      settingStore.fetchBackground(),
      settingStore.fetchFooter(),
    ])
    syncFooterFromStore()
  } catch (error) {
    console.error('Init appearance settings error:', error)
  }
})
</script>
