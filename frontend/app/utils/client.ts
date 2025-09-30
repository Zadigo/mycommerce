import type { LoginApiResponse, TokenRefreshApiResponse } from '~/types'

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
export async function login(email: string, password: string) {
  if (import.meta.server) {
    return {
      access: '',
      refresh: ''
    }
  }

  const failureCount = ref(0)

  const response = await $fetch<LoginApiResponse>('/auth/v1/token/', {
    baseURL: useRuntimeConfig().public.prodDomain,
    method: 'POST',
    body: {
      username: email,
      password
    },
    onRequestError() {
      failureCount.value += 1
    }
  })

  return {
    failureCount,
    access: response.access,
    refresh: response.refresh
  }
}

/**
 * Function used to logout the user
 */
export async function logout() {
  if (import.meta.server) {
    return
  }

  const accessToken = useCookie('access')
  const refreshToken = useCookie('refresh')

  accessToken.value = null
  refreshToken.value = null

  // router.push('/')
}
