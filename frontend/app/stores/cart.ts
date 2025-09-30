import { useUserSession } from '#imports'
import { useJwt } from '@vueuse/integrations/useJwt'
import { defineStore } from 'pinia'

import type { CartUpdateApiResponse, JWTData, Product, ProductSizes, ProductToEdit, UserSelection } from '~/types'

type FunctionCallback = (data: CartUpdateApiResponse) => void

/**
 * Store used to manage the customer's cart
 */
export const useCart = defineStore('cart', () => {
  const cache = ref<CartUpdateApiResponse | null>()

  // Container used to save the user selections
  // when trying to add a product to the cart 
  const userSelection = ref<UserSelection>({
    id: null,
    size: 'Unique',
    quantity: 1,
    product: {},
    session_id: null
  })
  
  // Resets the user selection container
  // to its default values
  function resetSelection() {
    userSelection.value.size = 'Unique'
    userSelection.value.product = {}

    console.log('resetSelection')
  }

  /**
   * Add to cart
   */
  
  const addingToCartState = ref<boolean>(false)
  const showSizeSelectionWarning = ref<boolean>(false)
 
  const showAddedProductDrawer = ref<boolean>(false)

  async function addToCart(product: Product | null | undefined, callback?: FunctionCallback) {
    if (!product) {
      console.error('Product is empty')
      return
    }

    const { cookieSessionId } = useUserSession()
    
    addingToCartState.value = true
    // By changing this, it updates in the underlying
    // proxy in the ref since data is that proxy
    userSelection.value.session_id = cookieSessionId?.value || null
    userSelection.value.product = product

    console.log('product.has_sizes && (userSelection.value.size === Unique || userSelection.value.size === null)', product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null))
    console.log('product.has_sizes', product.has_sizes, userSelection.value.size)

    if (product.has_sizes && (userSelection.value.size === 'Unique' || userSelection.value.size === null)) {
      showSizeSelectionWarning.value = true
      addingToCartState.value = false
      return
    }
    
    const { vueApp } = useNuxtApp()

    const response = await $fetch<CartUpdateApiResponse>('/api/v1/cart/add', {
      method: 'POST',
      body: userSelection.value,
      baseURL: useRuntimeConfig().public.prodDomain,
      onResponse({ response }) {
        if (response.status === 201) {
          addingToCartState.value = false
          showAddedProductDrawer.value = true
          resetSelection()
        }
      }
    })

    cache.value = response
    
    if (callback && typeof callback === 'function') {
      callback.call(vueApp, response)
    }
  }

  async function sizeSelection(product: Product | null | undefined, size: ProductSizes, doAddToCart?: boolean) {
    if (product) {
      console.info('useCart.handleSizeSelection', product, size)

      userSelection.value.product = product
      userSelection.value.size = size.name || 'Unique'

      console.log('useCart.userSelection', userSelection.value)

      // Once the size selected, directly add the item
      // to the cart. This is useful when the user
      // selects a size from a products list page
      // where there is no "Add to Cart" button
      if (doAddToCart) {
        await addToCart(product)
      }
    }
  }

  /**
   * Remove
   */
  
  async function deleteFromCart(cartItem: ProductToEdit, callback?: (deletedItem: ProductToEdit, updatedCart: CartUpdateApiResponse) => void) {
    const { cookieSessionId } = useUserSession()

    if (cookieSessionId && cookieSessionId.value) {
      const { payload } = useJwt<JWTData>(cookieSessionId.value)
      const { $client } = useNuxtApp()

      if (payload.value) {
        const response = await $client<CartUpdateApiResponse>(
          `/api/v1/cart/${payload.value.cart_id}/delete`,
          {
            method: 'POST',
            body: {
              session_id: cookieSessionId.value,
              product_id: cartItem.product_info?.product.id,
              size: cartItem.product_info?.size
            }
          }
        )

        if (callback && typeof callback === 'function') {
          callback(cartItem, response)
        }
      }
    }
  }

  /**
   * State
   */

  const products = computed(() => isDefined(cache) ? cache.value.results : [])
  const hasProducts = computed(() => products.value.length > 0)

  const numberOfProducts = computed(() => {
    if (isDefined(cache)) {
      return cache.value.statistics.reduce((acc, item) => acc + item.quantity, 0)
    } else {
      return 0
    }
  })
  
  const lastAddedProduct = computed(() => products.value.at(-1))
  const cartTotal = computed(() => isDefined(cache) ? cache.value.total : 0)

  const freeDeliveryTarget = computed(() => (50 - cartTotal.value) < 0 ? 0 : (50 - cartTotal.value))

  const showEditProductDrawer = ref<boolean>(false)
  const showCartDrawer = ref<boolean>(false)

  return {
    /**
     * Adds a product to the customer's cart by calling the corresponding
     * Django endpoint. Requires the user to have selected a size (if required).
     * This function can be both used on a single product individual page or with
     * a list of products (e.g. ProductsPage, CollectionsPage...)
     * @param product The product to use
     * @param size The selected size for the given product
     * @param callback A callback function that accepts the Api's response data
     * 
     */
    addToCart,
    /**
     * Handles the action of selecting a size for a given product with a flag
     * that can be used to directly add the product to the cart once the size
     * has been selected
     * @param product The product to use
     * @param size The selected size for the given product
     * @param doAddToCart If true, directly adds the product to the cart once the size has been selected
     */
    sizeSelection,
    /**
     * Removes a product to the customer's cart 
     * @param cartItem The data of the product to edit
     * @param callback A callback function that accepts the data of the product to edit and the Api's response data
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
    cartTotal,
    /**
     * Target that the customer must
     * attain in order to get free
     * delivery on his cart total
     * @default 50
     */
    freeDeliveryTarget,
    hasProducts,
    numberOfProducts,
    lastAddedProduct,
    /**
     * Contains updated cart information
     */
    cache,
    products,
    showAddedProductDrawer,
    showEditProductDrawer,
    showCartDrawer
  }
})

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

/**
 * Store used to manage the shipping information
 * provided by the customer during checkout
 */
export const useShippingInfo = defineStore('shippingInfo', () => {
  const newShippingInfo = ref<RequestData>({
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
    delivery: 'Chronopost'
  })

  return {
    newShippingInfo
  }
})
