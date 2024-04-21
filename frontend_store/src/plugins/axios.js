import axios from 'axios'

/**
 * 
 * Returns the proper API url for calling
 * the backend depending on the application's
 * development state
 *  
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

export {
  client
}

