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
  forceTLS: true, // Đổi thành false cho localhost
  wsHost: window.location.hostname, // Optional: nếu dùng Laravel Websockets
  wsPort: 6001, // Optional: nếu dùng Laravel Websockets
  disableStats: true, // Optional: tắt stats cho localhost

  authorizer: (channel, options) => {
    return {
      authorize: (socketId, callback) => {
        console.log(' Authorizing channel:', channel.name)
        console.log(' Socket ID:', socketId)

        // ✅ Dùng axios instance đã có interceptor set token
        api.post('/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name
        })
        .then(response => {
          console.log('✅ Authorization successful:', response.data)
          callback(null, response.data)
        })
        .catch(error => {
          console.error(' Echo authorize error:', error)
          console.error(' Error response:', error.response?.data)
          console.error(' Error status:', error.response?.status)
          callback(error, null)
        })
      }
    }
  }
})

export default echo
