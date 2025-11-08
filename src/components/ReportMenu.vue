<template>
  <div 
    class="absolute bg-white shadow-2xl rounded-xl z-50 min-w-[180px] border border-gray-100"
    :class="alignClass"
    role="menu"
    @keydown.esc="$emit('close')"
  >
    <button
      v-for="(item, index) in items"
      :key="index"
      @click.stop="item.action"
      :disabled="item.disabled"
      :class="[
        'w-full text-left px-4 py-2.5 text-sm hover:bg-sky-100 transition-colors',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent',
        index === 0 ? 'rounded-t-xl' : '',
        index === items.length - 1 ? 'rounded-b-xl' : ''
      ]"
      role="menuitem"
    >
      <i v-if="item.icon" :class="item.icon" class="mr-2"></i>
      {{ item.label }}
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  items: {
    type: Array,
    required: true,
    // items: [{ label: string, action: () => void, disabled?: boolean, icon?: string }]
  },
  align: {
    type: String,
    default: 'right',
    validator: (v) => ['left', 'right'].includes(v)
  }
})

const emit = defineEmits(['close'])

const alignClass = computed(() => {
  return props.align === 'left' 
    ? 'left-0' 
    : 'right-0'
})
</script>