<template>
  <Teleport to="body">
    <div
      v-if="show"
      class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40"
    >
      <div class="flex flex-col items-center space-y-3">
        <!-- vòng quay loading -->
        <div
          class="h-10 w-10 border-4 border-white/40 border-t-white rounded-full animate-spin"
        />
        <p v-if="message" class="text-white text-sm">
          {{ message }}
        </p>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  message: {
    type: String,
    default: '',
  },
})
</script>
