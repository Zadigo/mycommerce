import type { Product } from "~/types";

export const useShop =  defineStore('shop', () => {
    const showLanguageModal = ref(false)
    const visitedProducts = ref<number[]>([])
    const likedProducts = ref<number[]>([])

    /**
     * Returns the number of products that
     * were visited by the user for the
     * actual given session
     */
    const numberOfVisitedProducts = computed((): number => {
        return visitedProducts.value.length;
    })

    /**
     * Returns the unique IDs of each products that
     * were visited by the user during his session
     */
    const uniqueVisitedProductIds = computed((): number[] => {
        return Array.from(new Set(visitedProducts.value))
    })

    /**
     * Adds the product to the list of
     * products that were historically
     * visited by the user in the store
     */
    function addToHistory(product: Product) {
        if (product) {
            visitedProducts.value.push(product.id);
        }
    }

    function updateWishlist (product: Product | undefined) {
        if (product) {
            const { save } = useListManager()
            save(likedProducts, product.id)
        }
    }

    function loadFromCache() {
        likedProducts.value = this.$localstorage.retrieve("likedProducts") || [];
        visitedProducts.value = this.$localstorage.retrieve("visitedProducts") || [];
    }
    
    return {
        addToHistory,
        updateWishlist,
        loadFromCache,
        numberOfVisitedProducts,
        uniqueVisitedProductIds,
        visitedProducts,
        likedProducts,
        showLanguageModal
    }
})
