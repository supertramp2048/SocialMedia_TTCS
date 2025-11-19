<template>
  <transition
    enter-active-class="transform ease-out duration-300"
    enter-from-class="translate-x-6 opacity-0"
    enter-to-class="translate-x-0 opacity-100"
    leave-active-class="transition duration-300"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="visible"
      @click="handleClick"
      class="fixed top-5 right-5 z-[9999] max-w-sm px-4 py-3 rounded-xl shadow-xl bg-white border border-gray-200 flex items-start gap-3 cursor-pointer hover:bg-gray-50 active:scale-95 transition"
    >
      <div class="mt-0.5">
        <i class="fa-solid fa-bell text-blue-500"></i>
      </div>
      <div>
        <p class="font-semibold text-gray-800 text-sm">{{ title }}</p>
        <p class="text-gray-600 text-xs">{{ message }}</p>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const title = ref('')
const message = ref('')
const payloadData = ref(null)

function showToast(t, msg, payload) {
  title.value = t
  message.value = msg
  payloadData.value = payload

  visible.value = true

  setTimeout(() => {
    visible.value = false
  }, 3000)
}

// Gửi dữ liệu lên parent khi click
function handleClick() {
  if (payloadData.value) {
    emit('toast-click', payloadData.value)
  }
  visible.value = false
}

const emit = defineEmits(['toast-click'])

defineExpose({ showToast })
</script>
