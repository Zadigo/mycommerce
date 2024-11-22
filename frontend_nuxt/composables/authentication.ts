import type { LoginAPIResponse, StringNull } from "~/types"

export function useAuthencationComposable() {
    const nuxtApp = tryUseNuxtApp()
    
    const email = ref<StringNull>('')
    const password = ref<StringNull>('')
    const authenticationFailuresCounter = ref(0)

    /**
     * Base entry function used to request an authentication
     * access/refresh token in order to login the user 
     */
    async function authenticate(path: string, callback: (data: LoginAPIResponse) => void) {
        try {
            if (nuxtApp) {
                const response = await nuxtApp.$client.post<LoginAPIResponse>(path, {
                    username: email.value,
                    email: email.value,
                    password: password.value
                })

                const accessToken = useCookie('access')
                const refreshToken = useCookie('refresh')
                
                accessToken.value = response.data.access
                refreshToken.value = response.data.refresh
    
                authenticationFailuresCounter.value = 0
    
                callback.call(nuxtApp, response.data)                
            }
        } catch {
            authenticationFailuresCounter.value += 1
        }
    }

    async function login(callback: (data: LoginAPIResponse) => void) {
        await authenticate('/token/', callback)
    }

    async function refresh(callback: (data: LoginAPIResponse) => void) {
        await authenticate('/refesh/', callback)
    }

    async function logout(callback: () => void) {
        try {
            await nuxtApp.$client.post('accounts/logout')

            const accessToken = useCookie('access')
            const refreshToken = useCookie('refresh')
            
            accessToken.value = null
            refreshToken.value = null

            callback.call(nuxtApp)
        } catch {
            // Do something
        }
    }

    async function authenticateFromCache() {

    }

    return {
        email,
        password,
        authenticationFailuresCounter,
        authenticate,
        login,
        logout,
        refresh,
        authenticateFromCache
    }
}
