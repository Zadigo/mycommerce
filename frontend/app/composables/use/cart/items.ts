import { doc, updateDoc } from 'firebase/firestore'
import { CARTSESSIONNAME } from '~/composables/use'
import type { Arrayable, BaseSizeSet, CartItem, CartSessionData, ProductNode, Undefineable } from '~/types'

/**
 * Composable for managing the shopping cart.
 * This composable provides methods to add, remove,
 * and manage items in the cart, as well as syncing
 * the cart state with Firestore.
 * @param sizeSelected - Optional ref to track if size is selected
 * @return Cart management methods and state
 */
export const useCartComposable = createGlobalState((sizeSelected?: Ref<boolean>) => {
  const _cart = ref<Arrayable<CartItem>>([])
  const lastProduct = computed(() => _cart.value[_cart.value.length - 1] || null)
  const isInitialized = ref(false)
  const isSyncing = ref(false)
  const syncError = ref<string | null>(null)
  const freeDeliveryTarget = reactify((total: number = 0, threshold: number = 50.00) => {
    return total >= threshold ? 0 : threshold - total
  })
  
  const defaultReturn = {
    docRef: null,
    cartSessionId: ref(''),
    cartSession: null,
    cart: computed(() => [] as CartItem[]),
    lastProduct: computed(() => null as CartItem | null),
    isInitialized,
    isSyncing,
    syncError,
    freeDeliveryTarget,
    createItem: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
    removeProduct: async (_cartItem: CartItem): Promise<void> => { },
    reduceQuantity: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
    clearCart: async (): Promise<void> => { }
  }

  if (import.meta.server) {
    return defaultReturn
  }

  const cartSessionId = useCookie<string>(CARTSESSIONNAME, { default: () => '' })

  if (!cartSessionId.value) {
    console.warn('No cart session ID found')
    return defaultReturn
  }

  const fireStore = useFirestore()
  const docRef = doc(fireStore, 'carts', cartSessionId.value)
  const cartSession = useDocument<CartSessionData>(docRef)

  // Initialize cart from Firestore on load
  watch(() => cartSession?.data?.value, (sessionData) => {
    if (!isInitialized.value && sessionData?.items) {
      _cart.value = sessionData.items
      isInitialized.value = true
    }
  },
  { 
    immediate: true
  })

  // Single watcher for all cart updates - calculates totals and syncs to Firestore
  watchDebounced(
    _cart,
    async (newCart) => {
      if (!isInitialized.value) return // Don't sync during initialization

      // Calculate totals for each item
      const items = newCart.map(item => ({
        ...item,
        total: item.quantity * item.product.price
      }))

      // Calculate overall totals
      const total = items.reduce((sum, item) => sum + item.total, 0)
      const numberOfItems = items.reduce((sum, item) => sum + item.quantity, 0)

      // Sync to Firestore
      isSyncing.value = true
      syncError.value = null

      try {
        await updateDoc(docRef, {
          items,
          total,
          numberOfItems,
          updatedAt: new Date().toISOString()
        })
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update cart'

        syncError.value = errorMessage
        console.error('Error updating cart document:', error)

        // Optionally: Show user notification
        // useNotification().error('Failed to update cart. Please try again.')
      } finally {
        isSyncing.value = false
      }
    },
    {
      debounce: 1000,
      deep: true
    }
  )

  // Computed cart with proper typing
  const cart = computed(() => _cart.value)

  // Helper: Check if product has the specified size
  function _hasSize(product: ProductNode, size: Undefineable<BaseSizeSet>): boolean {
    if (!isDefined(size)) return false
    return product.node.sizeSet.some(s => s.name === size.name)
  }

  // Helper: Find existing cart item
  function _findCartItem(product: ProductNode, size: Undefineable<BaseSizeSet>) {
    if (!isDefined(size)) return null

    return _cart.value.find(
      item => item.product.id === product.node.id && item.size?.name === size.name
    )
  }

  // Create or increment cart item
  async function _createItem(product: Undefineable<ProductNode>, size: Undefineable<BaseSizeSet>, successCallback?: (items: Ref<Arrayable<CartItem>>) => void, errorCallback?: (message: string) => void): Promise<void> {
    if (!isDefined(product) || !isDefined(size)) {
      console.warn('Product or size is undefined')
      if (isDefined(errorCallback)) {
        errorCallback('Product or size is undefined')
      }
      return
    }

    if (!_hasSize(product, size)) {
      console.warn('Product does not have the specified size')
      if (isDefined(errorCallback)) {
        errorCallback('Product does not have the specified size')
      }
      return
    }

    // If a ref is passed to track size selection state
    // then we check to see if size is selected in order
    // to prevent adding to cart without size selection
    if (isDefined(sizeSelected)) {
      if (!sizeSelected.value) {
        console.warn('Size not selected, cannot add to cart')
        if (isDefined(errorCallback)) {
          errorCallback('Please select a size before adding to cart')
        }
        return
      }
    }

    const existingItem = _findCartItem(product, size)

    if (existingItem) {
      // Increment quantity
      existingItem.quantity += 1
    } else {
      // Create new cart item
      const newItem: CartItem = {
        product: {
          id: product.node.id,
          name: product.node.name,
          price: useToNumber(product.node.price).value,
          salePrice: useToNumber(product.node.salePrice).value,
          unitPrice: useToNumber(product.node.unitPrice).value,
          mainImage: product.node.mainImage
        },
        size,
        quantity: 1,
        total: 0 // Will be calculated in watcher
      }

      _cart.value.push(newItem)
    }

    if (isDefined(successCallback)) {
      successCallback(_cart)
    }
  }

  const createItem = useThrottleFn(_createItem, 300)

  // Reduce item quantity
  async function _reduceQuantity(product: Undefineable<ProductNode>, size: Undefineable<BaseSizeSet>): Promise<void> {
    if (!isDefined(product) || !isDefined(size)) {
      console.warn('Product or size is undefined')
      return
    }

    const existingItem = _findCartItem(product, size)

    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity -= 1
      } else {
        // Remove item if quantity would be 0
        await removeProduct(existingItem)
      }
    }
  }

  const reduceQuantity = useThrottleFn(_reduceQuantity, 300)

  // Remove product from cart
  async function _removeProduct(cartItem: CartItem): Promise<void> {
    if (!isDefined(cartItem)) {
      console.warn('Product or size is undefined')
      return
    }

    const filteredItems = _cart.value.filter(item => {
      const logic = (
        item.product.id === cartItem.product.id &&
        item.size.name === cartItem.size.name
      )
      
      console.log(`${item.product.id} vs. ${cartItem.product.id}`, `${item.size.name} vs. ${cartItem.size.name}`, logic)

      if (logic) return false
      return true
    })
    _cart.value = filteredItems
    console.log('Filtered Items:', filteredItems)
  }

  const removeProduct = useThrottleFn(_removeProduct, 300)

  // Clear entire cart
  async function _clearCart(): Promise<void> {
    _cart.value = []
  }

  const clearCart = useThrottleFn(_clearCart, 300)

  return {
    /**
     * Reference to the Firestore cart document
     */
    docRef,
    /**
     * Current cart session ID (from cookie and Firestore)
     * @default ''
     */
    cartSessionId,
    /**
     * Current cart session data from Firestore (a cart session can
     * be defined as the actions and state of a user's cart stored in Firestore
     * during their shopping session)
     * @default null
     */
    cartSession,
    /**
     * Current cart items
     * @default []
     */
    cart,
    /**
     * Last added product in the cart
     * @default null
     */
    lastProduct,
    /**
     * Whether the cart has been initialized from Firestore
     * @default false
     */
    isInitialized,
    /**
     * Whether the cart is currently syncing with Firestore
     * @default false
     */
    isSyncing,
    /**
     * Error message from the last sync attempt, if any
     * @default null
     */
    syncError,
    /**
     * Calculates the remaining amount needed to reach free delivery threshold
     * @param total - Current cart total
     * @param threshold - Free delivery threshold
     * @return Amount remaining to reach free delivery
     */
    freeDeliveryTarget,
    /**
     * Adds a product to the cart or increments its quantity
     * @param product - The product to add
     * @param size - The size of the product
     */
    createItem,
    /**
     * Removes a product entirely from the cart
     * @param product - The product to remove
     * @param size - The size of the product
     */
    removeProduct,
    /**
     * Reduces the quantity of a product in the cart by one
     * @param product - The product to reduce quantity for
     * @param size - The size of the product
     */
    reduceQuantity,
    /**
     * Clears all items from the cart
     */
    clearCart
  }
})
