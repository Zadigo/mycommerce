import type { NavigationGuard } from 'vue-router'

/**
 * TODO: Activate when design process is complete
 */
export default defineNuxtRouteMiddleware((to): ReturnType<NavigationGuard> => {
    if (import.meta.server) return

    const { isAuthenticated } = useUser()

    console.log('Global auth middleware', isAuthenticated.value, to.path)

    // Redirect the user to the login page if they are not authenticated
    // and trying to access a protected route such as account or cart

    // if (to.path.includes('/account') || to.path.includes('/cart')) {
    //     if (!isAuthenticated.value) {
    //         return navigateTo('/?login=1')
    //     }
    // }

    return true
})
