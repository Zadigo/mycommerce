import type { NavigationGuard } from "vue-router";

export default defineNuxtRouteMiddleware((): ReturnType<NavigationGuard> => {
    const cartStore = useCart()

    if (!cartStore.hasProducts) {
        return navigateTo('/')
    } else {
        return true
    }
})
