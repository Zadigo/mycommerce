import { defineStore } from 'pinia'
import type { Product, SessionCacheData } from "~/types";

export const useShop =  defineStore('shop', () => {
    const sessionCache = ref<SessionCacheData>()

    const showSearchModal = ref(false)
    const showLanguageModal = ref(false)

    const visitedProducts = ref<number[]>([])
    const likedProducts = ref<number[]>([])
    
    // This references the index of the product that
    // was clicked within a given list of items. This
    // is for Google Analytics
    const currentProductIndex = ref<number>(0)

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

    function closeAllModals() {
        showSearchModal.value = false
        showLanguageModal.value = false
    }

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

    return {
        sessionCache,
        closeAllModals,
        currentProductIndex,
        addToHistory,
        showSearchModal,
        numberOfVisitedProducts,
        uniqueVisitedProductIds,
        visitedProducts,
        likedProducts,
        showLanguageModal
    }
})
