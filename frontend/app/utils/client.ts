import { useJwt } from '@vueuse/integrations/useJwt'
import type { LoginApiResponse, Nullable, Profile, TokenRefreshApiResponse } from '~/types'

/**
 * Helper function used to ask for a new access
 * token for the user
 */
export async function refreshAccessToken(refresh: string) {
  const response = await $fetch<TokenRefreshApiResponse>('/auth/v1/token/refresh/', {
    baseURL: useRuntimeConfig().public.prodDomain,
    method: 'POST',
    body: {
      refresh
    }
  })

  return {
    access: response.access
  }
}

/**
 * Function used to refresh the access token
 * on the client side
 */
export async function refreshAccessTokenClient() {
  if (import.meta.server) {
    return {
      access: null
    }
  }

  const refreshToken = useCookie('refresh')
  if (isDefined(refreshToken)) {
    const response = await refreshAccessToken(refreshToken.value)
    if (response.access) {
      useCookie('access').value = response.access
    }

    return response
  }

  return { access: null }
}

/**
 * Function used to login the user in the frontend 
 */
export function useLogin() {
  if (import.meta.server) {
    return {
      login: async () => { },
      email: ref(''),
      password: ref(''),
      failureCount: ref(0),
      access: '',
      refresh: ''
    }
  }

  const failureCount = ref(0)

  const email = ref<string>('')
  const password = ref<string>('')


  const accessToken = useCookie('access', { sameSite: 'strict', secure: true })
  const refreshToken = useCookie('refresh', { sameSite: 'strict', secure: true })

  async function login() {
    const data = await $fetch<LoginApiResponse>('/auth/v1/token/', {
      baseURL: useRuntimeConfig().public.prodDomain,
      method: 'POST',
      body: {
        username: email.value,
        password: password.value
      },
      onRequestError() {
        failureCount.value += 1
      }
    })

    if (data) {
      accessToken.value = data.access
      refreshToken.value = data.refresh
      useState('isAuthenticated').value = true
    }
  }

  return {
    login,
    email,
    password,
    failureCount,
    accessToken,
    refreshToken
  }
}

/**
 * Function used to logout the user
 */
export async function useLogout() {
  if (import.meta.server) {
    return
  }

  const accessToken = useCookie('access')
  const refreshToken = useCookie('refresh')

  accessToken.value = null
  refreshToken.value = null

  useState('isAuthenticated').value = false

  // router.push('/')
}

interface JWTResponseData {
  user_id: number
}

/**
 * Composable used to check if the user is logged in
 */
export function useUser<P>() {
  if (import.meta.server) {
    return {
      userId: computed(() => null),
      isAuthenticated: ref(false),
      getProfile: async (id: Nullable<number>) => null as Nullable<P>
    }
  }

  const accessToken = useCookie('access')
  const isAuthenticated = useState('isAuthenticated', () => isDefined(accessToken) && accessToken.value !== '')

  const userId = computed(() => {
    if (accessToken.value) {
      const result = useJwt<JWTResponseData>(accessToken.value).payload.value

      if (result) {
        const { user_id } = result
        return user_id
      }
    }
    return undefined
  })

  const getProfile = useMemoize(async (id: Nullable<number>) => {
    if (isDefined(id)) {
      const { $client } = useNuxtApp()

      const data = await $client<P>(`/api/v1/accounts/${id}`, {
        method: 'GET'
      })
      return data
    }
    console.warn('User ID is not defined')
  })

  return {
    userId,
    isAuthenticated,
    getProfile
  }
}
