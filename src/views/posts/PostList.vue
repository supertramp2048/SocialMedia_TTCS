<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Posts</h1>

    <DataTable
      :columns="columns"
      :data="postsStore.posts"
      :searchable="true"
      search-placeholder="Search posts..."
      @search="handleSearch"
    >
      <template #cell-title="{ row }">
        <router-link
          :to="`/admin/posts/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          {{ row.title }}
        </router-link>
      </template>
      <template #cell-status="{ row }">
        <Badge :label="row.status" :variant="getStatusVariant(row.status)" />
      </template>
      <template #actions="{ row }">
        <router-link
          :to="`/admin/posts/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          View
        </router-link>
        <button
          v-if="row.status === 'published'"
          @click="handleDelete(row)"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          Remove
        </button>
      </template>
    </DataTable>

    <Pagination
      v-if="postsStore.pagination.total > 0"
      :current-page="postsStore.pagination.current_page"
      :last-page="postsStore.pagination.last_page"
      :total="postsStore.pagination.total"
      :from="(postsStore.pagination.current_page - 1) * postsStore.pagination.per_page + 1"
      :to="Math.min(postsStore.pagination.current_page * postsStore.pagination.per_page, postsStore.pagination.total)"
      @page-change="handlePageChange"
    />

    <Modal
      :is-open="deleteModalOpen"
      title="Remove Post"
      @close="deleteModalOpen = false"
      @confirm="confirmDelete"
    >
      <p>Are you sure you want to remove this post? This action cannot be undone.</p>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import Modal from '@/components/common/Modal.vue'
import Badge from '@/components/common/Badge.vue'

const postsStore = usePostsStore()
const toast = useToast()

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'user.name', label: 'Author' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created' },
]

const deleteModalOpen = ref(false)
const selectedPost = ref()

const getStatusVariant = (status) => {
  if (status === 'published') return 'success'
  if (status === 'removed_by_mod') return 'danger'
  return 'warning'
}

const handleSearch = (query) => {
  postsStore.fetchPosts({ q: query, page: 1 })
}

const handlePageChange = (page) => {
  postsStore.fetchPosts({ page })
}

const handleDelete = (post) => {
  selectedPost.value = post
  deleteModalOpen.value = true
}

const confirmDelete = async () => {
  if (!selectedPost.value) return

  try {
    await postsStore.deletePost(selectedPost.value.id)
    toast.success('Post removed successfully')
    deleteModalOpen.value = false
    selectedPost.value = null
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove post')
  }
}

onMounted(() => {
  postsStore.fetchPosts()
})
</script>

