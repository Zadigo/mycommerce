import { AxiosError } from "axios";
import type { CartUpdateAPIResponse, LoginAPIResponse, Product, ProductToEdit, UserSelection } from "~/types";

type FunctionCallback = (data: CartUpdateAPIResponse) => void

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
    const { handleError } = useErrorHandler()
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
    
    const addingToCartState = ref(false)

    const parsedSession = computed((): { a: string, b: string, c: string } | null => {
        if (cartStore.sessionId) {
            const tokens = cartStore.sessionId.split('-')
            return { a: tokens[0], b: tokens[1], c: tokens[2] }
        } else {
            return null
        }
    })
    
    /**
     * Adds a product to the customer's cart when the
     * the product size or other caracteristics are
     * available in a list (e.g. ProductsPage, CollectionsPage...) 
     */
    async function addToCart(product: Product, size?: string | number | null, callback?: FunctionCallback, authCallback?: (data: LoginAPIResponse) => void) {
        try {
            addingToCartState.value = true

            const cart = useCart()

            // By changing this, it updates in the underlying
            // proxy in the ref since data is that proxy
            userSelection.value.session_id = cart.sessionId || null
            userSelection.value.product = product

            if (size) {
                userSelection.value.size = size
            }

            if (product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null)) {
                showSizeSelectionWarning.value = true
                addingToCartState.value = false
                return
            } else {
                userSelection.value.size = 'Unique'
            }

            const response = await $client.post('/cart/add', userSelection.value)

            addingToCartState.value = false

            if (response.status === 201) {
                if (callback && typeof callback === 'function') {
                    callback.call(vueApp, response.data)
                }
            } else {
                console.log(response.data)
            }
        } catch (e) {
            handleError(e)

            if (e instanceof AxiosError && e.response) {
                if (authCallback) {
                    authCallback(e.response.data)
                }
            }
        }
    }

    /**
     * Removes a product to the customer's cart 
     */
    async function deleteFromCart(cartItem: ProductToEdit, callback?: (deletedItem: ProductToEdit, updatedCart: CartUpdateAPIResponse) => void, authCallback?: (data: LoginAPIResponse) => void) {
        console.log('deleteFromCart', cartItem)
        try {
            if (parsedSession.value) {
                // FIXME: How does this function know which product to delete ?
                const response = await $client.delete<CartUpdateAPIResponse>(`cart/${parsedSession.value.c}/delete`)
                
                // cartStore.removeFromCart(product)
                if (callback && typeof callback === 'function') {
                    callback.call(vueApp, cartItem, response.data)
                }
            }
        } catch (e) {
            handleError(e)

            if (e instanceof AxiosError && e.response) {
                if (authCallback) {
                    authCallback(e.response.data)
                }
            }
        }
    }

    function handleSizeSelection(size: string | number | undefined) {
        userSelection.value.size = size || 'Unique'
    }

    return {
        addingToCartState,
        parsedSession,
        userSelection,
        showSizeSelectionWarning,
        stockDetailsResponse,
        handleSizeSelection,
        deleteFromCart,
        addToCart
    }
}
