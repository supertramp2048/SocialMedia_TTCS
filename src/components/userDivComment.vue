<template>
  <div class="flex items-start gap-3">
    <!-- Avatar -->
    <img
      :src="props.user?.avatar"
      alt="avatar"
      class="w-12 h-12 rounded-full border border-border-light flex-shrink-0 cursor-pointer"
      @click="goProfilePage"
      loading="lazy"
    />
    
    <!-- Thông tin user và nội dung -->
    <div class="flex-1 min-w-0">
      <!-- Header: Tên + Ngày -->
      <div class="flex items-center gap-2 mb-1">
        <button
          @click="goProfilePage"
          class="font-bold text-sm text-text-primary hover:underline"
        >
          {{ props.user?.name }}
        </button>
        <span class="text-[13px] text-text-secondary text-opacity-75">
          {{ formattedDate }}
        </span>
        <span v-if="props.user.id == props.authorId " class="text-sky-400 font-stretch-50% font-bold text-sm"> .Tác giả</span>
      </div>
      
      <!-- Nội dung comment -->
      <p class="text-sm text-text-primary leading-relaxed">
        {{ props.content }}
      </p>
    </div>
  </div>
</template>

<script setup lang="js">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  user: { type: Object, required: true },
  date: { type: [Date, String], required: true },
  content: { type: String, required: true },
  authorId: { type: String, required: true }
})

const router = useRouter()

const formattedDate = computed(() => {
  const dateObj = props.date instanceof Date ? props.date : new Date(props.date)
  return dateObj.toLocaleDateString('vi-VN')
})

function goProfilePage() {
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