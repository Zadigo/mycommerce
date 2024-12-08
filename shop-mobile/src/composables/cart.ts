import { useCart } from "@/stores/cart";
import { useCookies } from "@vueuse/integrations/useCookies";
import { computed, getCurrentInstance, ref } from "vue";
import type { CartUpdateAPIResponse, LoginAPIResponse, Product, UserSelection } from "@/types";

type FunctionCallback = (data: CartUpdateAPIResponse) => void

/**
 * The cart composable is a function that allows
 * the implementation of cart functionnalities all
 * around the application. It allows also to work
 * with both axios and pinia at the same time when
 * working with adding or removing items from the cart
 * using proxy functions
 */
export function useCartComposable() {
    const app = getCurrentInstance()
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
    const cookie = useCookies(['authentication'])

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
                return
            } else {
                userSelection.value.size = 'Unique'
            }

            const response = await $client.post('/cart/add', userSelection.value)

            if (response.status === 201) {
                cartStore.updateCart(response.data)

                if (callback && typeof callback === 'function') {
                    callback.call(app, response.data)
                }
            } else {
                console.log(response.data)
            }
        } catch (e) {
            console.log(e)
        }
    }

    /**
     * Removes a product to the customer's cart 
     */
    async function deleteFromCart(callback?: FunctionCallback, authCallback?: (data: LoginAPIResponse) => void) {
        try {
            if (parsedSession.value) {
                const response = await $client.delete<CartUpdateAPIResponse>(`cart/${parsedSession.value.c}/delete`)

                // cartStore.removeFromCart(product)
                if (callback && typeof callback === 'function') {
                    callback.call(app, response.data)
                }
            }
        } catch (e) {
            console.log(e)
        }
    }

    function handleSizeSelection(size: string | number | undefined) {
        userSelection.value.size = size || 'Unique'
    }

    return {
        // parsedSession,
        userSelection,
        showSizeSelectionWarning,
        stockDetailsResponse,
        handleSizeSelection,
        deleteFromCart,
        addToCart
    }
}
