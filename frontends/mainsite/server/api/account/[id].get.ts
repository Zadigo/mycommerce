import { getRouterParam } from 'h3'
import { UserProfile } from '~/types/graphql/accounts'
import { createErrorTemplate } from '~/utils'

export default defineEventHandler<UserProfile>(async (event) => {
  try {
    const userId = getRouterParam(event, 'id')

    const data = await $fetch<UserProfile>('/graphql/', {
      baseURL: useRuntimeConfig().public.prodDomain,
      method: 'POST',
      body: {
        query: `
          query($id: Int!) {
            userProfile(id: $id) {
              id
              stripeId
            }
          }
        `,
        variables: {
          id: parseInt(userId || '0', 10)
        }
      }
    })

    return data
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
