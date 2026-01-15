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
  console.log("=== BẮT ĐẦU SUBMIT FORM BÁO CÁO ===");
  
  // Validation
  if (!props.id) {
    alert(`Thiếu Id của ${props.type}`);
    return;
  }
  
  if (!reason.value?.trim()) {
    alert('Hãy nhập lý do báo cáo');
    return;
  }
  
  const payload = { reason: reason.value.trim() };
  
  try {
    loading.value = true;
    console.log("Đang gửi request:", payload);
    
    const res = await api.post(`/api/${props.type}/${props.id}/report`, payload);
    
    console.log("✅ Response thành công:", res.data);
    serverMsg.value = res.data?.message || 'Báo cáo đã được gửi';
    reason.value = '';
    alert('Gửi báo cáo thành công! ✓');
    close();
    
  } catch (err) {
    console.error("❌ LỖI XẢY RA:", err);
    console.log("Error response:", err.response);
    console.log("Error status:", err.response?.status);
    console.log("Error data:", err.response?.data);
    
    // Biến để lưu thông báo sẽ hiển thị
    let userMessage = '';
    
    // CASE 1: Có phản hồi từ server (err.response tồn tại)
    if (err.response) {
      const status = err.response.status;
      const data = err.response.data;
      
      switch (status) {
        case 422: // Validation error
          userMessage = 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
          
          if (data?.errors) {
            err.value = data.errors;
            // Lấy lỗi đầu tiên để hiển thị
            const firstError = Object.values(data.errors)[0];
            if (firstError && firstError[0]) {
              userMessage = firstError[0];
            }
          } else if (data?.message) {
            userMessage = data.message;
          }
          
          serverMsg.value = userMessage;
          break;
          
        case 409: // Conflict - Đã báo cáo rồi
          userMessage = data?.message || 'Bạn đã báo cáo người dùng hoặc bài viết này rồi.';
          serverMsg.value = userMessage;
          break;
          
        case 401: // Unauthorized
          userMessage = 'Bạn cần đăng nhập để thực hiện chức năng này.';
          serverMsg.value = userMessage;
          break;
          
        case 403: // Forbidden
          userMessage = 'Bạn không có quyền thực hiện hành động này.';
          serverMsg.value = userMessage;
          break;
          
        case 404: // Not found
          userMessage = `Không tìm thấy ${props.type} này.`;
          serverMsg.value = userMessage;
          break;
          
        case 429: // Too many requests
          userMessage = 'Bạn đã gửi quá nhiều yêu cầu. Vui lòng thử lại sau.';
          serverMsg.value = userMessage;
          break;
          
        case 500: // Server error
        case 502:
        case 503:
        case 504:
          userMessage = 'Máy chủ đang gặp sự cố. Vui lòng thử lại sau.';
          serverMsg.value = userMessage;
          break;
          
        default:
          userMessage = data?.message || `Có lỗi xảy ra (Mã lỗi: ${status}). Vui lòng thử lại.`;
          serverMsg.value = userMessage;
      }
      
    } 
    // CASE 2: Lỗi mạng/CORS (không có err.response)
    else if (err.request) {
      // Request được gửi nhưng không nhận được phản hồi
      console.error("Không nhận được phản hồi từ server:", err.request);
      userMessage = 'Không thể kết nối tới máy chủ. Vui lòng kiểm tra kết nối mạng.';
      serverMsg.value = userMessage;
    } 
    // CASE 3: Lỗi khác (setup request, timeout, etc.)
    else {
      console.error("Lỗi khi thiết lập request:", err.message);
      userMessage = 'Có lỗi xảy ra khi gửi báo cáo. Vui lòng thử lại.';
      serverMsg.value = userMessage;
    }
    
    // ⚠️ QUAN TRỌNG: Luôn hiển thị alert cho mọi trường hợp lỗi
    alert(userMessage);
    
    // Log chi tiết để debug
    console.group("📋 Chi tiết lỗi");
    console.log("Message hiển thị:", userMessage);
    console.log("Server message:", serverMsg.value);
    console.log("Full error:", err);
    console.groupEnd();
    
  } finally {
    loading.value = false;
    console.log("=== KẾT THÚC SUBMIT ===");
  }
}
</script>
