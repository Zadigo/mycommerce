import { useAuthenticatedAxiosClient } from '~/composables/client'

export default defineNuxtPlugin(_nuxtApp => {
    const access = useCookie('access')
    const refresh = useCookie('referesh')
    console.log('defineNuxtPlugin', access.value, refresh.value)
    const { authenticatedClient: client } = useAuthenticatedAxiosClient(access.value, refresh.value)
    
    return {
        provide: {
            client
        }
    }
})
