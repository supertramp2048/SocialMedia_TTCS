<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Users</h1>
      <router-link
        to="/admin/users/locked"
        class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
      >
        View Locked Users
      </router-link>
    </div>

    <DataTable
      :columns="columns"
      :data="usersStore.users"
      :searchable="true"
      search-placeholder="Search users..."
      @search="handleSearch"
    >
      <template #cell-avatar="{ row }">
        <img
          v-if="row.avatar"
          :src="row.avatar"
          :alt="row.name"
          class="h-10 w-10 rounded-full"
        />
        <div v-else class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
          <UserIcon class="h-6 w-6 text-gray-600" />
        </div>
      </template>
      <template #cell-role="{ row }">
        <Badge :label="row.role" :variant="getRoleVariant(row.role)" />
      </template>
      <template #actions="{ row }">
        <router-link
          :to="`/admin/users/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          View
        </router-link>
        <button
          v-if="row.role !== 'superadmin'"
          @click="handleBan(row)"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          Ban
        </button>
      </template>
    </DataTable>

    <Pagination
      v-if="usersStore.pagination.total > 0"
      :current-page="usersStore.pagination.current_page"
      :last-page="usersStore.pagination.last_page"
      :total="usersStore.pagination.total"
      :from="(usersStore.pagination.current_page - 1) * usersStore.pagination.per_page + 1"
      :to="Math.min(usersStore.pagination.current_page * usersStore.pagination.per_page, usersStore.pagination.total)"
      @page-change="handlePageChange"
    />

    <Modal
      :is-open="banModalOpen"
      title="Ban User"
      @close="banModalOpen = false"
      @confirm="confirmBan"
    >
      <div class="space-y-4">
        <p>Are you sure you want to ban <strong>{{ selectedUser?.name }}</strong>?</p>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Duration (days) - Leave empty for permanent ban
          </label>
          <input
            v-model.number="banDuration"
            type="number"
            min="1"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Permanent ban"
          />
        </div>
      </div>
    </Modal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import Modal from '@/components/common/Modal.vue'
import Badge from '@/components/common/Badge.vue'
import { UserIcon } from '@heroicons/vue/24/outline'

const usersStore = useUsersStore()
const toast = useToast()

const columns = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'role', label: 'Role' },
  { key: 'created_at', label: 'Joined' },
]

const banModalOpen = ref(false)
const selectedUser = ref(null)
// dùng null/undefined đều được, nhưng không dùng kiểu <number | undefined>
const banDuration = ref(null)

const getRoleVariant = (role) => {
  if (role === 'superadmin' || role === 'admin') return 'info'
  if (role === 'moderator') return 'warning'
  return 'default'
}

const handleSearch = (query) => {
  usersStore.fetchUsers({ search: query, page: 1 })
}

const handlePageChange = (page) => {
  usersStore.fetchUsers({ page })
}

const handleBan = (user) => {
  selectedUser.value = user
  banModalOpen.value = true
}

const confirmBan = async () => {
  if (!selectedUser.value) return

  try {
    await usersStore.banUser(selectedUser.value.id, banDuration.value)
    toast.success('User banned successfully')
    banModalOpen.value = false
    selectedUser.value = null
    banDuration.value = null
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to ban user')
  }
}

onMounted(() => {
  usersStore.fetchUsers()
})
</script>
