import { client } from '@/plugins/axios'
import { useVueSession } from '@/plugins/vue-storages'
import { useAuthentication } from '@/stores/authentication'
import { LoginAPIResponse } from '@/types/authentication'
import { whenever } from '@vueuse/core'
import { useCookies } from '@vueuse/integrations/useCookies'
import { computed, getCurrentInstance, ref } from 'vue'

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

  const email = ref<string | null>(null)
  const password = ref<string | null>(null)
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
   * Method that handles the login to the
   * backend
   * 
   * @param {Function} callback
   * @returns void
   */
  async function login (callback: (data: LoginAPIResponse) => void) {
    try {
      const response = await client.post<LoginAPIResponse>('accounts/login', {
        email: email.value,
        password: password.value
      })

      instance.create('authentication', response.data)
      cookies.set('token', response.data.token)
      authenticationFailuresCounter.value = 0

      authenticationStore.token = authToken.value
      authenticationStore.profile = response.data.user

      callback.call(app, response.data)
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
  async function logout (callback: () => void) {
    try {
      await client.post('accounts/logout')

      instance.remove('authentication')
      cookies.remove('token')

      authenticationFailuresCounter.value = 0
      authenticationStore.token = null

      callback.call(app)
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
      cookies.get<string>('token')
    } catch (e) {
      console.error(e)
    }
  }

  function authenticateFromCache () {
    return instance.retrieve<string>('token')
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
