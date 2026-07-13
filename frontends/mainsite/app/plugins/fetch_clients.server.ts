import { getCookie } from 'h3'

export default defineNuxtPlugin(async (nuxtApp) => {
  const event = useRequestEvent(nuxtApp)
  if (!event) return

  const config = useRuntimeConfig()
  const access = getCookie(event, 'access')

  let client: ReturnType<typeof $fetch.create> | null = null

  if (access) {
    // const isAuthenticated = useState<boolean>('isAuthenticated')
    
    client = $fetch.create({
      baseURL: config.public.prodDomain,
      onRequest({ options }) {
        options.headers.set('Content-Type', 'application/json')
        options.headers.set('Authorization', `${config.public.nuxtAuthentication.bearerTokenType} ${access}`)
      },
      async onResponseError({ response }) {
        if (response.status === 401) {
          const { renew } = await useRefreshAccessToken()
          await renew()

          await nuxtApp.runWithContext(() => navigateTo('/'))
        }
      }
    })
  }

  const goPurchase = $fetch.create({
    baseURL: useRuntimeConfig().public.golangProdUrl,
    onRequest({ options }) {
      options.headers.set('Accept', 'application/json')
      options.headers.set('Content-Type', 'application/json')
    }
  })

  return {
    provide: {
      client,
      goPurchase
    }
  }
})
