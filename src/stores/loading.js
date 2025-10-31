import { defineStore } from 'pinia'

export const useLoadingStore = defineStore('loading', {
  state: () => ({ count: 0 }),
  getters: { isLoading: (s) => s.count > 0 },
  actions: {
    start() { this.count++ },
    stop() { this.count = Math.max(0, this.count - 1) }
  }
})
