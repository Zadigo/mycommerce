import { useAxiosClient } from '~/composables/client'

export default defineNuxtPlugin(nuxtApp => {
    const { client } = useAxiosClient()
    
    return {
        provide: {
            client
        }
    }
})
