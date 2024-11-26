import type { Product } from "~/types"

export function useShopComposable () {
    const { $i18n } = useNuxtApp()
    const shopStore = useShop()
    const isLiked = ref<boolean>(false)

    /**
     * A composable that implements default
     * resusable functions for the shop, such
     * as liking a product or adding it to
     * the user cart
     */
    function translatePrice(value: string | number | undefined) {
        if (value) {
            let price

            if (typeof value === 'string') {
                price = parseFloat(value)
            } else {
                price = value
            }
            
            return $i18n.n(price, 'currency')
        } else {
            return '0'
        }
    }

    /**
     * Main entry function for managing the user liked
     * products either locally or in the backend.
     * Handles the action of liking a product
     * and therefore adding it to the user's
     * wishlist
     */
    async function handleLike(product: Product | null | undefined) {
        if (product) {
            isLiked.value = !isLiked.value
            shopStore.updateWishlist(product)
        }
    }

    return {
        isLiked,
        translatePrice,
        handleLike
    }
}
