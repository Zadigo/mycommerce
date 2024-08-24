import { computed, getCurrentInstance, ref } from 'vue'
import { whenever } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import { client } from 'src/plugins/axios'
import { useAuthentication } from 'src/stores/authentication'
import { useVueSession } from 'src/plugins/vue-storages'

/**
 * This Vue composable provides functionality for managing 
 * user authentication within a Vue application. It integrates 
 * session management with cookies to handle user login, logout, and 
 * token refresh 
 */
export function useAuthenticationComposable () {
  const app = getCurrentInstance()

  const { instance } = useVueSession()
  const authenticationStore = useAuthentication()
  const cookies = useCookies(['authentication'])

  const email = ref(null)
  const password = ref(null)
  const authenticationFailuresCounter = ref(0)
  
  /**
   * Indicates the authentication token used to
   * communicated securily with the backend on
   * pages that require a form or authentication
   * 
   * @returns String
   */
  const authToken = computed(() => {
    return cookies.get('token')
  })

  const isAuthenticated = computed(() => {
    return (
      typeof authToken.value !== 'undefined' &&
      authToken.value !== null
    )
  })

  /**
   * Checks the amount of times the user has failed
   * to try and authenticate himself
   */
  const hasReachedMaxAuthenticationFailures = computed(() => {
    return authenticationFailuresCounter.value > 3
  })

  whenever(hasReachedMaxAuthenticationFailures, () => {
    console.error('Attempted to login more than three times')
  })

  /**
   * Proxy function used to execute a callback by
   * passing in the current app context
   * 
   * @param {Function} func
   * @returns void
   */
  function executeCallback(func) {
    if (typeof func === 'function') {
      func.call(app)
    }
  }
  
  /**
   * Method that handles the login to the
   * backend
   * 
   * @param {Function} callback
   * @returns void
   */
  async function login (callback) {
    try {
      const response = await client.post('accounts/login', {
        email: email.value,
        password: password.value
      })
      instance.create('authentication', response.data)
      cookies.set('token', instance.dictGet('authentication', 'token'))
      authenticationFailuresCounter.value = 0

      authenticationStore.token = authToken.value
      authenticationStore.profile = response.data.user

      executeCallback(callback)
    } catch (e) {
      authenticationFailuresCounter.value += 1
      console.error(e)
    }
  }

  /**
   * Method that handles the logout to the
   * backend
   * 
   * @param {Function} callback
   * @returns void
   */
  async function logout (callback) {
    try {
      await client.post('accounts/logout')

      instance.remove('authentication')
      cookies.remove('token')

      authenticationFailuresCounter.value = 0
      authenticationStore.token = null

      executeCallback(callback)
    } catch (e) {
      console.error(e)
    }
  }

  /**
   * Function used to refresh the authentication
   * token 
   */
  async function refresh () {
    try {
      cookies.get('token')
    } catch (e) {
      console.error(e)
    }
  }

  function authenticateFromCache () {
    return instance.retrieve('token')
  }

  return {
    email,
    password,
    authToken,
    isAuthenticated,
    authenticationFailuresCounter,
    cookies,
    hasReachedMaxAuthenticationFailures,
    authenticateFromCache,
    login,
    refresh,
    logout
  }
}
