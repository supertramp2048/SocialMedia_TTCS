<template>
    <!-- phan trang -->
    <form
        class="sticky bottom-0 z-30 bg-white border-t shadow-md 
            flex justify-center items-center gap-4 px-6 py-3
            max-w-2xl mx-auto rounded-t-lg"
        @submit.prevent="goPage"
    >
        <!-- Nút bên trái -->
        <button
        type="button"
        class="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700"
        :disabled="objPagination.page <= 1 || loading"
        @click="objPagination.page > 1 ? (objPagination.page--, goPage()): null"
        >
        Trước
        </button>

        <!-- Ô nhập ở giữa -->
        <label class="flex items-center gap-2 text-sm text-gray-700">
        Trang:
        <input
            type="number"
            v-model.number="objPagination.page"
            min="1"
            :max="props.page_limit"
            class="w-16 px-2 py-1 border rounded-md text-center"
        />
        / {{ props.page_limit }}
        </label>

        <!-- Nút bên phải -->
        <button
        type="button"
        class="px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md text-sm font-medium text-white disabled:opacity-60"
        :disabled="objPagination.page >= props.page_limit || loading"
        @click="objPagination.page < props.page_limit ? (objPagination.page++, goPage()) : null"
        >
        Tiếp
        </button>
    </form>
</template>
<script setup lang="js">
import { onMounted, watch, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  page_limit: { type: Number, required: true }
})

const objPagination = ref({})

watch(() => route.query, 
      (newQuery) => {
    objPagination.value = { ...newQuery }
    },
{immediate: true, deep: true}
)
// Hàm tiện ích: loại bỏ key null/undefined/"" để URL gọn
function cleanQuery(q) {
  const out = {}
  for (const k in q) {
    const v = q[k]
    if (v !== undefined && v !== null && `${v}`.trim() !== '') out[k] = v
  }
  return out
}
async function goPage() {
    if(objPagination.value.page < 1 || objPagination.value.page > props.page_limit) return
  const nextQuery = cleanQuery({
    ...route.query,           // giữ các query khác đang có
    ...objPagination.value    // ghi đè bằng giá trị người dùng nhập
  })
  await router.replace({ query: nextQuery })
}
onMounted(() => {
  console.log('Giới hạn trang:', props.page_limit)
})
</script>
