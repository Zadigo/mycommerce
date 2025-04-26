export default defineNuxtPlugin(async nuxtApp => {
  const access = useCookie('access')
  const refresh = useCookie('refresh')

  console.log('access/refresh', access.value, refresh.value)

  const client = $fetch.create({
    baseURL: useRuntimeConfig().public.prodDomain,
    onRequest({ request, options, error }) {
      console.log('Authorization', access ? `Token ${access.value}` : '')
      options.headers.set('Content-Type', 'application/json')
      if (access.value) {
        options.headers.set('Authorization', `Token ${access.value}`)
      }
    },
    async onResponseError({ response }) {
      if (response.status === 401) {
        access.value = null
        
        if (refresh.value) {
          const { access: newAccess } = await refreshAccessToken(refresh.value)
          console.log('onResponseError', newAccess)
          access.value = newAccess
        } else {
          refresh.value = null
          await nuxtApp.runWithContext(() => navigateTo('/'))
        }
      }
    }
  })

  return {
    provide: {
      client
    }
  }
})
