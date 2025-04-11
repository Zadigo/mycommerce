import { useAuthenticatedAxiosClient, type LoginApiResponse } from '~/composables/client'
import type { StringNull } from "~/types"

export function useAuthencationComposable() {
    const nuxtApp = tryUseNuxtApp()

    const router = useRouter()
    const authStore = useAuthentication()
    
    const email = ref<StringNull>('')
    const password = ref<StringNull>('')
    const authenticationFailuresCounter = ref(0)

    const access = useCookie('access')
    const refresh = useCookie('refresh')

    /**
     * Base entry function used to request an authentication
     * access/refresh token in order to login the user 
     */
    async function authenticate(path: string, callback: (data: LoginApiResponse) => void) {
        try {
            if (nuxtApp) {
                const { authenticatedClient: client } = useAuthenticatedAxiosClient(access.value, refresh.value)

                const response = await client.post<LoginApiResponse>(path, {
                    username: email.value,
                    email: email.value,
                    password: password.value
                })
    
                authenticationFailuresCounter.value = 0
    
                callback.call(nuxtApp, response.data)                
            }
        } catch {
            authenticationFailuresCounter.value += 1
        }
    }

    async function login(callback: (data: LoginApiResponse) => void) {
        await authenticate('/token/', callback)
    }

    async function refreshToken(callback: (data: LoginApiResponse) => void) {
        await authenticate('/refesh/', callback)
    }

    async function logout(callback: () => void) {
        try {
            const accessToken = useCookie('access')
            const refreshToken = useCookie('refresh')
            
            accessToken.value = null
            refreshToken.value = null
            authStore.profile = null

            router.push('/')

            callback.call(nuxtApp)
        } catch {
            // Do something
        }
    }

    async function testLogin (callback: () => void) {
        const accessToken = useCookie('access')
        const refreshToken = useCookie('refresh')

        accessToken.value = 'test token'
        refreshToken.value = 'refresh token'

        callback()
    }

    return {
        email,
        password,
        authenticationFailuresCounter,
        testLogin,
        authenticate,
        login,
        logout,
        refreshToken
    }
}
