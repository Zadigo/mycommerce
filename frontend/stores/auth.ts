import { defineStore } from 'pinia'
import { useJwt } from '@vueuse/integrations/useJwt'
import type { StringNull } from '~/types'
import type { LoginApiResponse } from '~/composables/django_client'

export const useAuthentication = defineStore('authentication', () => {
    // Modals
    const showLoginDrawer = ref(false)

    const accessToken = ref<StringNull>('')
    const refreshToken = ref<StringNull>('')
    
    const isAuthenticated = computed(() => {
        return !isNull(accessToken.value)
    })

    const userId = computed(() => {
        if (accessToken.value) {
            const { user_id } = useJwt(accessToken.value).payload.value
            return user_id
        } else {
            return null
        }
    })

    function logout() {
        accessToken.value = null
        refreshToken.value = null
    }

    function setTokens (data: LoginApiResponse) {
        accessToken.value = data.access
        refreshToken.value = data.refresh
    }

    return {
        logout,
        setTokens,
        userId,
        isAuthenticated,
        showLoginDrawer,
        accessToken,
        refreshToken
    }
})
