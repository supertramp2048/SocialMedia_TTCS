<template>
    <Layout>
        <div class="min-h-screen bg-white">
                <!-- Khung chính -->
                <SkeletonLoader
                  v-if="isLoadingProfile"
                  variant="detail"
                  :minHeight="420"
                  class="w-full max-w-[1280px] mx-auto my-6 px-4 sm:px-6 lg:px-8"
                />
                <div v-else class="max-w-[1280px]  mx-auto px-4 sm:px-6 lg:px-8">
                <!-- ảnh bìa của user  -->
                <div class=" bg-cover bg-center bg-no-repeat w-full h-[200px] "
                    :style="{ backgroundImage: `url(${AuthUser?.data?.cover_photo_url})` }"
                    > 
                </div>
                <!-- end ------------>
                <div class="relative lg:grid lg:grid-cols-[364px_minmax(0,1fr)] lg:gap-8">
                    <!-- Sidebar hồ sơ -->
                    <aside class="mb-8 lg:mb-0">
                    <div class="lg:sticky lg:top-24">
                        <div class="bg-gray-50 rounded-2xl shadow-sm">
                        <UserProfile :user="AuthUser?.data" @ShowForm="handleShowForm" />
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
                    </div>

                    <!-- Lưới bài viết -->
                    <section class="pb-10">
                        <div v-if="!posts || !posts.data">
                          <SkeletonLoader variant="list" :rows="6" :avatar="true" class="mt-4" />
                        </div>
                        <div v-else-if="posts?.data?.length > 0" class=" gap-6 lg:gap-8">
                        <GridPost
                            :posts="posts"
                            :pageLimit="limitPage"
                            @update-posts="updatePosts"
                        />
                        </div>
                        <div v-else>
                            <p>Không có gì ở đây cả :'(( </p>
                        </div>
                    </section>
                    </main>
                </div>
                </div>
            </div>
    </Layout>
    <ReportModal
      v-model="showReportPostForm"
      :id="idReport"
      :type="typeOfReport"
    />
</template>
<script setup lang="js">
    import Layout from '../layout/layout.vue'
    import UserProfile from '../../../components/userProfile.vue'
    import GridPost from '../../../components/gridPostForProfilePage.vue'
    import {ref, onMounted, watch} from 'vue'
    import api from "../../../../API/axios"
    import ReportModal from '../../../components/reportForm.vue' 
    import { useAuthStore } from '../../../stores/auth'
    import { useRoute, useRouter} from 'vue-router'
    import SkeletonLoader from '../../../components/ui/SkeletonLoader.vue'
    // Demo data — thay bằng API thật của bạn
const showReportPostForm = ref(false)
const posts = ref([])
const auth = useAuthStore()
const AuthUser = ref()
const route = useRoute()
const router = useRouter()
const limitPage = ref()
const objPagination = ref(route.query)
const sort = ref('hot')
let UserId = null
const idReport = ref('')
const typeOfReport = ref('')
const isLoadingProfile = ref(true)
function handleShowForm(value){
    showReportPostForm.value = value
    idReport.value = route.query.user_id
    typeOfReport.value = 'users'
}
watch(
    () => sort.value,
    (newVal) => {
        router.replace({
            query: {
                ...route.query,
                sort: newVal
            }
        })
    }
)

watch(
  () => route.query.user_id,
  async (newQuery) => {
    UserId = route.query.user_id
    const res = await api.get(`/api/profiles/${UserId}`)
    AuthUser.value = res?.data
    isLoadingProfile.value = !Boolean(AuthUser.value?.data)
  },
  { immediate: true , deep: true} // gọi 1 lần khi load trang
)


watch(
  () => route.query,
  async (newQuery) => {
    objPagination.value = newQuery
    const res2 = await api.get(`/api/posts`, {
    params: objPagination.value
  })
  posts.value = res2.data
  },
  { immediate: true , deep: true} // gọi 1 lần khi load trang
)


onMounted(async () => {
  UserId = route.query.user_id
  const res = await api.get(`/api/profiles/${UserId}`)
  AuthUser.value = res?.data
  isLoadingProfile.value = !Boolean(AuthUser.value?.data)
  console.log("auth", AuthUser.value);
  objPagination.value = route.query
  console.log("objPagination ",objPagination.value);
  
  const res2 = await api.get(`/api/posts`, {
    params: objPagination.value
  })
  posts.value = res2.data
  
  limitPage.value = Math.ceil(res2.data.meta?.total / objPagination.value.limit)
  console.log("postt",posts.value);
  
  
})

function updatePosts(newVal){
    console.log('📦 Received from child:', newVal)
    posts.value = { ...newVal }
    limitPage.value = Math.ceil(newVal.meta.total / objPagination.value.limit)
}
</script>