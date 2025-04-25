import { useJwt } from '@vueuse/integrations/useJwt'
import { defineStore } from 'pinia'

import type { Profile, SessionCacheData, StringNull, LoginApiResponse } from '~/types'

interface JWTResponseData {
    user_id: number
}

export const useAuthentication = defineStore('authentication', () => {
    const sessionCache = ref<SessionCacheData>()

    // Modals
    const showLoginDrawer = ref(false)

    const accessToken = ref<StringNull>('')
    const refreshToken = ref<StringNull>('')

    // TODELETE: Sync with firebase
    const profile = ref<Profile>()
    
    /**
     * 
     */
    const isAuthenticated = computed(() => {
        return !isNull(accessToken.value)
    })

    /**
     * 
     */
    const userId = computed(() => {
        if (accessToken.value) {
            const result = useJwt<JWTResponseData>(accessToken.value).payload.value
            if (result) {
                const { user_id } = result
                return user_id
            } 
        }
        return null
    })

    // TODELETE
    function logout() {
        accessToken.value = null
        refreshToken.value = null
    }

    // TODELETE
    function setTokens (data: LoginApiResponse) {
        accessToken.value = data.access
        refreshToken.value = data.refresh
    }

    return {
        logout,
        setTokens,
        profile,
        sessionCache,
        userId,
        isAuthenticated,
        showLoginDrawer,
        accessToken,
        refreshToken
    }
})
