// src/echo.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import Cookies from 'js-cookie'

window.Pusher = Pusher

// Bật Pusher logging để debug
window.Pusher.logToConsole = true

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,

  authEndpoint: `${import.meta.env.VITE_API_BASE}/broadcasting/auth`,

  auth: {
    headers: {
      // Lấy token mới mỗi lần auth (không cache)
      Authorization: `Bearer ${Cookies.get('token') }`,
      Accept: 'application/json',
    }
  }
})

export default echo
