import { useUtilities } from '@/composables/utils'
import { defineStore } from 'pinia'
import type { LoginAPIResponse, StringNull, Profile } from '~/types'

export const useAuthentication = defineStore('authentication', () => {
    const { isNull } = useUtilities()
    
    const showLoginDrawer = ref(false)
    const profile = ref<Profile>()
    const accessToken = ref<StringNull>('')
    const refreshToken = ref<StringNull>('')
    
    const isAuthenticated = computed(() => {
        return !isNull(accessToken.value)
    })

    function loadFromCache () {
        const cookie = useCookie('access')

        if (isNull(cookie.value)) {
            return 
        } else {
            accessToken.value = cookie.value
        }
    }

    function logout() {
        accessToken.value = null
        refreshToken.value = null
    }

    function setTokens (data: LoginAPIResponse) {
        accessToken.value = data.access
        refreshToken.value = data.refresh
    }

    return {
        logout,
        loadFromCache,
        setTokens,
        isAuthenticated,
        showLoginDrawer,
        profile,
        accessToken,
        refreshToken
    }
})
