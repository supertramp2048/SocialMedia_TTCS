<template>
    <Layout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <div class="max-w-7xl flex mx-auto px-1 sm:px-2 lg:px-3 py-3 md:py-3 justify-center">
            <h1 class="text-3xl font-bold">
            Kết quả tìm kiếm cho: <span class="font-bold italic" > "{{search_content}}"</span> 
            </h1>
          </div>
          <GridPost :posts="searchResult" :pageLimit="page_limit"></GridPost>
        </div>
    </Layout>
</template>
<script setup lang="js">
    import Layout from '../layout/layout.vue'
    import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import api from "../../../../API/axios"
    import { globalLoading } from '../../../../API/axios'
    import loader from '../../../components/loader.vue'
    import GridPost from '../../../components/gridPost.vue'
    const route = useRoute()
    const apiUrl = import.meta.env.VITE_API_BASE
    const loading = ref(false)
    const searchResult = ref([])
    const search_content = ref(route.query.q)
    const page_limit = ref()
    watch(
  () => route.query,               // theo dõi toàn bộ query object
  async (newQuery) => {
    if (!newQuery || !newQuery.q) return // nếu không có ?q= thì bỏ qua

    search_content.value = newQuery.q.trim()

    try {
      const res = await api.get(`${apiUrl}/api/posts`, {
        params: newQuery           // truyền toàn bộ query params lên server
      })
      searchResult.value = res.data
      page_limit.value = Math.ceil(res.data.meta?.total / route.query.limit)
      console.log('Kết quả:', searchResult.value)
      console.log('limit page ', page_limit.value);
      
    } catch (error) {
      console.error('Lỗi khi tìm kiếm:', error)
    }
  },
  { immediate: true, deep: true }  // deep để bắt thay đổi trong object route.query
)



</script>