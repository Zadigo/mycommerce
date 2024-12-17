import type { LoginAPIResponse, StringNull } from "~/types"
import {  useAxiosClient } from '@/composables/utils'

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
                const { createClient } = useAxiosClient()
                const authClient = createClient('/auth/v1/')

                const response = await authClient.post<LoginAPIResponse>(path, {
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

    async function login(callback: (data: LoginAPIResponse) => void) {
        await authenticate('/token/', callback)
    }

    async function refresh(callback: (data: LoginAPIResponse) => void) {
        await authenticate('/refesh/', callback)
    }

    async function logout(callback: () => void) {
        try {
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
        refresh,
        authenticateFromCache
    }
}
