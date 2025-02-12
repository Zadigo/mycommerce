import type { Product, ProductImage } from "~/types"

export function useShopComposable () {
    const { $i18n } = useNuxtApp()
    const isLiked = ref(false)

    function validateProp<T extends Product | ProductImage>(item: T | object | null | undefined): item is T {
        if (!item || typeof item !== 'object') {
            return false
        } else {
            return (
                'id' in item &&
                typeof (item as T).id === 'number'
            )
        }
    }
    
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
    function handleLike(items: number[], product: Product | null | undefined): (boolean | number[])[] {
        if (product) {
            const { save, managedList } = useListManager()
            const state = save(items, product.id)
            return [state, managedList.value]
        } else {
            return []
        }
    }

    return {
        isLiked,
        validateProp,
        translatePrice,
        handleLike
    }
}
