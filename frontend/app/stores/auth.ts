import { useJwt } from '@vueuse/integrations/useJwt'
import { defineStore } from 'pinia'

import type { Profile, SessionCacheData, StringNull } from '~/types'

interface JWTResponseData {
  user_id: number
}

export const useAuthentication = defineStore('authentication', () => {
  const accessToken = ref<StringNull>('')
  const refreshToken = ref<StringNull>('')

  // TODELETE: Sync with firebase
  const profile = ref<Profile>()

  const isAuthenticated = computed(() =>!isNull(accessToken.value))

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

  return {
    /**
     * @deprecated
     */
    profile,
    userId,
    isAuthenticated,
    accessToken,
    refreshToken
  }
})
