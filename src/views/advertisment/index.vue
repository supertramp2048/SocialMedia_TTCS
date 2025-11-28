<template>
  <div>
    <!-- Tiêu đề trang -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Quảng cáo</h1>
      <button
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        @click="openCreateModal"
      >
        + Tạo quảng cáo
      </button>
    </div>

    <!-- Bảng danh sách quảng cáo -->
    <div class="bg-white rounded-lg shadow overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Tiêu đề</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ảnh</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Link</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Vị trí</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Thứ tự</th>
            <th class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Ngày tạo</th>
            <th class="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="store.loading">
            <td colspan="9" class="px-4 py-4 text-center text-gray-500">
              Đang tải dữ liệu...
            </td>
          </tr>
          <tr v-else-if="!store.advertisements">
            <td colspan="9" class="px-4 py-4 text-center text-gray-500">
              Chưa có quảng cáo nào.
            </td>
          </tr>
          <tr v-for="ad in store.advertisements" :key="ad.id">
            <td class="px-4 py-2 text-sm text-gray-900">{{ ad.id }}</td>
            <td class="px-4 py-2 text-sm text-gray-900 max-w-xs truncate" :title="ad.title">
              {{ ad.title }}
            </td>
            <td class="px-4 py-2 text-sm text-gray-900">
              <div v-if="ad.image_url" class="w-24 h-14 rounded border overflow-hidden">
                <img :src="ad.image_url" alt="Ad image" class="w-full h-full object-cover" />
              </div>
              <span v-else class="text-gray-400 text-xs">Không có ảnh</span>
            </td>
            <td class="px-4 py-2 text-sm text-blue-600 max-w-xs truncate" :title="ad.link_url">
              <a
                v-if="ad.link_url"
                :href="ad.link_url"
                target="_blank"
                rel="noopener noreferrer"
                class="hover:underline"
              >
                {{ ad.link_url }}
              </a>
              <span v-else class="text-gray-400 text-xs">Không có link</span>
            </td>
            <td class="px-4 py-2 text-sm text-gray-900">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="ad.position === 'sidebar_top'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-indigo-100 text-indigo-700'"
              >
                {{ positionLabel(ad.position) }}
              </span>
            </td>
            <td class="px-4 py-2 text-sm">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                :class="ad.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-200 text-gray-700'"
              >
                {{ ad.status === 'active' ? 'Hoạt động' : 'Không hoạt động' }}
              </span>
            </td>
            <td class="px-4 py-2 text-sm text-gray-900">
              {{ ad.display_order ?? 0 }}
            </td>
            <td class="px-4 py-2 text-sm text-gray-500">
              {{ formatDate(ad.created_at) }}
            </td>
            <td class="px-4 py-2 text-sm text-right space-x-2">
              <button
                class="text-blue-600 hover:text-blue-800 text-sm"
                @click="openEditModal(ad)"
              >
                Sửa
              </button>
              <button
                class="text-red-600 hover:text-red-800 text-sm"
                @click="handleDelete(ad)"
              >
                Xóa
              </button>
            </td>
          </tr>
        </tbody>
      </table>

        <Pagination
      v-if="store?.pagination?.total > 0"
      :current-page="store.pagination.current_page"
      :last-page="store.pagination.last_page"
      :total="store.pagination?.total"
      :from="(store.pagination.current_page - 1) * store.pagination.per_page + 1"
      :to="Math.min(
        store.pagination.current_page * store.pagination.per_page,
        store.pagination.total
      )"
      @page-change="handlePageChange"
    />

    </div>
    <!-- Modal tạo / sửa quảng cáo -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
        @click.self="closeModal"
      >
        <div class="w-full max-w-xl bg-white rounded-lg shadow-xl p-6 relative">
          <button
            class="absolute right-4 top-3 text-gray-400 hover:text-gray-600 text-xl"
            @click="closeModal"
          >
            &times;
          </button>

          <h2 class="text-xl font-bold text-gray-900 mb-4">
            {{ isEdit ? 'Cập nhật quảng cáo' : 'Tạo quảng cáo mới' }}
          </h2>

          <form @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Tiêu đề -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề
              </label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="Nhập tiêu đề quảng cáo"
                required
              />
            </div>

            <!-- Link URL -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Link URL
              </label>
              <input
                v-model="form.link_url"
                type="url"
                class="w-full px-3 py-2 border rounded-lg text-sm"
                placeholder="https://example.com"
              />
            </div>

            <!-- Vị trí + Thứ tự -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Vị trí hiển thị
                </label>
                <select
                  v-model="form.position"
                  class="w-full px-3 py-2 border rounded-lg text-sm"
                  required
                >
                  <option value="sidebar_top">Sidebar trên (sidebar_top)</option>
                  <option value="in_feed">Trong luồng bài viết (in_feed)</option>
                  <option value="left_sideBar">sidebar trái (left_sideBar)</option>
                  <option value="right_sideBar">sidebar phải (right_sideBar)</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Thứ tự hiển thị
                </label>
                <input
                  v-model.number="form.display_order"
                  type="number"
                  min="0"
                  class="w-full px-3 py-2 border rounded-lg text-sm"
                  placeholder="0"
                />
              </div>
            </div>

            <!-- Trạng thái -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Trạng thái
              </label>
              <select
                v-model="form.status"
                class="w-full px-3 py-2 border rounded-lg text-sm"
              >
                <option value="active">Hoạt động</option>
                <option value="inactive">Không hoạt động</option>
              </select>
            </div>

            <!-- Ảnh quảng cáo -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Ảnh quảng cáo
              </label>
              <div class="flex items-center space-x-4">
                <div class="flex-1">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50"
                    @change="onFileChange"
                  />
                  <p class="mt-1 text-xs text-gray-500">
                    Chọn 1 ảnh (png, jpg, jpeg, svg) &lt;= 2MB
                  </p>
                </div>
                <div
                  v-if="imagePreview"
                  class="w-24 h-14 rounded border overflow-hidden bg-gray-50"
                >
                  <img :src="imagePreview" alt="Preview" class="w-full h-full object-cover" />
                </div>
              </div>
              <p v-if="isEdit && !imageFile && form.image_url" class="mt-1 text-xs text-gray-500">
                Nếu không chọn ảnh mới, sẽ giữ nguyên ảnh hiện tại.
              </p>
            </div>

            <!-- Nút hành động -->
            <div class="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                class="px-4 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                @click="closeModal"
              >
                Hủy
              </button>
              <button
                type="submit"
                class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:opacity-60"
                :disabled="submitting"
              >
                <span v-if="submitting">
                  {{ isEdit ? 'Đang cập nhật...' : 'Đang tạo...' }}
                </span>
                <span v-else>
                  {{ isEdit ? 'Cập nhật' : 'Tạo mới' }}
                </span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </Teleport>
  </div>
  <FullScreenLoader :show="store.loading"></FullScreenLoader>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useAdvertisementsStore } from '../../stores/advertisment'
