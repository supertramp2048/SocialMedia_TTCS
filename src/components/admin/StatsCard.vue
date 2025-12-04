<template>
  <div class="bg-white rounded-lg shadow p-6">
    <div class="flex items-center">
      <div
        class="p-3 rounded-full"
        :class="iconBgClass"
      >
        <component :is="icon" class="h-6 w-6" :class="iconClass" />
      </div>
      <div class="ml-4 flex-1">
        <p class="text-sm font-medium text-gray-600">{{ label }}</p>
        <p class="text-2xl font-semibold text-gray-900">{{ value }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  value: {
    type: [String, Number],
    required: true,
  },
  icon: {
    type: Object,
    required: true,
  },
  iconBgClass: {
    type: String,
    default: 'bg-blue-100',
  },
  iconClass: {
    type: String,
    default: 'text-blue-600',
  },
})
</script>

