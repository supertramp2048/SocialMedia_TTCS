<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Staff Management</h1>
      <router-link
        to="/admin/staff/create"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Create Staff
      </router-link>
    </div>

    <button
      v-if="isSearch"
      @click="deleteSearch"
      class="py-1 px-2 bg-red-300 rounded-2xl"
    >
      Xóa kết quả tìm kiếm
    </button>

    <DataTable
      v-model="search" 
      :columns="columns"
      :data="usersStore.adminAccounts"
      :searchable="true"
      search-placeholder="Search staff..."
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
      <template #cell-actions="{ row }">
        <router-link
          :to="`/admin/staff/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          Chi tiết 
        </router-link>
        <button
          v-if="row.role !== 'superadmin'"
          @click="handleChangeRole(row)"
          class="ml-2 text-yellow-600 hover:text-yellow-800"
        >
          Thay đổi vai trò
        </button>
        <button
          v-if="row.role !== 'superadmin'"
          @click="handleRevoke(row)"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          Thu hồi quyền
        </button>
      </template>
    </DataTable>

    <Pagination
      v-if="usersStore.pagination?.total > 0"
      :current-page="usersStore.pagination.current_page"
      :last-page="usersStore.pagination.last_page"
      :total="usersStore.pagination.total"
      :from="(usersStore.pagination.current_page - 1) * usersStore.pagination.per_page + 1"
      :to="Math.min(usersStore.pagination.current_page * usersStore.pagination.per_page, usersStore.pagination.total)"
      @page-change="handlePageChange"
    />

    <Modal
      :is-open="changeRoleModalOpen"
      title="Thay đổi vai trò"
      @close="changeRoleModalOpen = false"
      @confirm="confirmChangeRole"
    >
      <div class="space-y-4">
        <p>
          Bạn muốn thay đổi vai trò của tài khoản
          <strong>{{ selectedUser?.name }}</strong>?
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Chọn vai trò mới
          </label>
          <select
            v-model="selectedRole"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg"
          >
            <option value="moderator">Moderator</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
    </Modal>

    <Modal
      :is-open="revokeModalOpen"
      title="Thu hồi quyền quản lý"
      @close="revokeModalOpen = false"
      @confirm="confirmRevoke"
    >
      <div class="space-y-4">
        <p>
          Bạn muốn thu hồi quyền quản lý của tài khoản
          <strong>{{ selectedUser?.name }}</strong>?
        </p>
        <p class="text-sm text-gray-600">
          Tài khoản này sẽ trở về vai trò người dùng thông thường.
        </p>
      </div>
    </Modal>
  </div>
  <FullLoading :show="usersStore.loading"></FullLoading>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUsersStore } from '@/stores/users'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import FullLoading from '../../components/common/fullScreenLoading.vue'
import Modal from '@/components/common/Modal.vue'
import Badge from '@/components/common/Badge.vue'
import { UserIcon } from '@heroicons/vue/24/outline'

const search = ref('')
const searchQuery = ref()
const usersStore = useUsersStore()
const toast = useToast()
const isSearch = ref(false)

const columns = [
  { key: 'avatar', label: 'Avatar' },
  { key: 'name', label: 'Name' },
  { key: 'role', label: 'Role' },
  { key: 'actions', label: 'Actions' }
]

const changeRoleModalOpen = ref(false)
const revokeModalOpen = ref(false)
const selectedUser = ref(null)
const selectedRole = ref('moderator')

const getRoleVariant = (role) => {
  if (role === 'superadmin' || role === 'admin') return 'info'
  if (role === 'moderator') return 'warning'
  return 'default'
}

const handleSearch = (query) => {
  searchQuery.value = query
  isSearch.value = true
  usersStore.getAllAmdinAccounts({ q: query, page: 1 })
}

const handlePageChange = (page) => {
  if (searchQuery.value) {
    usersStore.getAllAmdinAccounts({ page: page, q: searchQuery.value })
  } else {
    usersStore.getAllAmdinAccounts({ page })
  }
}

const handleChangeRole = (user) => {
  selectedUser.value = user
  selectedRole.value = user.role === 'admin' || user.role === 'moderator'
    ? user.role
    : 'moderator'
  changeRoleModalOpen.value = true
}

const confirmChangeRole = async () => {
  if (!selectedUser.value) return

  try {
    await usersStore.givePermission(selectedUser.value.id, selectedRole.value)
    toast.success('Thay đổi vai trò thành công')
    changeRoleModalOpen.value = false
    selectedUser.value = null
    selectedRole.value = 'moderator'
    // Reload lại danh sách
    if (searchQuery.value) {
      await usersStore.getAllAmdinAccounts({ q: searchQuery.value, page: usersStore.pagination.current_page })
    } else {
      await usersStore.getAllAmdinAccounts({ page: usersStore.pagination.current_page })
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to change role')
  }
}

const handleRevoke = (user) => {
  selectedUser.value = user
  revokeModalOpen.value = true
}

const confirmRevoke = async () => {
  if (!selectedUser.value) return

  try {
    // Giả sử có hàm revokePermission trong usersStore
    await usersStore.revokePermission(selectedUser.value.id)
    toast.success('Thu hồi quyền thành công')
    revokeModalOpen.value = false
    selectedUser.value = null
    // Reload lại danh sách
    if (searchQuery.value) {
      await usersStore.getAllAmdinAccounts({ q: searchQuery.value, page: usersStore.pagination.current_page })
    } else {
      await usersStore.getAllAmdinAccounts({ page: usersStore.pagination.current_page })
    }
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to revoke permission')
  }
}

function deleteSearch() {
  search.value = ''
  usersStore.getAllAmdinAccounts({ page: 1 })
  isSearch.value = false
}

onMounted(async () => {
  await usersStore.getAllAmdinAccounts({ page: 1, role:'moderator' })
})
</script>