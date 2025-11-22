<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Locked Users</h1>
      <router-link
        to="/admin/users"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        View All Users
      </router-link>
    </div>

    <DataTable
      :columns="columns"
      :data="usersStore.users"
      :searchable="true"
      search-placeholder="Search locked users..."
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
      <template #cell-banned_until="{ row }">
        <span class="text-red-600 font-medium">
          {{ formatDate(row.banned_until) }}
        </span>
      </template>
      <template #actions="{ row }">
        <router-link
          :to="`/admin/users/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          View
        </router-link>
        <button
          @click="handleUnban(row)"
          class="ml-2 text-green-600 hover:text-green-800"
        >
          Unban
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
      :is-open="unbanModalOpen"
      title="Unban User"
      @close="unbanModalOpen = false"
      @confirm="confirmUnban"
    >
      <p>Are you sure you want to unban <strong>{{ selectedUser?.name }}</strong>?</p>
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
import { UserIcon } from '@heroicons/vue/24/outline'

const usersStore = useUsersStore()
const toast = useToast()

const columns = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'banned_until', label: 'Banned Until' },
  { key: 'created_at', label: 'Joined' },
  // Nếu DataTable của anh cần cột actions mới hiện slot #actions thì thêm:
  // { key: 'actions', label: 'Actions' },
]

const unbanModalOpen = ref(false)
const selectedUser = ref(null)

const formatDate = (date) => {
  if (!date) return 'Permanent'
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const handleSearch = (query) => {
  usersStore.fetchBannedUsers({ search: query, page: 1 })
}

const handlePageChange = (page) => {
  usersStore.fetchBannedUsers({ page })
}

const handleUnban = (user) => {
  selectedUser.value = user
  unbanModalOpen.value = true
}

const confirmUnban = async () => {
  if (!selectedUser.value) return

  try {
    await usersStore.unbanUser(selectedUser.value.id)
    toast.success('User unbanned successfully')
    unbanModalOpen.value = false
    selectedUser.value = null
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to unban user')
  }
}

onMounted(() => {
  usersStore.fetchBannedUsers()
})
</script>
