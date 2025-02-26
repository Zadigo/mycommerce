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
    // const client = axios.create({
    //     baseURL: 'https://api-adresse.data.gouv.fr',

    //     responseType: 'json'
    // })
    
    // const response = await client.get<Address>('/search', {
    //     params: {
    //         q: query.search,
    //         limit: 15,
    //         complete: 0
    //     }
    // })

    return response.data
}, {
    maxAge: 1,
    base: 'fs'
})
