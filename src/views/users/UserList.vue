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
      <template #cell-actions="{ row }">
        <router-link
          :to="`/admin/users/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          Chi tiết 
        </router-link>
        <button
          v-if="row.role !== 'superadmin'"
          @click="handleBan(row)"
          class="ml-2 text-red-600 hover:text-red-800"
        >
          Khóa tài khoản
        </button>
        <button
          v-if="row.role !== 'superadmin'"
          @click="handleGivePermit(row)"
          class="ml-2 text-green-600 hover:text-green-800"
        >
          Cấp quyền quản lý
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
        <p>Bạn muốn khóa tài khoản này có tên <strong>{{ selectedUser?.name }}</strong>?</p>
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

        <Modal
      :is-open="givePermissionOpen"
      title="Cấp quyền quản lý"
      @close="givePermissionOpen = false"
      @confirm="confirmGivePermission"
    >
      <div class="space-y-4">
        <p>
          Bạn muốn trao quyền quản trị cho tài khoản
          <strong>{{ selectedUser?.name }}</strong>?
        </p>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Chọn vai trò muốn cấp
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
  {key: 'actions', label: 'Actions'}
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
  searchQuery.value = query
  isSearch.value = true
  usersStore.fetchUsers({ q: query, page: 1 })
}

const handlePageChange = (page) => {
  if(searchQuery.value){
    usersStore.fetchUsers({page: page, q: searchQuery.value })
  }
  else{
    usersStore.fetchUsers({page})
  }
}

const handleBan = (user) => {
  selectedUser.value = user
  banModalOpen.value = true
}

const confirmBan = async () => {
  if (!selectedUser.value) return

  try {
    await usersStore.banUser(selectedUser.value.id, banDuration.value)
    toast.success('Khóa tài khoản thành công')
    banModalOpen.value = false
    selectedUser.value = null
    banDuration.value = null
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Failed to ban user')
  }
}

const givePermissionOpen = ref(false)
const selectedRole = ref('moderator')  // giá trị mặc định

const handleGivePermit = (user) => {
  selectedUser.value = user
  // nếu muốn, set sẵn role hiện tại của user
  selectedRole.value = user.role === 'admin' || user.role === 'moderator'
    ? user.role
    : 'moderator'
  givePermissionOpen.value = true
}

const confirmGivePermission = async () => {
  if(!confirm('Bạn muốn cấp quyền quản lý cho tài khoản này ?')) return
  if (!selectedUser.value) return
  try {
    // Giả sử anh sẽ có hàm này trong usersStore
    await usersStore.givePermission(selectedUser.value.id,  selectedRole.value)

    // Tạm thời demo: gọi API giả hoặc chỉ toast
    console.log('Give permission', selectedUser.value.id, selectedRole.value)

    toast.success('Cấp quyền quản lý thành công')
    givePermissionOpen.value = false
    selectedUser.value = null
    selectedRole.value = 'moderator'
    // Reload lại list nếu cần
    // await usersStore.fetchUsers({ q: searchQuery.value, page: 1 })
  } catch (error) {
    console.error(error)
    toast.error(error?.response?.data?.message || 'Failed to give permission')
  }
}

function deleteSearch() {
  search.value = ''
  usersStore.fetchUsers()
  isSearch.value=false
}
onMounted(() => {
  usersStore.fetchUsers()
})
</script>
