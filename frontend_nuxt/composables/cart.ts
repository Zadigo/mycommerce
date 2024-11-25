import { useSessionStorage } from "@vueuse/core";
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
    const userSelection = ref<UserSelection>({
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
            const sessionId = useSessionStorage('session_id', userSelection.value.session_id)

            // By changing this, it updates in the underlying
            // proxy in the ref since data is that proxy
            userSelection.value.session_id = sessionId.value || null
            userSelection.value.product = product

            if (size) {
                userSelection.value.size = size
            }

            if (product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null)) {
                showSizeSelectionWarning.value = true
                return
            }

            const response = await $client.post('/cart/add', userSelection.value)

            if (response.status === 201) {
                cartStore.updateCart(response.data)
                
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
        userSelection,
        showSizeSelectionWarning,
        stockDetailsResponse,
        deleteFromCart,
        addToCart
    }
}
