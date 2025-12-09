<template>
  <div>
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Tài khoản đã khóa</h1>

      <button
        v-if="isSearch"
        @click="deleteSearch"
        class="py-1 px-2 bg-red-300 rounded-2xl"
      >
        Xóa kết quả tìm kiếm
      </button>

      <router-link
        to="/admin/users"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Xem tất cả tài khoản chưa khóa
      </router-link>
    </div>

    <DataTable
      v-model="search"
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
      <template #cell-actions="{ row }">
        <router-link
          :to="`/admin/users/${row.id}`"
          class="text-blue-600 hover:text-blue-800"
        >
          Chi tiết
        </router-link>
        <button
          @click="handleUnban(row)"
          class="ml-2 text-green-600 hover:text-green-800"
        >
          Bỏ khóa
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
      <p>Bạn muốn gỡ bỏ lệnh khóa tài khoản này <strong>{{ selectedUser?.name }}</strong>?</p>
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
  { key: 'name', label: 'Tên' },
  { key: 'banned_until', label: 'Bị khóa đến ngày' },
  { key: 'created_at', label: 'Ngày tạo tài khoản' },
  // Nếu DataTable của anh cần cột actions mới hiện slot #actions thì thêm:
  { key: 'actions', label: 'Xử lý' },
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
const isSearch = ref(false)
const search = ref('')
function deleteSearch() {
  search.value = ''
  usersStore.fetchBannedUsers()
  isSearch.value=false
}
const handleSearch = (query) => {
  //console.log("query", query);
  isSearch.value= true
  search.value = query
  usersStore.fetchBannedUsers({ user: query, page: 1 })
}

const handlePageChange = (page) => {
  const objQuery = {
    page: page
  }
  if(search.value != null){
    objQuery.user = search.value
  }
  usersStore.fetchBannedUsers(objQuery)
}

const handleUnban = (user) => {
  selectedUser.value = user
  unbanModalOpen.value = true
}

const confirmUnban = async () => {
  if (!selectedUser.value) return

  try {
    await usersStore.unbanUser(selectedUser.value.id)
    toast.success('Khóa user thành công')
    unbanModalOpen.value = false
    selectedUser.value = null
  } catch (error) {
    toast.error(error?.response?.data?.message || 'Khóa user thất bại')
  }
}

onMounted(() => {
  usersStore.fetchBannedUsers()
})
</script>
