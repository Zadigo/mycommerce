import { AxiosError } from "axios";
import { useAxiosClient } from '@/composables/utils'
import type { CartUpdateAPIResponse, LoginAPIResponse, Product, UserSelection } from "~/types";

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
                    callback.call(vueApp, response.data)
                }
            } else {
                console.log(response.data)
            }
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                if (e.status === 401) {
                    // If the user tries to add a product in his basket
                    // but in between the access token has expired,
                    // just refresh it as opposed to forcing a login
                    const { createClient } = useAxiosClient()
                    const authClient = createClient('/auth/v1/')
                    const refreshToken = useCookie('refresh')
                    const response = await authClient.post('token/refresh/', {
                        refresh: refreshToken.value
                    })

                    if (authCallback && typeof authCallback === 'function') {
                        authCallback.call(vueApp, response.data)
                    }
                }
            }
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
                    callback.call(vueApp, response.data)
                }
            }
        } catch (e) {
            if (e instanceof AxiosError && e.response) {
                if (e.status === 401) {
                    const { refresh } = useAuthencationComposable()
                    await refresh(authCallback)
                }
            }
        }
    }

    function handleSizeSelection(size: string | number | undefined) {
        userSelection.value.size = size || 'Unique'
    }

    return {
        parsedSession,
        userSelection,
        showSizeSelectionWarning,
        stockDetailsResponse,
        handleSizeSelection,
        deleteFromCart,
        addToCart
    }
}
