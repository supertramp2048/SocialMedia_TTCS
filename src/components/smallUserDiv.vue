<template>
    <button
    @click.stop.prevent ="goProfilePage(props.user.id)"
    class="flex items-center gap-3 text-sm text-gray-700"
    >
        <img
                :src="props.user?.avatar "
                alt="avatar"
                class="w-[40px] h-[40px] rounded-full"
                loading="lazy"
            />
        <div>
            <span class="hover:underline text-lg font-medium text-text-primary block">{{ props.user?.name }}</span>
            <span v-if="data != null" class="text-lg text-text-muted"> {{ new Date(props.date).toLocaleDateString('vi-VN') }} </span>
        </div>
    </button>
</template>
<script setup lang='js'>
    import {useRoute, useRouter} from 'vue-router'
    const props = defineProps({
        user: {type: Object, require: true},
        objPagination: {type: Object, require: true},
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
        console.log("id nguoi dung ", id);
        
    }   
</script>