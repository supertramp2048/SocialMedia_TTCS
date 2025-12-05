// src/utils/resetStores.js
import { pinia } from '../main'  // đường dẫn tuỳ project của anh

export function resetAllStores() {
  pinia._s.forEach((store) => {
    if (typeof store.$reset === 'function') {
      store.$reset()
    }
  })
}
