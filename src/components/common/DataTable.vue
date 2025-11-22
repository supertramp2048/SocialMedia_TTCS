<template>
  <div class="bg-white rounded-lg shadow overflow-hidden">
    <div v-if="searchable" class="p-4 border-b border-gray-200">
      <input
        v-model="searchQuery"
        type="text"
        :placeholder="searchPlaceholder"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        @input="handleSearch"
      />
    </div>

    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {{ column.label }}
            </th>
            <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr
            v-for="(row, index) in data"
            :key="index"
            class="hover:bg-gray-50 transition-colors"
          >
            <td
              v-for="column in columns"
              :key="column.key"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
            >
              <slot :name="`cell-${column.key}`" :row="row" :value="getValue(row, column.key)">
                {{ getValue(row, column.key) }}
              </slot>
            </td>
            <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
              <slot name="actions" :row="row" :index="index">
                <button
                  v-for="action in actions"
                  :key="action.label"
                  @click="action.handler(row, index)"
                  class="ml-2 text-blue-600 hover:text-blue-900"
                  :class="action.class"
                >
                  {{ action.label }}
                </button>
              </slot>
            </td>
          </tr>
          <tr v-if="data.length === 0">
            <td :colspan="columns.length + (actions ? 1 : 0)" class="px-6 py-4 text-center text-gray-500">
              No data available
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  columns: {
    type: Array,
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  actions: {
    type: Array,
    default: undefined,
  },
  searchable: {
    type: Boolean,
    default: false,
  },
  searchPlaceholder: {
    type: String,
    default: 'Search...',
  },
})

const emit = defineEmits(['search'])

const searchQuery = ref('')

const getValue = (obj, path) => {
  return path.split('.').reduce((o, p) => o?.[p], obj)
}

const handleSearch = () => {
  emit('search', searchQuery.value)
}
</script>

