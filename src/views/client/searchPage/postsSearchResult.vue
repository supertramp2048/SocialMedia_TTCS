<template>
    <GridPost :posts="searchResult" :pageLimit="page_limit"></GridPost>
</template>
<script setup lang='js'>
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