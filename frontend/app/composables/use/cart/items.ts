import { doc, updateDoc } from 'firebase/firestore'
import type { CartItem, CartUpdateApiResponse } from '~/types'

/**
 * Syncs the cart data received from Django
 *  with the Firestore
 * @deprecated Maybe use one source of truth either Django -> Pinia -> Nuxt or Firestore -> Nuxt
 */
export async function useSyncCart() {
  if (import.meta.server) {
    return {
      sync: async () => { }
    }
  }

  const storage = useSession()
  const docRef = doc(useFirestore(), 'sessions', storage.sessionId?.value)

  async function sync(response: CartUpdateApiResponse) {
    await updateDoc(docRef, { cart: response }, { merge: true })
  }

  return {
    sync
  }
}

/**
 * Provides information about the cart stored in the session cache
 * on Firebase
 */
export async function useCartInformation() {
  if (import.meta.server) {
    return {
      /**
       * Contains products added to the cart
       */
      products: ref([]),
      /**
       * Contains aggregated statistics about products in the cart
       * (e.g. quantity per product)
       */
      statistics: ref([]),
      /**
       * Indicates if there are products in the cart
       */
      hasProducts: ref(false),
      /**
       * Contains the last product added to the cart
       * or null if there are no products
       */
      lastAddedProduct: ref(null),
      /**
       * Contains the total number of products in the cart
       */
      numberOfProducts: ref(0),
      /**
       * Contains the total price of the cart
       * @default 0
       */
      cartTotal: ref(0),
      /**
       * Contains the free delivery target
       * @default 50
       */
      freeDeliveryTarget: ref(0),
      /**
       * Finds an item in the `cart.results` associated with
       * `cart.statistics` by product ID
       * @param productId Product ID to search for
       */
      associatedItem: (productId: number) => null,
      /**
     * Finds a value in an item in the `cart.results` associated with
     * `cart.statistics` by product ID
     * @param productId Product ID to search for
     * @param key Key of the value to return
     */
      associatedValue: (productId: number, key: keyof CartUpdateApiResponse['results'][0]) => null
    }
  }

  // console.log('sessionCache', sessionCache)

  // const cart = ref<CartUpdateApiResponse | null>(sessionCache.value?.cart)
  const cartStore = useCart()
  const { cache } = storeToRefs(cartStore)
  
  const products = computed(() => isDefined(cache) ? cache.value.results : [])
  const statistics = computed(() => isDefined(cache) ? cache.value.statistics : [])
  const hasProducts = computed(() => products.value.length > 0)

  const lastAddedProduct = computed(() => products.value.at(-1))
  const cartTotal = computed(() => isDefined(cache) ? cache.value.total : 0)

  const freeDeliveryTarget = computed(() => (50 - cartTotal.value) < 0 ? 0 : (50 - cartTotal.value))

  const numberOfProducts = computed(() => {
    if (isDefined(cache)) {
      return cache.value.statistics.reduce((acc, item) => acc += item.quantity, 0)
    } else {
      return 0
    }
  })

  function associatedItem(productId: number) {
    return useArrayFind(cache.value?.results || [], (item) => item.product.id === productId)
  }

  function associatedValue(productId: number, key: keyof CartItem) {
    const item = associatedItem(productId)
    return isDefined(item) ? item.value[key] : null
  }

  return {
    /**
     * Contains products added to the cart
     */
    products,
    /**
     * Contains aggregated statistics about products in the cart
     * (e.g. quantity per product)
     */
    statistics,
    /**
     * Indicates if there are products in the cart
     */
    hasProducts,
    /**
     * Contains the last product added to the cart
     * or null if there are no products
     */
    lastAddedProduct,
    /**
     * Contains the total number of products in the cart
     */
    numberOfProducts,
    /**
     * Contains the total price of the cart
     * @default 0
     */
    cartTotal,
    /**
     * Contains the free delivery target
     * @default 50
     */
    freeDeliveryTarget,
    /**
     * Finds an item in the `cart.results` associated with
     * `cart.statistics` by product ID
     * @param productId Product ID to search for
     */
    associatedItem,
    /**
     * Finds a value in an item in the `cart.results` associated with
     * `cart.statistics` by product ID
     * @param productId Product ID to search for
     * @param key Key of the value to return
     */
    associatedValue
  }
}
