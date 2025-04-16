import { useAuthenticatedAxiosClient, type LoginApiResponse } from '~/composables/client'
import type { StringNull } from "~/types"

export function useAuthencationComposable() {
    const nuxtApp = tryUseNuxtApp()

    const router = useRouter()
    
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

    /**
     * 
     */
    async function login(callback: (data: LoginApiResponse) => void) {
        await authenticate('/auth/v1/token/', callback)
    }

    /**
     * 
     */
    async function refreshToken(callback: (data: LoginApiResponse) => void) {
        await authenticate('/auth/v1/refesh/', callback)
    }

    /**
     * 
     */
    async function logout(callback: () => void) {
        try {
            const accessToken = useCookie('access')
            const refreshToken = useCookie('refresh')
            
            accessToken.value = null
            refreshToken.value = null

            router.push('/')

            callback.call(nuxtApp)
        } catch {
            // Do something
        }
    }

    return {
        email,
        password,
        authenticationFailuresCounter,
        authenticate,
        login,
        logout,
        refreshToken
    }
}
