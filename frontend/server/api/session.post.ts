export default defineEventHandler(async event => {
  const access = getCookie(event, 'access')

  const response = await $fetch<{ token: string }>('/api/v1/cart/session-id', {
    baseURL: useRuntimeConfig().public.prodDomain,
    method: 'POST',
    headers: [
      ['Authorization', access ? `Token ${access}` : '']
    ]
  })

  return {
    token: response.token
  }
})
