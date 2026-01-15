<template>
  <div class="mt-2 mb-2">
    <!-- lua chon sap xep post -->
    <div class="mb-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-row-reverse justify-between h-12">
        <nav class="flex gap-3">
          <!-- che do xem -->
          <button
            v-if="props.posts?.data?.length > 1"
            type="button"
            class="px-3 py-2 text-lg text-gray-700 rounded-md transition-colors hidden sm:block"
          >
            Chế độ xem
          </button>

          <select
            v-if="props.posts?.data?.length > 1"
            v-model="displayMode"
            class="border rounded p-2 hidden sm:block"
          >
            <option value="grid">Lưới</option>
            <option value="col">Cột</option>
          </select>

          <!-- 2 mục Sap xep -->
          <button
            v-if="props.posts?.data?.length > 4"
            type="button"
            class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
            @click="updatePagination('newest')"
            :class="{ 'bg-sky-300': sortSetting === 'newest' }"
          >
            Mới nhất
          </button>

          <button
            v-if="props.posts?.data?.length > 4"
            type="button"
            class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
            @click="updatePagination('hot')"
            :class="{ 'bg-sky-300': sortSetting === 'hot' }"
          >
            Thịnh hành
          </button>
        </nav>
      </div>
    </div>

    <!-- // tất cả post có phân trang -->
    <div
      class="gap-6"
      :class="displayMode === 'grid' ? ['sm:grid','sm:grid-cols-2'] : ''"
    >
      <router-link
        v-for="article in (props.posts?.data || [])"
        :key="article.id"
        :to="{ path: '/bai-dang/', query: { id: article.id } }"
        class="group cursor-pointer"
        :class="displayMode === 'col' ? ['flex','flex-col','sm:flex-row'] : ''"
      >
        <div>
          <button
          @click.prevent.stop="goToFixArticalPage(article.id)"
           class="border btnEffect border-transparent text-sky-500 bg-gray-200 rounded-xl px-2 py-1 m-1">Sửa</button>
          <button 
          @click.prevent.stop="deleteArtical(article.id)"
          class="border btnEffect border-transparent text-red-500 bg-gray-200 rounded-xl px-2 py-1 m-1">Xóa</button>
        </div>
        <div class="mb-3 mr-3 rounded-lg overflow-hidden">
          <img
            :src="article.thumbnail_url"
            :alt="article.title"
            class="h-48 object-cover group-hover:scale-105 transition-transform duration-300"
            :class="displayMode == 'grid' ? 'w-full' : 'w-[300px]'"
          />
        </div>

        <div class="pb-2 flex-1 sm:pb-0">
          <h3 class="font-semibold text-2xl text-gray-900 group-hover:text-sky-600 line-clamp-2 mb-2">
            {{ article.title }}
          </h3>

          <!-- user div va so like + so comment -->
          <div class="flex items-center gap-3 text-sm text-gray-500">
            <!-- chặn click lan lên router-link -->
            <SmallUserDiv
              @click.stop.prevent
              :user="article?.author"
              :date="null"
            />
            <span>{{ article.comments_count }} Bình luận</span>
            <span class="flex items-center gap-1">
              <svg
                v-if="article?.user_vote == 1"
                class="w-4 h-4"
                :class="{ 'text-red-500': article.user_vote == 1 }"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clip-rule="evenodd"
                />
              </svg>
              {{ article?.vote_score > 0 ? article?.vote_score : 0 }}
            </span>
          </div>
        </div>
      </router-link>
    </div>

    <Pagination v-if="props.pageLimit != null" :page_limit="props.pageLimit" />
  </div>
</template>

<script setup lang="js">
import SmallUserDiv from '../components/smallUserDiv.vue'
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '../components/pagination.vue'
import api from '../../API/axios.js'
const emit = defineEmits(['update-posts'])
const sortSetting = ref('hot')
const route = useRoute()
const router = useRouter()
const props = defineProps({
  posts: { type: Object, required: true },
  pageLimit: { type: Number, required: true }
})


const displayMode = ref('col')
const userChanged = ref(false)

watch(displayMode, () => { userChanged.value = true })

watch(
  () => props.posts?.data?.length,
  (len) => {
    if (userChanged.value) return
    displayMode.value = (len > 1) ? 'grid' : 'col'
  },
  { immediate: true }
)
// di den trang chi dinh
function updatePagination(sort) {
  sortSetting.value = sort
  router.replace({
    query: {
      ...route.query,
      sort
    }
  })
}
// go to update artical page
function goToFixArticalPage(id){
    router.push({
        path:'/bai-dang/sua-bai',
        query:{postId: id}
    })
  }
  let statusDelete = ref('')
async function deleteArtical(id){
    let decision = confirm("Bạn có chắc muốn xóa bài viết này ?")
  if(decision == true){
    try {
      const res = await api.delete(`/api/posts/${id}`)
      statusDelete.value = res.status
      if(res.status == 204){
        alert("Xóa thành công")
      }
      const newPosts = props.posts.data.filter(p => p.id !== id)
      emit('update-posts', {
        data: newPosts,
        meta: {
          ...props.posts.meta,
          total: props.posts.meta.total - 1
        }
    })
    } catch (error) {
      if(statusDelete.value == 401){
         alert("Bạn chưa đăng nhập")
         return
      }
      else if(statusDelete.value == 403){
        alert("Token không phải của chủ sở hữu")
        return
      }
      else if(statusDelete.value == 404){
        alert("post id không tồn tại")
        return
      }
    }
  }
}

</script>
