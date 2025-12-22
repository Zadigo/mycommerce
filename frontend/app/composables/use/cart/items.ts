import { doc, updateDoc } from 'firebase/firestore'
import { CARTSESSIONNAME } from '~/composables/use'
import type { Arrayable, BaseSizeSet, CartItem, CartSessionData, ProductNode, Undefineable } from '~/types'

export const useCartComposable = createGlobalState(() => {
  const _cart = ref<Arrayable<CartItem>>([])
  const lastProduct = computed(() => _cart.value[_cart.value.length - 1] || null)
  const isInitialized = ref(false)
  const isSyncing = ref(false)
  const syncError = ref<string | null>(null)

  const defaultReturn = {
    docRef: null,
    cartSessionId: ref(''),
    cartSession: null,
    cart: computed(() => [] as CartItem[]),
    lastProduct: computed(() => null as CartItem | null),
    isInitialized,
    isSyncing,
    syncError,
    createItem: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
    removeProduct: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
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
  async function _createItem(product: Undefineable<ProductNode>, size: Undefineable<BaseSizeSet>, callback?: (item: CartItem) => void): Promise<void> {
    if (!isDefined(product) || !isDefined(size)) {
      console.warn('Product or size is undefined')
      return
    }

    if (!_hasSize(product, size)) {
      console.warn('Product does not have the specified size')
      return
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

      if (isDefined(callback)) {
        callback(newItem)
      }
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
        await _removeProduct(product, size)
      }
    }
  }

  const reduceQuantity = useThrottleFn(_reduceQuantity, 300)

  // Remove product from cart
  async function _removeProduct(product: Undefineable<ProductNode>, size: Undefineable<BaseSizeSet>): Promise<void> {
    if (!isDefined(product) || !isDefined(size)) {
      console.warn('Product or size is undefined')
      return
    }

    const itemIndex = _cart.value.findIndex(
      item => item.product.id === product.node.id && item.size?.name === size.name
    )

    if (itemIndex !== -1) {
      _cart.value.splice(itemIndex, 1)
    }
  }

  const removeProduct = useThrottleFn(_removeProduct, 300)

  // Clear entire cart
  async function _clearCart(): Promise<void> {
    _cart.value = []
  }

  const clearCart = useThrottleFn(_clearCart, 300)

  return {
    docRef,
    cartSessionId,
    cartSession,
    cart,
    lastProduct,
    isInitialized,
    isSyncing,
    syncError,
    createItem,
    removeProduct,
    reduceQuantity,
    clearCart
  }
})
