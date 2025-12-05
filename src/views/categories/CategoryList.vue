<template>
  <div>
    <div class="flex justify-between items-center mb-6">
<<<<<<< HEAD
      <h1 class="text-2xl font-bold text-gray-900">Danh mục</h1>
=======
      <h1 class="text-2xl font-bold text-gray-900">Categories</h1>
>>>>>>> oldrepo/adminFrontOnly
      <button
        @click="openCreateModal"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
<<<<<<< HEAD
        Tạo danh mục mới
=======
        Create Category
>>>>>>> oldrepo/adminFrontOnly
      </button>
    </div>

    <DataTable
      :columns="columns"
      :data="categoriesStore.categories"
      :searchable="true"
      search-placeholder="Search categories..."
      @search="handleSearch"
    >
      <!-- Cột actions -->
      <template #cell-actions="{ row }">
        <button
          @click="handleEdit(row)"
          class="text-blue-600 hover:text-blue-800"
        >
          Edit
        </button>
        <button
          @click="handleDelete(row)"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </template>
    </DataTable>

    <Pagination
      v-if="categoriesStore.pagination.total > 0"
      :current-page="categoriesStore.pagination.current_page"
      :last-page="categoriesStore.pagination.last_page"
      :total="categoriesStore.pagination.total"
      :from="(categoriesStore.pagination.current_page - 1) * categoriesStore.pagination.per_page + 1"
      :to="Math.min(
        categoriesStore.pagination.current_page * categoriesStore.pagination.per_page,
        categoriesStore.pagination.total
      )"
      @page-change="handlePageChange"
    />

    <!-- Modal tạo / sửa -->
    <Modal
      :is-open="showCreateModal || showEditModal"
      :title="showEditModal ? 'Edit Category' : 'Create Category'"
      @close="closeModal"
      @confirm="handleConfirm"
    >
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Name</label>
          <input
            v-model="form.name"
            type="text"
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Category name"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Slug (optional)</label>
          <input
            v-model="form.slug"
            type="text"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="category-slug"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Description (optional)</label>
          <textarea
            v-model="form.description"
            rows="3"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Category description"
          ></textarea>
        </div>
      </div>
    </Modal>

    <!-- Modal xóa -->
    <Modal
      :is-open="deleteModalOpen"
      title="Delete Category"
      @close="deleteModalOpen = false"
      @confirm="confirmDelete"
    >
      <p>Are you sure you want to delete this category? This action cannot be undone.</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useCategoriesStore } from '@/stores/categories'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import Modal from '@/components/common/Modal.vue'

const categoriesStore = useCategoriesStore()
const toast = useToast()

const columns = [
<<<<<<< HEAD
  { key: 'name', label: 'Tên danh mục' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Mô tả' },
  { key: 'actions', label: 'Xử lý' },
=======
  { key: 'name', label: 'Name' },
  { key: 'slug', label: 'Slug' },
  { key: 'description', label: 'Description' },
  { key: 'actions', label: 'Actions' },
>>>>>>> oldrepo/adminFrontOnly
]

const showCreateModal = ref(false)
const showEditModal = ref(false)
const deleteModalOpen = ref(false)
const selectedCategory = ref(null)

// Dùng reactive cho form
const form = reactive({
  name: '',
  slug: '',
  description: '',
})

const handleSearch = (query) => {
  categoriesStore.fetchCategories({ page: 1 })
}

const handlePageChange = (page) => {
  categoriesStore.fetchCategories({ page })
}

const openCreateModal = () => {
  selectedCategory.value = null
  form.name = ''
  form.slug = ''
  form.description = ''
  showCreateModal.value = true
}

const handleEdit = (category) => {
  selectedCategory.value = category
  form.name = category?.name ?? ''
  form.slug = category?.slug ?? ''
  form.description = category?.description ?? ''
  showEditModal.value = true
}

const handleDelete = (category) => {
  selectedCategory.value = category
  deleteModalOpen.value = true
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  form.name = ''
  form.slug = ''
  form.description = ''
  selectedCategory.value = null
}

const handleConfirm = async () => {
  try {
    if (showEditModal.value && selectedCategory.value) {
      await categoriesStore.updateCategory(selectedCategory.value.id, { ...form })
      toast.success('Category updated successfully')
    } else {
      await categoriesStore.createCategory({ ...form })
      toast.success('Category created successfully')
    }
    closeModal()
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to save category')
  }
}

const confirmDelete = async () => {
  if (!selectedCategory.value) return

  try {
    await categoriesStore.deleteCategory(selectedCategory.value.id)
    toast.success('Category deleted successfully')
    deleteModalOpen.value = false
    selectedCategory.value = null
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to delete category')
  }
}

onMounted(() => {
  categoriesStore.fetchCategories()
})
</script>
