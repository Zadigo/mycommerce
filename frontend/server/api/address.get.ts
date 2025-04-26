import axios from 'axios'
import { Address } from '~/types'

/**
 * Endpoint used to check addresses in France
 * see: https://adresse.data.gouv.fr/outils/api-doc/adresse 
 */
export default defineCachedEventHandler(async event => {
    if (import.meta.server) return

    const query = getQuery(event)
    const response = await axios<Address>({
        method: 'get',
        baseURL: 'https://api-adresse.data.gouv.fr',
        params: { q: query.address }
    })
    
    return response.data
}, {
    base: 'redis',
    maxAge: 3600
})
