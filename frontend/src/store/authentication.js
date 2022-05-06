import { defineStore } from "pinia";

const useAuthentication = defineStore('authentication', {
    state: () => ({
        user: {'email': 'eifnzoe'},
        token: 'null',

        loginModal: false
    }),
    actions: {
        logout() {
            this.user = {}
            this.token = null
            this.router.push({ name: 'shop_view', params: { lang: 'fr' } })
        }
    },
    getters: {
        isAuthenticated() {
            return this.token != null
        }
    }
})

export {
    useAuthentication
}
