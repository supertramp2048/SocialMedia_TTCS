<template>
    <Layout>
       <p>Ket qua tim kiem cho {{search_content}} </p>
    </Layout>
</template>
<script setup lang="js">
    import Layout from '../layout/layout.vue'
    import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import api from "../../../../API/axios"
    import { globalLoading } from '../../../../API/axios'
    import loader from '../../../components/loader.vue'
    const route = useRoute()
    const apiUrl = import.meta.env.VITE_API_BASE
    const loading = ref(false)
    const searchResult = ref([])
    const search_content = ref(route.query.q)
    watch(() => route.query.q, 
    async (newQuery) => {
        if(!newQuery) return
        search_content.value = newQuery
        const res = await api.get(`${apiUrl}/api/posts?q=${newQuery}`)
        searchResult.value = res.data
        console.log(searchResult.value.data);
        
    },
    {immediate: true}
    )

</script>