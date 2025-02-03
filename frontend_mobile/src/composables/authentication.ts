import { useAxiosClient } from '@/composables/utils'
import type { LoginAPIResponse } from "@/types"
import { useCookies } from '@vueuse/integrations/useCookies'
import { getCurrentInstance, ref } from "vue"

export function useAuthencationComposable() {
    const vueApp = getCurrentInstance()

    const email = ref<string>('')
    const password = ref<string>('')
    const authenticationFailuresCounter = ref(0)

    /**
     * Base entry function used to request an authentication
     * access/refresh token in order to login the user 
     */
    async function authenticate(path: string, callback: (data: LoginAPIResponse) => void) {
        try {
            if (vueApp) {
                const { createClient } = useAxiosClient()
                const authClient = createClient('/auth/v1/')

                const response = await authClient.post<LoginAPIResponse>(path, {
                    username: email.value,
                    email: email.value,
                    password: password.value
                })

                authenticationFailuresCounter.value = 0

                callback.call(vueApp, response.data)
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
            const cookies = useCookies(['access', 'refresh'])
            cookies.set('access', null)
            cookies.set('refresh', null)

            // const accessToken = useCookie('access')
            // const refreshToken = useCookie('refresh')

            // accessToken.value = null
            // refreshToken.value = null

            callback.call(vueApp)
        } catch {
            // Do something
        }
    }

    async function testLogin(callback: () => void) {
        // const accessToken = useCookie('access')
        // const refreshToken = useCookie('refresh')

        // accessToken.value = 'test token'
        // refreshToken.value = 'refresh token'

        const cookies = useCookies(['access', 'refresh'])
        cookies.set('access', 'test_token')
        cookies.set('refresh', 'refresh_token')

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
        refresh
    }
}
