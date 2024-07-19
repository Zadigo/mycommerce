import { useVueSession } from './vue-storages'
import { useAuthentication } from 'src/stores/authentication'
import { useCookies } from '@vueuse/integrations/useCookies'
import { useMessages } from 'src/stores/messages'

import axios from 'axios'

/**
 * 
 * Returns the proper API url for calling
 * the backend depending on the application's
 * development state
 * 
 * @returns {String} String url 
 */
function getApiUrl () {
  if (import.meta.env.DEV) {
    return import.meta.env.VITE_DEVELOPMENT_API_URL
  } else {
    return import.meta.env.VITE_PRODUCTION_API_URL
  }
}

const client = axios.create({
  baseURL: getApiUrl(),
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 10000
})

client.interceptors.request.use(
  config => {
    const store = useAuthentication()

    if (store.isAuthenticated) {
      config.headers.Authorization = `Token ${store.token}`
    }

    return config
  }
)

client.interceptors.response.use(
  response => {
    if (response.status === 401) {
      const cookies = useCookies()
      const { session } = useVueSession()
      
      session.remove('authentication')
      session.remove('profile')
      cookies.remove('token')
    }

    if ([404, 500].includes(response.status)) {
      const messagesStore = useMessages()
      messagesStore.addNetworkError()
    }
    return response
  }
)

export {
  client
}

