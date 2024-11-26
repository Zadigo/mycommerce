import type { NavigationGuard } from "vue-router"
import { useAuthentication } from "~/stores/useAuthentication"

export default defineNuxtRouteMiddleware((_to, _from): ReturnType<NavigationGuard> => {
    const store = useAuthentication()

    if (!store.isAuthenticated) {
        // return navigateTo({
        //     path: '/',
        //     query: {
        //         login: '0'
        //     }
        // })
    } else {
        return true
    }
})
