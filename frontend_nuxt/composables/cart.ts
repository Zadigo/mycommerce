import { useStorage } from "@vueuse/core";
import { AxiosError } from "axios";
import type { CartUpdateAPIResponse, Product, UserSelection } from "~/types";

/**
 * The cart composable is a function that allows
 * the implementation of cart functionnalities all
 * around the application. It allows also to work
 * with both axios and pinia at the same time when
 * working with adding or removing items from the cart
 * using proxy functions
 */
export function useCartComposable () {
    const { $client, vueApp } = useNuxtApp()
    const userselection = ref<UserSelection>({
        id: null,
        size: null,
        quantity: 1,
        product: {},
        session_id: null
    })
    const showSizeSelectionWarning = ref<boolean>(false)
    const stockDetailsResponse = ref({})
    const cartStore = useCart()

    /**
     * Adds a product to the customer's cart when the
     * the product size or other caracteristics are
     * available in a list (e.g. ProductsPage, CollectionsPage...) 
     */
    async function addToCart (product: Product, size?: string | number | null, callback?: (data: CartUpdateAPIResponse) => void) {
        try {
            const sessionId = null

            // By changing this, it updates in the underlying
            // proxy in the ref since data is that proxy
            userselection.value.session_id = sessionId || null
            userselection.value.size = size || 'Unique'
            userselection.value.product = product

            if (product.has_sizes && (userselection.value.size === 'Unique' || userselection.value.size === null)) {
                showSizeSelectionWarning.value = true
                return
            }

            const response = await $client.post('/', userselection.value)

            if (response.status === 200) {
                cartStore.updateCart(response.data)
                useStorage('cart', response.data, localStorage)

                if (callback && typeof callback === 'function') {
                    callback.call(vueApp, response.data)
                }
            } else {
                console.log(response.data)
            }
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                // Handle error
            }
        }
    }

    /**
     * Removes a product to the customer's cart 
     */
    async function deleteFromCart(product: Product) {
        try {
            cartStore.removeFromCart(product)
        } catch (e) {
            console.error(e)
        }
    }

    return {
        userselection,
        showSizeSelectionWarning,
        stockDetailsResponse,
        deleteFromCart,
        addToCart
    }
}
