// src/echo.js
import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import api from '../../API/axios' // Import axios instance đã config

window.Pusher = Pusher
window.Pusher.logToConsole = true

const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,

  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        // ✅ Dùng axios instance đã có interceptor set token
        api.post('/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
        .then(response => {
          callback(null, response.data)
        })
        .catch(error => {
          console.error('❌ Echo authorize error:', error)
          callback(error, null)
        })
      }
    }
  }
})

export default echo