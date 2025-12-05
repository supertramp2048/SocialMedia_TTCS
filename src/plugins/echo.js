import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import apiClient from '@/api/apiClient'

console.log('[ECHO PLUGIN] echo.js loaded')

// Make Pusher available globally
window.Pusher = Pusher

const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap1'
const pusherHost = import.meta.env.VITE_PUSHER_HOST
const pusherPort = import.meta.env.VITE_PUSHER_PORT
const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME || 'http'

// Only enable Pusher logging in development
if (import.meta.env.DEV) {
  window.Pusher.logToConsole = true
} else {
  window.Pusher.logToConsole = false
}

let echo = null

if (pusherKey) {
  try {
    // true nếu cả host và port đều có
    const useLocalWebsockets = !!(pusherHost && pusherPort)

    const echoConfig = {
  broadcaster: 'pusher',
  key: pusherKey,
  cluster: pusherCluster,
  enabledTransports: ['ws', 'wss'],
  enableStats: false, // <- thay cho disableStats
  authorizer: (channel, options) => ({
    authorize: (socketId, callback) => {
      apiClient
        .post('/broadcasting/auth', {
          socket_id: socketId,
          channel_name: channel.name,
        })
        .then((response) => callback(null, response.data))
        .catch((error) => {
          console.error('Echo authorization error:', error)
          callback(error, null)
        })
    },
  }),
}

if (useLocalWebsockets) {
  echoConfig.wsHost = pusherHost || window.location.hostname
  echoConfig.wsPort = parseInt(pusherPort) || 6001
  echoConfig.wssPort = echoConfig.wsPort
  echoConfig.forceTLS = pusherScheme === 'https'
}

    console.log('[ECHO CONFIG]', echoConfig)

    echo = new Echo(echoConfig)

    if (echo?.connector?.pusher) {
      const connection = echo.connector.pusher.connection

      connection.bind('state_change', (states) => {
        console.log('[PUSHER STATE]', states.previous, '→', states.current)
      })

      connection.bind('connected', () => {
        console.log('[PUSHER] Connected thành công!')
      })

      connection.bind('error', (err) => {
        console.error('[PUSHER ERROR]', err)
      })
    }
  } catch (error) {
    console.warn('Failed to initialize Laravel Echo:', error)
    console.log(error)
    echo = createMockEcho()
  }
} else {
  console.warn('Pusher app key not found. Real-time features will be disabled.')
  echo = createMockEcho()
}

function createMockEcho() {
  return {
    channel: () => ({
      listen: () => {},
      subscribed: () => {},
    }),
    private: () => ({
      listen: () => {},
      subscribed: () => {},
    }),
    leave: () => {},
  }
}

window.echo = echo
export default echo
