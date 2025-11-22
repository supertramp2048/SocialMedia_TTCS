<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Locked Posts</h1>

    <DataTable
      :columns="columns"
      :data="postsStore.posts"
      :searchable="true"
      search-placeholder="Search locked posts..."
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
        <Badge :label="row.status" variant="danger" />
      </template>
      <template #actions="{ row }">
        <router-link
          :to="`/admin/posts/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          View
        </router-link>
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
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import Badge from '@/components/common/Badge.vue'

const postsStore = usePostsStore()

const columns = [
  { key: 'title', label: 'Title' },
  { key: 'user.name', label: 'Author' },
  { key: 'status', label: 'Status' },
  { key: 'created_at', label: 'Created' },
]

const handleSearch = (query) => {
  postsStore.fetchPosts({ q: query, status: 'removed_by_mod', page: 1 })
}

const handlePageChange = (page) => {
  postsStore.fetchPosts({ status: 'removed_by_mod', page })
}

onMounted(() => {
  postsStore.fetchPosts({ status: 'removed_by_mod' })
})
</script>