import Pagination from '../../components/common/Pagination.vue'
import FullScreenLoader from '../../components/common/fullScreenLoading.vue'
const store = useAdvertisementsStore()

const showModal = ref(false)
const isEdit = ref(false)
const submitting = ref(false)

// form cơ bản
const form = reactive({
  id: null,
  title: '',
  link_url: '',
  position: 'sidebar_top',
  status: 'active',
  display_order: 0,
  image_url: null, // để giữ ảnh cũ khi edit (nếu muốn hiển thị)
})

// file ảnh & preview
const imageFile = ref(null)
const fileInput = ref(null)

const imagePreview = computed(() => {
  if (imageFile.value) {
    return URL.createObjectURL(imageFile.value)
  }
  // khi edit: nếu không chọn file mới thì dùng image_url hiện có
  return form.image_url || null
})

const resetForm = () => {
  form.id = null
  form.title = ''
  form.link_url = ''
  form.position = 'sidebar_top'
  form.status = 'active'
  form.display_order = 0
  form.image_url = null
  imageFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openCreateModal = () => {
  resetForm()
  isEdit.value = false
  showModal.value = true
}

const openEditModal = (ad) => {
  resetForm()
  isEdit.value = true
  form.id = ad.id
  form.title = ad.title
  form.link_url = ad.link_url
  form.position = ad.position
  form.status = ad.status
  form.display_order = ad.display_order ?? 0
  form.image_url = ad.image_url || null
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const onFileChange = (event) => {
  const file = event.target.files?.[0]
  if (!file) {
    imageFile.value = null
    return
  }
  imageFile.value = file
}

// đổi trang
const changePage = async () => {
  await store.fetchAdvertisements()
}

// label vị trí
const positionLabel = (pos) => {
  if (pos === 'sidebar_top') return 'Sidebar trên'
  if (pos === 'in_feed') return 'Trong luồng bài viết'
  return pos
}

// format ngày đơn giản
const formatDate = (value) => {
  if (!value) return ''
  try {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return value
    return d.toLocaleString('vi-VN')
  } catch {
    return value
  }
}

const handleSubmit = async () => {
  submitting.value = true
  try {
    const formData = new FormData()
    formData.append('title', form.title)
    if (form.link_url) formData.append('link_url', form.link_url)
    formData.append('position', form.position)
    formData.append('status', form.status)
    if (form.display_order !== null && form.display_order !== undefined) {
      formData.append('display_order', String(form.display_order))
    }
    if (imageFile.value) {
      formData.append('image_file', imageFile.value)
    }

    if (isEdit.value && form.id) {
      await store.updateAdvertisement(form.id, formData)
    } else {
      await store.createAdvertisement(formData)
    }

    closeModal()
  } catch (error) {
    console.error('Lỗi khi submit quảng cáo:', error)
    // anh có thể thêm toast / thông báo lỗi ở đây
  } finally {
    submitting.value = false
  }
}

const handleDelete = async (ad) => {
  const ok = window.confirm(`Bạn có chắc muốn xóa quảng cáo ID ${ad.id}?`)
  if (!ok) return
  try {
    await store.deleteAdvertisement(ad.id)
  } catch (error) {
    console.error('Lỗi khi xóa quảng cáo:', error)
  }
}
const handlePageChange = async (page) => {
    await store.fetchAdvertisements({page})
}
// init
onMounted(async () => {
  await store.fetchAdvertisements()
})
</script>
