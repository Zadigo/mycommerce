import type { NavigationGuard } from "vue-router"
import { useAuthentication } from "~/stores/auth"

export default defineNuxtRouteMiddleware((to): ReturnType<NavigationGuard> => {
    if (import.meta.server) return

    const { isAuthenticated } = storeToRefs(useAuthentication())

    if (to.path.includes('/account/') || to.path.includes('/cart/')) {
        if (!isAuthenticated.value) {
            return navigateTo('/?login=1')
        }
    }

    return true
})
