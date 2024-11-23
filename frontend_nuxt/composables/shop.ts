import type { Product } from "~/types"

export function useShopComposable () {
    const shopStore = useShop()
    const isLiked = ref<boolean>(false)

    /**
     * Main entry function for managing the user liked
     * products either locally or in the backend.
     * Handles the action of liking a product
     * and therefore adding it to the user's
     * wishlist
     */
    async function handleLike(product: Product | undefined) {
        if (!isNull(product)) {
            isLiked.value = !isLiked.value
            shopStore.updateWishlist(product)
        }
    }

    return {
        handleLike
    }
}
