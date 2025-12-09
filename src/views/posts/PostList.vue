<template>
  <div>
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Posts</h1>
    <button 
    v-if="isSearch"
    class="bg-red-300 px-1 py-2 rounded-2xl m-1"
    @click="deleteSearch"
    >Xóa kết quả tìm kiếm</button>
    <div class="mb-4 flex space-x-4">
      <button
        @click="activeTab = 'notRemovedPost'"
        :class="activeTab === 'notRemovedPost' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg"
      >
        Bài viết trên trang người dùng
      </button>
      <button
        @click="activeTab = 'removedPost'"
        :class="activeTab === 'removedPost' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'"
        class="px-4 py-2 rounded-lg"
      >
        Bài viết đã gỡ
      </button>
    </div>
    <DataTable
      v-model="search" 
      :columns="columns"
      :data="displayedPosts"
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
      <template #cell-actions="{ row }">
        <router-link
          :to="`/admin/posts/${row.id}`"
          class="text-blue-600 hover:text-blue-800 rounded-2xl py-1 px-2 hover:bg-gray-400"
        >
          Chi tiết
        </router-link>
        <button
          v-if="activeTab == 'notRemovedPost'"
          @click="handleDelete(row)"
          class="ml-2 py-1 px-2 rounded-2xl text-red-600 hover:text-red-800 hover:bg-gray-400"
        >
          Gỡ bỏ
        </button>
        <button
          v-else
          @click="handleRestore(row)"
          class="ml-2 text-green-600 hover:text-green-800 rounded-2xl py-1 px-2 hover:bg-gray-400"
        >
          Khôi phục
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
      <p>Bạn muốn gỡ bỏ bài đăng này ?</p>
    </Modal>
  </div>
  <FullScreenLoading :show="postsStore.loading" message="Đang tải dữ liệu..." />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useToast } from 'vue-toastification'
import DataTable from '@/components/common/DataTable.vue'
import Pagination from '@/components/common/Pagination.vue'
import Modal from '@/components/common/Modal.vue'
import Badge from '@/components/common/Badge.vue'
import FullScreenLoading from '../../components/common/fullScreenLoading.vue'
import Loading from 'vue-loading-overlay'
const isSearch = ref(false)
const displayedPosts = ref([])
const postsStore = usePostsStore()
const toast = useToast()
const activeTab = ref('notRemovedPost')
const columns = [
  { key: 'title', label: 'Tiêu đề bài viết' },
  { key: 'author.name', label: 'Tác giả' },
  { key: 'created_at', label: 'Ngày tạo' },
  {key: 'actions', label: 'Xử lý'}
]

const deleteModalOpen = ref(false)
const selectedPost = ref({})

const getStatusVariant = (status) => {
  if (status === 'published') return 'success'
  if (status === 'removed_by_mod') return 'danger'
  return 'warning'
}

const handleSearch = async (query) => {  
  const res = await postsStore.fetchAllPosts({page: 1, q: query })
  isSearch.value = true
  displayedPosts.value = res.data
}
const search = ref('')
const deleteSearch = async() => {
  search.value = ''
  const res = await postsStore.fetchAllPosts()
  displayedPosts.value = res.data
  isSearch.value = false
}
const handlePageChange = async (page) => {
  await postsStore.fetchAllPosts({ page })
  displayedPosts.value = postsStore.allPosts
}

const handleDelete = (post) => {
  selectedPost.value = post
  deleteModalOpen.value = true
}
const handleRestore = async (post) => {
  if(!confirm('Bạn muốn khôi phục lại bài viết đã gỡ bỏ này ?')) return
  try {
    await postsStore.restorePost(post.id)
    toast.success('thanh cong')
  } catch (error) {
    console.log(error);
    
    toast.error('Co loi xay ra')
  }
}
const confirmDelete = async () => {
  if (!selectedPost.value) return

  try {
    console.log("selected pót ",selectedPost.value.id );
    
    await postsStore.deletePost(selectedPost.value.id)
    toast.success('Post removed successfully')
    deleteModalOpen.value = false
    selectedPost.value = null
  } catch (error) {
    toast.error(error.response?.data?.message || 'Failed to remove post')
  }
}

watch(activeTab, async (newVal) =>{
  if(newVal == 'notRemovedPost'){
    await postsStore.fetchAllPosts()
    displayedPosts.value = postsStore.allPosts
  }
  else if(newVal == 'removedPost'){
    await postsStore.fetchRemovedPost()
    displayedPosts.value = postsStore.allRemovedPosts
  }
  console.log("change displayedPosts ",displayedPosts.value);
  
})

onMounted( async () => {
  await postsStore.fetchAllPosts()
  if(activeTab.value == 'notRemovedPost'){
    displayedPosts.value = postsStore.allPosts
  }
  else if(activeTab.value == 'removedPost'){
    await postsStore.fetchRemovedPost()
    displayedPosts.value = postsStore.removedPost
  }
})
</script>

