import { defineStore } from 'pinia'
import type { CartItem, CartUpdateApiResponse, Product, SessionCacheData } from '~/types'

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

export const useCart = defineStore('cart', () => {
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
        products.value.splice(index, 1);
    }

    return {
        sessionCache,
        removeFromCart,
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
