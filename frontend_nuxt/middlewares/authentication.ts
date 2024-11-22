import { useAuthentication } from "~/stores/useAuthentication"

export default defineNuxtRouteMiddleware((to, _from) => {
    const store = useAuthentication()

    console.log(to, store)
    if (!store.isAuthenticated) {
        navigateTo({
            path: '/',
            query: {
                login: 0
            }
        })
    }
})
