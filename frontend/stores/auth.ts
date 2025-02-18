import { defineStore } from 'pinia'
import type { StringNull, Profile } from '~/types'
import type { LoginAPIResponse } from '~/composables/django_client'

export const useAuthentication = defineStore('authentication', () => {
    // Modals
    const showLoginDrawer = ref(false)

    const profile = ref<Profile | null | undefined>()
    const accessToken = ref<StringNull>('')
    const refreshToken = ref<StringNull>('')
    
    const isAuthenticated = computed(() => {
        return !isNull(accessToken.value)
    })

    function logout() {
        accessToken.value = null
        refreshToken.value = null
        profile.value = null
    }

    function setTokens (data: LoginAPIResponse) {
        accessToken.value = data.access
        refreshToken.value = data.refresh
    }

    return {
        logout,
        setTokens,
        isAuthenticated,
        showLoginDrawer,
        profile,
        accessToken,
        refreshToken
    }
})
