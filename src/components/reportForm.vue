<template>
  <Teleport to="body">
    <div
      v-if="modelValue"
      class="fixed inset-0 z-[999] flex items-center justify-center"
      aria-modal="true" role="dialog" tabindex="0"
      @keydown.esc="close"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/50" @click="close"></div>

      <!-- Content -->
      <div
        class="relative z-[1000] w-full max-w-md bg-white rounded-2xl shadow-xl p-5"
        @click.stop
      >
        <h3 class="text-lg font-semibold mb-4">Báo cáo 
          <span v-if="props.type=='posts'">Bài viết</span>
          <span v-else-if="props.type=='comments'">Bình luận</span>
          <span v-else-if="props.type=='users'">Người dùng</span>
        </h3>

        <form @submit.prevent="submitReport()">
          <div class="space-y-3">
            <label class="block text-sm">
              Lý do
              <textarea
                v-model="reason"
                class="mt-1 w-full border rounded px-3 py-2"
                rows="4"
                placeholder="Mô tả vấn đề bạn gặp phải..."
              />
            </label>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="px-3 py-2 rounded border" @click="close">
              Hủy
            </button>
            <button type="submit" class="btnEffect px-3 py-2 rounded bg-red-600 text-white" :disabled="loading || !props.id">
              {{ loading ? 'Đang gửi...' : 'Gửi báo cáo' }}
            </button>
          </div>
        </form>

        <button class="absolute top-2 right-2 p-2 rounded hover:bg-gray-100" @click="close" aria-label="Đóng">
          ✕
        </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref } from 'vue'
import api from '../../API/axios' // đường dẫn theo alias dự án của bạn
const props = defineProps({
  modelValue: { type: Boolean, required: true },  // v-model từ cha
  id: { type: [Number, String], required: true },
  type: {type: String,required: true}
})
const emit = defineEmits(['update:modelValue'])

const reason = ref('')
const loading = ref(false)
const serverMsg = ref('')  
function close() {
  emit('update:modelValue', false)
}

async function submitReport() {
  console.log("submit form báo cáo");
  
  if (!props.id){
    alert(`thiếu Id của ${props.type}`)
    return
  }
  if (!reason.value?.trim()){
    alert('Hãy nhập lý do báo cáo')
    return 
  } 
  const payload = { reason: reason.value.trim() } 
  try {
    loading.value = true
    const res = await api.post(`/api/${props.type}/${props.id}/report`, { reason: reason.value })
    serverMsg.value = res.data?.message 
    reason.value = ''
    alert('gửi báo cáo thành công') // thông báo cho cha
    close()
  } catch (err) {
    const status = err?.response?.status
    const data = err?.response?.data

    if (status === 422) {
      alert(err.message)
      // Có 2 khả năng:
      // 1) Lỗi validate: sẽ có data.errors.reason
      // 2) Tự báo cáo: message 'Bạn không thể báo cáo chính mình.'
      if (data?.errors) {
        errors.value = data.errors
      } else if (data?.message) {
        serverMsg.value = data.message
      }
    } else if (status === 409) {
      serverMsg.value = data?.message || 'Bạn đã báo cáo người dùng này rồi.'
      alert('Bạn đã báo cáo người dùng hoặc bài viết này rồi.')
    } else {
      serverMsg.value = 'Có lỗi xảy ra. Vui lòng thử lại.'
      console.error(err)
    }
  } finally {
    loading.value = false
  }
}
</script>
