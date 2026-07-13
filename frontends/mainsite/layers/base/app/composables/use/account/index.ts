// import { promiseTimeout } from '@vueuse/core'
import type { UserProfile } from '~/types'

/**
 * Fetches the user profile and updates the Stripe ID in the global state.
 */
export async function useUserProfile() {
  const { getUserId } = useUser()
  const userId = await getUserId()

  const profile = computedAsync(async () => await $fetch<UserProfile>(`/api/account/${userId.id}`, { method: 'GET' }))
  useState<string>('stripeId').value = profile.value.data.userProfile.stripeId
  return profile
}
