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
            v-if="props.pageLimit != null"
            type="button"
            class="px-3 py-2 text-sm text-gray-700 hover:text-sky-700 hover:bg-sky-50 rounded-md transition-colors"
            @click="updatePagination('newest')"
            :class="{ 'bg-sky-300': sortSetting === 'newest' }"
          >
            Mới nhất
          </button>

          <button
            v-if="props.pageLimit != null"
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
            <span class="text-[15px]">{{ article.comments_count }} Bình luận</span>
            <span class="flex items-center gap-1 text-[15px]">
              {{ article?.vote_score > 0 ? article?.vote_score : 0 }}
              <i 
              class="fa-regular fa-circle-up text-xl"
              :class=" article.user_vote == 1 ? 'text-blue-500' : 'text-gray-500' "
              ></i>
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
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Pagination from '../components/pagination.vue'

const route = useRoute()
const router = useRouter()

const props = defineProps({
  posts: { type: Object, required: true },
  pageLimit: { type: Number, required: true }
})

// ✅ FIXED: Dùng computed với getter/setter để sync trực tiếp với route.query.sort
const sortSetting = computed({
  get() {
    // Mặc định là 'hot' nếu không có sort param
    return route.query.sort === 'newest' ? 'newest' : 'hot'
  },
  set(val) {
    const q = { ...route.query }
    // Tuỳ chọn: xóa param 'sort' khi set về 'hot' để URL sạch hơn
    if (val === 'hot') {
      delete q.sort
    } else {
      q.sort = val
    }
    router.replace({ query: q })
  }
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

function updatePagination(sort) {
  sortSetting.value = sort
}
</script>