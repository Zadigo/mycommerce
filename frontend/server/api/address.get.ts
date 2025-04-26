import type { Address } from '~/types'

/**
 * Endpoint used to check addresses in France
 * see: https://adresse.data.gouv.fr/outils/api-doc/adresse 
 */
export default defineCachedEventHandler(async event => {
  if (import.meta.server) {
    return
  }

  const query = getQuery(event)
  const response = await $fetch<Address>('https://api-adresse.data.gouv.fr', {
    method: 'GET',
    headers: [
      ['Content-Type', 'application/json']
    ],
    params: { q: query.address }
  })

  return response
}, {
  base: 'redis',
  maxAge: 20 * 15,
  getKey() {
    return `address`
  }
})
