import type { NavigationGuard } from "vue-router"
import { useAuthentication } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to, _from): ReturnType<NavigationGuard> => {
    const store = useAuthentication()
    // TODO: Implement authentication checks
    if (to.path.includes('/account/') || to.path.includes('/cart/')) {
        if (store.isAuthenticated) {
            return true
        } else {
            return true
        }
    }

    return true
})
