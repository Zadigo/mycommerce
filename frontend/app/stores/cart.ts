import { defineStore } from 'pinia'
import { useJwt } from '@vueuse/integrations/useJwt'

import type { CartUpdateApiResponse, Product, SessionCacheData, UserSelection, ProductToEdit, JWTData } from '~/types'
import type { DefaultClotheSize } from '~/data'

interface RequestData {
  session_id: string | null | undefined
  card_token: string
  firstname: string
  lastname: string
  email: string
  telephone: string
  address_line: string
  zip_code: string
  country: string
  city: string
  delivery: 'Chronopost'
}

type FunctionCallback = (data: CartUpdateApiResponse) => void

export const useCart = defineStore('cart', () => {
  const sessionCache = ref<SessionCacheData>()

  const requestData = ref<RequestData>({
    session_id: '',
    card_token: '',
    firstname: '',
    lastname: '',
    email: '',
    telephone: '',
    address_line: '',
    zip_code: '',
    country: '',
    city: '',
    delivery: "Chronopost"
  })

  const cache = ref<CartUpdateApiResponse | null>()

  const showAddedProductDrawer = ref<boolean>(false)
  const showEditProductDrawer = ref<boolean>(false)
  const showCartDrawer = ref<boolean>(false)

  /**
   * Container used to save the user selections
   * when trying to add a product to the cart 
   */
  const userSelection = ref<UserSelection>({
    id: null,
    size: 'Unique',
    quantity: 1,
    product: {},
    session_id: null
  })

  const showSizeSelectionWarning = ref<boolean>(false)
  const addingToCartState = ref<boolean>(false)

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

  const hasProducts = computed(() => products.value.length > 0)

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
  
  const { last: lastAddedProduct } = useRefHistory(products)

  /**
   * Calculate the cart total dynamically which is
   * the amount of similar products that were added
   * to the cart multiplied by their respective prices
   */
  const cartTotal = computed(() => {
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
  const freeDeliveryTarget = computed(() => {
    const difference = 50 - cartTotal.value
    return difference < 0 ? 0 : difference
  })

  /**
   * Removes a product entirely from the cart
   * regardless of quantity
   * 
   * @param product The product to remove from the cart
   */
  function removeFromCart(product: Product) {
    const index = products.value.findIndex(x => x.id === product.id)
    products.value.splice(index, 1)
  }

  /**
   * Proxy function used to associate a product
   * and the a size for the giving product selected by the user
   * 
   * @param product The product to use
   * @param size The size selected by the user
   */
  function handleSizeSelection(product: Product | null | undefined, size: DefaultClotheSize) {
    if (product) {
      // console.info('handleSizeSelection', product)
      userSelection.value.product = product
      userSelection.value.size = size || 'Unique'
    }
  }

  /**
   * 
   */
  function resetSelection() {
    userSelection.value.size = 'Unique'
    userSelection.value.product = {}
    // console.log('resetSelection')
  }

  /**
   * Adds a product to the customer's cart by calling the corresponding
   * Django endpoint. Requires the user to have selected a size (if required).
   * This function can be both used on a single product individual page or with
   * a list of products (e.g. ProductsPage, CollectionsPage...)
   * 
   * @param product The product to use
   * @param size The selected size for the given product
   * @param callback A callback function that accepts the Api's response data
   * 
   */
  async function addToCart(product: Product | null | undefined, size?: DefaultClotheSize | undefined, callback?: FunctionCallback) {
    if (!product) {
      // console.error('Product is empty')
      return
    }

    addingToCartState.value = true

    // By changing this, it updates in the underlying
    // proxy in the ref since data is that proxy
    userSelection.value.session_id = sessionId.value || null
    userSelection.value.product = product

    if (size) {
      userSelection.value.size = size
    }

    console.log('product.has_sizes && (userSelection.value.size === Unique || userSelection.value.size === null)', product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null))

    if (product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null)) {
      showSizeSelectionWarning.value = true
      addingToCartState.value = false
      return
    }
    
    const { vueApp } = useNuxtApp()

    const response = await $fetch<CartUpdateApiResponse>('/api/v1/cart/add', {
      method: 'POST',
      body: userSelection.value,
      onResponse({ response }) {
        if (response.status === 201) {
          addingToCartState.value = false
          showAddedProductDrawer.value = true
          resetSelection()
        }
      }
    })

    if (sessionCache.value) {
      sessionCache.value.cart = response
    }
    
    if (callback && typeof callback === 'function') {
      callback.call(vueApp, response)
    }
  }

  /**
   * Removes a product to the customer's cart 
   * 
   * @param cartItem The data of the product to edit
   * @param callback A callback function that accepts the data of the product to edit and the Api's resposne data
   */
  async function deleteFromCart(cartItem: ProductToEdit, callback?: (deletedItem: ProductToEdit, updatedCart: CartUpdateApiResponse) => void) {
    if (sessionId.value) {
      const { payload } = useJwt<JWTData>(sessionId.value)
      const { $client } = useNuxtApp()

      if (payload.value) {
        const response = await $client<CartUpdateApiResponse>(
          `/api/v1/cart/${payload.value.cart_id}/delete`, 
          {
            method: 'POST',
            body: {
              session_id: sessionId.value,
              product_id: cartItem.product_info?.product.id,
              size: cartItem.product_info?.size
            }
          }
        )

        // if (callback && typeof callback === 'function') {
        //   callback.call(cartItem, response)
        // }
      }
    }
  }

  return {
    /**
     * Removes a product from the cart
     * @param cartItem The data of the product to remove
     */
    removeFromCart,
    /**
     * Adds a product to the cart
     * @param product The product to add
     * @param size The selected size for the given product
     * @param callback A callback function that accepts the Api's response data
     */
    addToCart,
    /**
     * Handles the action of selecting a size for a given product
     * @param product The product to use
     * @param size The selected size for the given product
     */
    handleSizeSelection,
    /**
     * Handles the action of removing a product from the cart
     * @param cartItem The data of the product to remove
     */
    deleteFromCart,
    /**
     * Handles the action of showing the size selection warning
     * when the product requires a size to be selected other
     * than "Unique"
     */
    showSizeSelectionWarning,
    /**
     * Container used to save the user selections
     * when trying to add a product to the cart 
     */
    userSelection,
    addingToCartState,
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
