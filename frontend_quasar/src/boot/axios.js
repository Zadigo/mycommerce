import axios from 'axios'
import { boot } from 'quasar/wrappers'
import { useAuthentication } from 'src/stores/authentication'

console.log(process.env)
function getAPIUrl () {
  if (process.env.DEV) {
    return process.env.DEVELOPMENT_API_URL
  } else {
    return process.env.PRODUCTION_API_URL
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)
const api = axios.create({ 
  baseURL: getAPIUrl(),
  // headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
  timeout: 20000
})

api.interceptors.response.use(
  response => {
    const store = useAuthentication()
    if (response.status === 403) {
      store
    }
    return response
  }
)

export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }
