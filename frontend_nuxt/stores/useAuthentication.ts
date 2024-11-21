import { defineStore } from 'pinia'

// export default defineStore('authentication', {
//     state: () => ({
        
//     })
// })

export const useAuthentication = defineStore('authentication', () => {
    const token = ref('')
    const isAuthenticated = ref(false)

    return {
        token,
        isAuthenticated
    }
})
