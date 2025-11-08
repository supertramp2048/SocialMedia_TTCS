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
        <h3 class="text-lg font-semibold mb-4">Dán URL cho ảnh bìa</h3>

        <form @submit.prevent="$emit('submitURL')">
          <div class="space-y-3">
            <label class="block text-sm">
              URL
              <input type="text">
            </label>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="px-3 py-2 rounded border" @click="close">
              Hủy
            </button>
            <button type="submit" class="btnEffect px-3 py-2 rounded bg-red-600 text-white" :disabled="loading || !props.id">
              Xong
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
import api from '../../API/axios' 
const props = defineProps({
  modelValue: { type: Boolean, required: true },  // v-model từ cha
})
const emit = defineEmits(['update:modelValue'])


function close() {
  emit('update:modelValue', false)
}

async function submitReport() {
  console.log("submit form url");
  
}
</script>
