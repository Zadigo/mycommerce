import { AddressSet } from '~/types'
import { createErrorTemplate } from '~/utils'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const access = getCookie(event, 'access')

    const response = await $fetch<AddressSet>('/api/v1/address-set/create', {
      method: 'POST',
      baseURL: useRuntimeConfig().public.prodDomain,
      headers: {
        Authorization: `Token ${access}`
      },
      body
    })

    return response
  } catch (error) {
    const template = createErrorTemplate(error)
    throw createError(template)
  }
})
