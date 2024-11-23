import { isNull } from '@/utils'
import { defineStore } from 'pinia'
import type { CartItem, CartUpdateAPIResponse, Product } from '~/types'

// declare type RequestData = {
//     session_id: string | null;
//     firstname: string | null;
//     lastname: string | null;
//     email: string | null;
//     telephone: string | null;
//     address_line: string | null;
//     zip_code: string | null;
//     country: string | null;
//     city: string | null;
//     delivery: string | null;
//     card_token: string | null;
// };

// declare type RootState = {
//     requestData: RequestData;
//     cache: CartUpdateAPIResponse;
//     products: CartItem[];

//     showAddedProductDrawer: boolean;
//     showEditProductDrawer: boolean;
//     showCartDrawer: boolean;
// };

export const useCart = defineStore('cart', () => {
    const requestData  = ref({
        session_id: null,
        firstname: null,
        lastname: null,
        email: null,
        telephone: null,
        address_line: null,
        zip_code: null,
        country: null,
        city: null,
        delivery: "Chronopost",
        card_token: null,
    })

    const cache = ref<CartUpdateAPIResponse>()
    const products = ref<CartItem[]>([])

    const showAddedProductDrawer = ref(false)
    const showEditProductDrawer = ref(false)
    const showCartDrawer = ref(false)

    /**
     * Indicates if the cart has products
     */
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
            if (!isNull(cache)) {
                return cache.value.statistics.map(x => x.quantity).reduce((a, b) => a + b, 0)
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
            return products.value[products.value.length - 1]
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
            return cache.value.statistics.map(x => x.total).reduce((a, b) => a + b, 0)
        } else {
            return 0;
        }
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
     * Preload the cart from the session if we actually
     * have the data. This allows us then to dynamically
     * calculate the items that the user has selected
     */
    function loadFromCache() {
        // TODO:
        // products.value = this.$session.retrieve("cart") || [];
        // cache.value = this.$session.retrieve("cart_cache") || {};
    }

    /**
     * This is the main function that adds a product to
     * the user's cart in the store. When the product
     * does not exist, it is created otherwise, its quantity
     * is upgraded
     */
    function updateCart(data: CartUpdateAPIResponse) {
        cache.value = data;
        products.value = data.results;
    }

    /**
     * Removes a product entirely from the cart
     * regardless of quantity
     */
    function removeFromCart(product: Product) {
        const index = products.value.findIndex(x => x.id === product.id)
        products.value.splice(index, 1);
    }

    return {
        loadFromCache,
        updateCart,
        removeFromCart,
        cartTotal,
        freeDeliveryTarget,
        hasProducts,
        numberOfProducts,
        lastAddedProduct,
        cache,
        products,
        showAddedProductDrawer,
        showEditProductDrawer,
        showCartDrawer,
        requestData
    }
})
