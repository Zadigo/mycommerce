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
export function useUser() {
  if (import.meta.server) {
    return  {
      userId: computed(() => null as Nullable<number>),
      isAuthenticated: ref(false),
      getProfile: async (userId: number) => null as Nullable<Profile>
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
    return null
  })

  const getProfile = useMemoize(async (userId: Nullable<number>) => {
    if (isDefined(userId)) {
      const { $client } = useNuxtApp()

      const data = await $client<Profile>(`/api/v1/accounts/${userId}`, {
        method: 'GET'
      })
      return data
    }

    return undefined
  })

  return {
    userId,
    isAuthenticated,
    getProfile
  }
}
