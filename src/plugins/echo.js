import Echo from 'laravel-echo'
import Pusher from 'pusher-js'
import apiClient from '@/api/apiClient'

// Make Pusher available globally
window.Pusher = Pusher

// Only enable Pusher logging in development
if (import.meta.env.DEV) {
  window.Pusher.logToConsole = true
} else {
  window.Pusher.logToConsole = false
}

// Only initialize Echo if Pusher key is provided
const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY
const pusherCluster = import.meta.env.VITE_PUSHER_APP_CLUSTER
const pusherHost = import.meta.env.VITE_PUSHER_HOST
const pusherPort = import.meta.env.VITE_PUSHER_PORT
const pusherScheme = import.meta.env.VITE_PUSHER_SCHEME || 'http'

let echo = null

if (pusherKey) {
  try {
    // Determine if using local Laravel Websockets or Pusher cloud
    const useLocalWebsockets = pusherHost && pusherPort

    const echoConfig = {
      broadcaster: 'pusher',
      key: pusherKey,
      disableStats: true,
      enabledTransports: ['ws', 'wss'], // Only use WebSocket, not HTTP fallback

      authorizer: (channel, options) => {
        return {
          authorize: (socketId, callback) => {
            apiClient
              .post('/broadcasting/auth', {
                socket_id: socketId,
                channel_name: channel.name,
              })
              .then((response) => {
                callback(null, response.data)
              })
              .catch((error) => {
                console.error('Echo authorization error:', error)
                callback(error, null)
              })
          },
        }
      },
    }

    if (useLocalWebsockets) {
      // Local Laravel Websockets configuration
      echoConfig.wsHost = pusherHost || window.location.hostname
      echoConfig.wsPort = parseInt(pusherPort) || 6001
      echoConfig.forceTLS = pusherScheme === 'https'
      echoConfig.disableStats = true
    } else {
      // Pusher cloud configuration - cluster is required
      if (pusherCluster) {
        echoConfig.cluster = pusherCluster
      } else {
        // Default cluster if not provided
        echoConfig.cluster = 'mt1'
      }
      echoConfig.forceTLS = pusherScheme === 'https'
    }

    echo = new Echo(echoConfig)
  } catch (error) {
    console.warn('Failed to initialize Laravel Echo:', error)
    // Create a mock echo object to prevent errors
    echo = createMockEcho()
  }
} else {
  console.warn('Pusher app key not found. Real-time features will be disabled.')
  // Create a mock echo object to prevent errors
  echo = createMockEcho()
}

// Helper function to create a mock echo object
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
window.echo = echo // Make Echo available globally
export default echo

