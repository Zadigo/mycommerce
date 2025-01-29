import type { NavigationGuard } from "vue-router";

export default defineNuxtRouteMiddleware((): ReturnType<NavigationGuard> => {
    const cartStore = useCart()

    if (!cartStore.hasProducts) {
        // return navigateTo('/')
        return true
    } else {
        return true
    }
})
