<template>
    <Layout>
        <div class="min-h-screen bg-white">
                <!-- Khung chính -->
                <div class="max-w-[1280px]  mx-auto px-4 sm:px-6 lg:px-8">
                <div class="bg-[url('')] bg-cover bg-center bg-no-repeat h-[100px] "
                    :style="{ backgroundImage: `url(${AuthUser?.data?.avatar})` }"
                    > 
                </div>
                <div class="relative lg:grid lg:grid-cols-[364px_minmax(0,1fr)] lg:gap-8">
                    <!-- Sidebar hồ sơ -->
                    <aside class="mb-8 lg:mb-0">
                    <div class="lg:sticky lg:top-24">
                        <div class="bg-gray-50 rounded-2xl shadow-sm">
                        <UserProfile :user="AuthUser?.data" />
                        </div>
                    </div>
                    </aside>

                    <!-- Nội dung chính -->
                    <main class="min-w-0">
                    <!-- Tabs -->
                    <div class="border-b border-gray-200">
                        <nav class="flex items-center gap-2">
                        <button
                            class="flex items-center gap-2 px-4 py-3 border-b-2 border-primary font-semibold text-gray-900"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M2 2h12v2H2V2Zm0 5h12v2H2V7Zm0 5h12v2H2v-2Z" fill="#969696"/>
                            </svg>
                            <span>Bài viết ({{ AuthUser?.data?.posts_count }})</span>
                        </button>

                        <button class="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M2 2h12v4H2V2Zm0 6h12v6H2V8Z" fill="#909399"/>
                            </svg>
                            <span>Series</span>
                        </button>

                        <button class="flex items-center gap-2 px-4 py-3 text-gray-600 hover:text-gray-900">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path d="M2 3h12v2H2V3Zm0 4h12v2H2V7Zm0 4h12v2H2v-2Z" fill="#909399"/>
                            </svg>
                            <span>Bình luận</span>
                        </button>
                        </nav>
                    </div>

                    <!-- Filter + chế độ xem -->
                    <div class="py-4 lg:py-6 flex items-center justify-between">
                        <div class="inline-flex items-center bg-gray-100 px-4 py-1.5 rounded">
                        <span class="text-gray-800">Theo thời gian</span>
                        <svg class="ml-2" width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                            <path d="M3 5l4 4 4-4" stroke="#666" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        </div>

                        <div class="hidden lg:block">
                        <button
                            class="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded bg-white text-sm text-gray-700 hover:bg-gray-50"
                        >
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M2 2h5v5H2V2Zm7 0h5v5H9V2Zm0 7h5v5H9V9ZM2 9h5v5H2V9Z" fill="#909399"/>
                            </svg>
                            <span>Chế độ xem lưới</span>
                        </button>
                        </div>
                    </div>

                    <!-- Lưới bài viết -->
                    <section class="pb-10">
                        <div class=" gap-6 lg:gap-8">
                        <GridPost
                            :posts="posts"
                            :pageLimit="limitPage"
                        />
                        </div>
                    </section>
                    </main>
                </div>
                </div>
            </div>
    </Layout>
</template>
<script setup lang="js">
    import Layout from '../layout/layout.vue'
    import UserProfile from '../../../components/userProfile.vue'
    import GridPost from '../../../components/gridPost.vue'
    import {ref, onMounted, watch} from 'vue'
    import api from "../../../../API/axios"
    import { useAuthStore } from '../../../stores/auth'
    import { useRoute} from 'vue-router'
    // Demo data — thay bằng API thật của bạn
const posts = ref([])
const auth = useAuthStore()
const AuthUser = ref()
const route = useRoute()
const limitPage = ref()
const objPagination = ref()
let UserId = null
watch(
  () => route.query,
  async (newQuery) => {
    objPagination.value = newQuery
    const res2 = await api.get(`/api/posts`, {
    params: objPagination.value
  })
  posts.value = res2.data
  },
  { immediate: true } // gọi 1 lần khi load trang
)

onMounted(async () => {
  UserId = route.query.id
  const res = await api.get(`/api/profiles/${UserId}`)
  AuthUser.value = res?.data
  console.log("auth", AuthUser.value);
  objPagination.value = route.query
  console.log("objPagination ",objPagination.value);
  
  const res2 = await api.get(`/api/posts`, {
    params: objPagination.value
  })
  posts.value = res2.data
  
  limitPage.value = Math.ceil(res2.data.meta?.total / 5)
  console.log("postt",posts.value);
  
  
})
</script>