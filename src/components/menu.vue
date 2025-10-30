<script setup>
import { ref, watchEffect } from 'vue'

/** Các tab và “sort key” để gọi API */
const tabs = [
  { key: 'hot',     label: 'THỊNH HÀNH',  icon: '🔥' },
  { key: 'newest',  label: 'MỚI',         icon: '⭐' },
  { key: 'buzz',    label: 'SÔI NỔI',     icon: '🌀' },
  { key: 'top',     label: 'TOP',         icon: '🏁' },
]

// v-model kiểu đơn giản để cha nhận được key đang chọn
const props = defineProps({ modelValue: { type: String, default: 'hot' } })
const emit  = defineEmits(['update:modelValue', 'change'])

const active = ref(props.modelValue)
watchEffect(() => (active.value = props.modelValue))

function selectTab(key) {
  if (key === active.value) return
  active.value = key
  emit('update:modelValue', key)
  emit('change', key) // tiện cho cha bắn API theo sort=key
}
</script>

<template>
  <div class="border-b border-slate-200 relative">
    <!-- Title trái giống ảnh -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-extrabold tracking-wide text-slate-900 flex items-center gap-2">
        <span class="inline-block w-1.5 h-6 bg-sky-500 rounded-sm"></span>
        DÀNH CHO BẠN
      </h2>

      <!-- Tabs phải -->
      <nav class="flex items-center gap-6 text-sm font-semibold">
        <button
          v-for="t in tabs"
          :key="t.key"
          class="relative pb-2 uppercase tracking-wide transition-colors"
          :class="active === t.key ? 'text-sky-600' : 'text-slate-600 hover:text-slate-900'"
          @click="selectTab(t.key)"
        >
          <span class="inline-flex items-center gap-2">
            <span class="opacity-80">{{ t.icon }}</span>
            <span>{{ t.label }}</span>
          </span>

          <!-- underline mỗi tab (ẩn/hiện) -->
          <span
            class="absolute left-0 right-0 -bottom-[1px] h-0.5 bg-sky-500 transition-opacity"
            :class="active === t.key ? 'opacity-100' : 'opacity-0'"
          />
        </button>
      </nav>
    </div>
  </div>
</template>
