import { useUtilities } from '@/composables/utils'
import type { LoginAPIResponse, Profile, StringNull } from '@/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthentication = defineStore('authentication', () => {
  const { isNull } = useUtilities()

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

  function setTokens(data: LoginAPIResponse) {
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
