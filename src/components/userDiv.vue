<template>
    <button
    @click="goProfilePage(props.user.id)"
    class="flex items-center gap-3 text-sm text-gray-700"
    >
        <img
                :src="props.user?.avatar "
                alt="avatar"
                class="w-14 h-14 rounded-full"
                loading="lazy"
            />
        <div class="flex justify-center items-center">
            <span class="font-bold text-sm text-text-primary block mr-2">{{ props.user?.name }}</span>
            <span v-if="props.date != null" class="text-[13px] text-text-muted"> {{ new Date(props.date).toLocaleDateString('vi-VN') }} </span>
        </div>
    </button>
</template>
<script setup lang='js'>
    import {useRoute, useRouter} from 'vue-router'
    const props = defineProps({
        user: {type: Object, require: true},
        date: {type: Date, require: true}
    })
    const route = useRoute()
    const router = useRouter()
    function goProfilePage(id){
        router.push({
            path: `/nguoi-dung/${props.user.name}`,
            query: {
                user_id: props.user.id,
                page: 1,
                limit: 10,
                sort: 'hot'
            }
        })
    }   
</script>