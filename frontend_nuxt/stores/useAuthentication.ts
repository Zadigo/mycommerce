import { useUtilities } from '@/composables/utils'
import { defineStore } from 'pinia'
import type { UserProfile, StringNull } from '~/types'

export const useAuthentication = defineStore('authentication', () => {
    const { isNull } = useUtilities()
    
    const showLoginDrawer = ref(false)
    const profile = ref<UserProfile>()
    const token = ref<StringNull>('')
    const accessToken = ref<StringNull>('')
    const refreshToken = ref<StringNull>('')
    
    const isAuthenticated = computed(() => {
        return isNull(accessToken.value)
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
        token.value = null
    }

    return {
        logout,
        loadFromCache,
        isAuthenticated,
        showLoginDrawer,
        token,
        profile,
        accessToken,
        refreshToken
    }
})
