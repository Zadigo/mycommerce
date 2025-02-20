import type { NavigationGuard } from "vue-router"
import { useCart } from "~/stores/cart"

export default defineNuxtRouteMiddleware((_to, _from): ReturnType<NavigationGuard> => {
    const store = useCart()

    if (store.products.length === 0) {
        return true
    } else {
        return true
    }
})
