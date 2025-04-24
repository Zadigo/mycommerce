/**
 * Helper function used to ask for a new access
 * token for the user
 */
export async function refreshAccessToken(refresh: string) {
  const response = await $fetch<RefreshApiResposne>('/auth/v1/refresh/token/', {
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
 * Function used to login the user in the frontend 
 */
export async function login(email: string, password: string) {
  const response = await $fetch<LoginApiResponse>('/auth/v1/token', {
    baseURL: useRuntimeConfig().public.prodDomain,
    method: 'POST',
    body: {
      email,
      password
    }
  })

  return {
    access: response.access,
    refresh: response.refresh
  }
}
