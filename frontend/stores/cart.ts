import { defineStore } from 'pinia'
import type { CartItem, CartUpdateApiResponse, Product, SessionCacheData, UserSelection } from '~/types'

interface RequestData {
    session_id: string | null | undefined
    card_token: string | null
    firstname: string | null
    lastname: string | null
    email: string | null
    telephone: string | null
    address_line: string | null
    zip_code: string | null
    country: string | null
    city: string | null
    delivery: 'Chronopost'
}

type FunctionCallback = (data: CartUpdateApiResponse) => void

export const useCart = defineStore('cart', () => {
    // const { handleError } = useErrorHandler()

    // NOTE: This is overriden the plugins.pini_plugin.ts
    // This is explicitly referenced here because there
    // computed properties that depend on this. Maybe we
    // should consider building them in the plugin directly
    // in order to create logical dependency
    const sessionCache = ref<SessionCacheData>()

    const requestData = ref<RequestData>({
        session_id: null,
        card_token: null,
        firstname: null,
        lastname: null,
        email: null,
        telephone: null,
        address_line: null,
        zip_code: null,
        country: null,
        city: null,
        delivery: "Chronopost"
    })

    const cache = ref<CartUpdateApiResponse | null>()

    const showAddedProductDrawer = ref(false)
    const showEditProductDrawer = ref(false)
    const showCartDrawer = ref(false)

    /**
     * Container used to save the user selections
     * when trying to add a product to the cart 
     */
    const userSelection = ref<UserSelection>({
        id: null,
        size: null,
        quantity: 1,
        product: {},
        session_id: null
    })

    const showSizeSelectionWarning = ref<boolean>(false)
    const addingToCartState = ref<boolean>(false)

    const parsedSession = computed((): { a: string, b: string, c: string } | null => {
        if (sessionId.value) {
            const tokens = sessionId.value.split('-')
            return { a: tokens[0], b: tokens[1], c: tokens[2] }
        } else {
            return null
        }
    })

    const sessionId = computed(() => {
        if (sessionCache.value) {
            return sessionCache.value.cart?.session_id
        } else {
            return null
        }
    })

    const products = computed(() => {
        if (sessionCache.value) {
            if (sessionCache.value.cart) {
                return sessionCache.value.cart.results
            }
        }
        return []
    })

    const hasProducts = computed((): boolean => {
        return products.value.length > 0;
    })

    /**
     * Counts the number of products in the cart
     * which can be the quantity of items stored
     * under each product
     */
    const numberOfProducts = computed((): number => {
        if (hasProducts.value) {
            if (sessionCache.value && sessionCache.value.cart) {
                return sessionCache.value.cart.statistics.map(x => x.quantity).reduce((a, b) => a + b, 0)
            }
        }
        return 0
    })

    /**
     * The last product that was added to
     * the user's cart. This is mainly for
     * the dialog that shows the last product
     * that was added to the cart
     */
    const lastAddedProduct = computed((): CartItem | null => {
        if (products.value.length > 0) {
            // return products.value[products.value.length - 1]
            return products.value[0]
        } else {
            return null
        }
    })

    /**
     * Calculate the cart total dynamically which is
     * the amount of similar products that were added
     * to the cart multiplied by their respective prices
     */
    const cartTotal = computed((): number => {
        if (hasProducts.value) {
            if (sessionCache.value && sessionCache.value.cart) {
                return sessionCache.value.cart.statistics.map(x => x.total).reduce((a, b) => a + b, 0)
            }
        }
        return 0
    })

    /**
     * Target that the customer must
     * attain in order to get free
     * delivery on his cart total
     */
    const freeDeliveryTarget = computed((): number => {
        const difference = 50 - cartTotal.value
        return difference < 0 ? 0 : difference;
    })

    /**
     * Removes a product entirely from the cart
     * regardless of quantity
     */
    function removeFromCart(product: Product) {
        const index = products.value.findIndex(x => x.id === product.id)
        products.value.splice(index, 1)
    }

    /**
     * 
     */
    function handleSizeSelection(product: Product, size: string | number | undefined) {
        console.info('handleSizeSelection', product)
        userSelection.value.product = product
        userSelection.value.size = size || 'Unique'
    }

    /**
     * 
     */
    function resetSelection() {
        userSelection.value.size = null
        userSelection.value.product = {}
        console.log('resetSelection')
    }

    /**
     * Adds a product to the customer's cart when the
     * the product size or other caracteristics are
     * available in a list (e.g. ProductsPage, CollectionsPage...) 
     */
    async function addToCart(product: Product, size?: string | number | null, callback?: FunctionCallback) {
        try {
            addingToCartState.value = true

            // By changing this, it updates in the underlying
            // proxy in the ref since data is that proxy
            userSelection.value.session_id = sessionId.value || null
            userSelection.value.product = product

            if (size) {
                userSelection.value.size = size
            }

            if (product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null)) {
                showSizeSelectionWarning.value = true
                addingToCartState.value = false
                return
            }

            // const { $client, vueApp } = useNuxtApp()
            // const response = await $client.post('/api/v1/cart/add', userSelection.value)

            // addingToCartState.value = false

            // if (response.status === 201) {
            //     if (callback && typeof callback === 'function') {
            //         callback.call(vueApp, response.data)
            //     }
            // } else {
            //     console.log(response.data)
            // }
            resetSelection()
        } catch (e) {
            // handleError(e)
            console.log(e)
        }
    }

    return {
        removeFromCart,
        addToCart,
        handleSizeSelection,
        showSizeSelectionWarning,
        userSelection,
        addingToCartState,
        parsedSession,
        sessionCache,
        cartTotal,
        freeDeliveryTarget,
        hasProducts,
        numberOfProducts,
        lastAddedProduct,
        sessionId,
        cache,
        products,
        showAddedProductDrawer,
        showEditProductDrawer,
        showCartDrawer,
        requestData
    }
})
