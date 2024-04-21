import { computed, getCurrentInstance, ref } from 'vue'
import { useCookies } from '@vueuse/integrations/useCookies'
import { client } from 'src/plugins/axios'
import { useAuthentication } from 'src/stores/authentication'
import { useVueSession } from 'src/plugins/vue-storages'
// import { useRouter } from 'vue-router'
import { whenever } from '@vueuse/core'

/**
 * This Vue composable provides functionality for managing 
 * user authentication within a Vue application. It integrates 
 * session management with cookies to handle user login, logout, and 
 * token refresh 
*/
export function useAuthenticationComposable () {
  const app = getCurrentInstance()

  const { session } = useVueSession()
  const authenticationStore = useAuthentication()
  const cookies = useCookies(['authentication'])
  // const router = useRouter()

  const email = ref(null)
  const password = ref(null)
  const authenticationFailuresCounter = ref(0)
  
  const authToken = computed(() => {
    return cookies.get('token')
  })

  const isAuthenticated = computed(() => {
    return (
      typeof authToken.value !== 'undefined' &&
      authToken.value !== null
    )
  })

  whenever(authenticationFailuresCounter, (attempts) => {
    if (attempts > 3) {
      console.log('Attempted to login more than three times')
      // Do something here
    }
  })

  function executeCallback(func) {
    if (typeof func === 'function') {
      func.call(app)
    }
  }
  
  async function login (callback) {
    try {
      const response = await client.post('accounts/login', {
        email: email.value,
        password: password.value
      })
      session.create('authentication', response.data)
      cookies.set('token', session.dictGet('authentication', 'token'))
      authenticationFailuresCounter.value = 0

      authenticationStore.token = authToken.value

      executeCallback(callback)

    } catch (e) {
      authenticationFailuresCounter.value += 1
      console.log(e)
    }
  }

  async function logout (callback) {
    try {
      await client.post('accounts/logout')

      session.remove('authentication')
      cookies.remove('token')

      authenticationFailuresCounter.value = 0
      authenticationStore.token = null

      executeCallback(callback)
      
      // router.push({
      //   name: 'shop_products'
      // })
    } catch (e) {
      console.log(e)
    }
  }

  async function refresh () {
    try {
      cookies.get('token')
    } catch (e) {
      console.log(e)
    }
  }

  function authenticateFromCache () {
    return session.retrieve('token')
  }

  return {
    email,
    password,
    authToken,
    isAuthenticated,
    authenticationFailuresCounter,
    cookies,
    authenticateFromCache,
    login,
    refresh,
    logout
  }
}
