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
  const db = doc(fireStore, 'carts', cartSessionId.value)
  const cartSession = useDocument<CartSessionData>(db)

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
        await updateDoc(db, {
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

// export const useCartComposable = createGlobalState(() => {
//   const _cart = ref<Arrayable<CartItem>>([])
//   const lastProduct = computed(() => _cart.value[_cart.value.length - 1] || null)

//   const defaultReturn = {
//     cartSessionId: ref(''),
//     cartSession: null,
//     cart: _cart,
//     lastProduct,
//     createItem: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
//     removeProduct: async (_product: Undefineable<ProductNode>): Promise<void> => { },
//     reduceQuantity: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { }
//   }

//   if (import.meta.server) {
//     return defaultReturn
//   }

//   const cartSessionId = useCookie<string>(CARTSESSIONNAME, { default: () => '' })
  
//   // if (!isDefined(cartSessionId)) {
//   //   return defaultReturn
//   // }
  
//   const fireStore = useFirestore()
//   const db = doc(fireStore, 'carts', cartSessionId.value)
//   const cartSession = useDocument<CartSessionData>(db)

//   watchArray(_cart, async (newCart, _oldCart, _added, _removed) => {
//     console.log('For testing', _cart)

//     // Update Firestore document
//     try {
//       await updateDoc(db, { items: newCart })
//     } catch (error) {
//       console.error('Error updating cart document:', error)
//     }
//   })

//   watchDebounced(_cart, async () => {
//     // Calculate total for each item
//     _cart.value.forEach(item => { item.total = item.quantity * item.product.price })

//     // Calculate overall total and number of items
//     const total = _cart.value.reduce((sum, item) => sum + item.total, 0)
//     const numberOfItems = _cart.value.reduce((sum, item) => sum + item.quantity, 0)

//     // Update Firestore document
//     try {
//       await updateDoc(db, { total, numberOfItems })
//     } catch (error) {
//       console.error('Error updating cart document:', error)
//     }
//   }, {
//     debounce: 3000
//   })
  
//   const cart = computed(() => cartSession?.data?.value?.items || [])
  
//   function _hasSize(product: ProductNode, size: Undefineable<BaseSizeSet>) {
//     if (!isDefined(size)) return ref(false)
//     return useArrayIncludes(product.node.sizeSet, size, (a, b) => a.name === b.name)
//   }

//   function _hasProduct(product: ProductNode) {
//     return useArrayIncludes<CartItem, ProductNode>(_cart, product, (a, b) => a.product.id === b.node.id)
//   }

//   async function _createItem(product: ProductNode, size: Undefineable<BaseSizeSet>, callback?: (item: CartItem) => void) {
//     const hasSize = _hasSize(product, size)
    
//     if (hasSize.value) {
//       const item: CartItem = {
//         product: {
//           id: product.node.id,
//           name: product.node.name,
//           price: useToNumber(product.node.price).value,
//           salePrice: useToNumber(product.node.salePrice).value,
//           unitPrice: useToNumber(product.node.unitPrice).value,
//           mainImage: product.node.mainImage
//         },
//         size,
//         quantity: 1,
//         total: 0
//       }
      
//       const hasProduct = _hasProduct(product)

//       if (hasProduct.value) {
//         const selectedProduct = useArrayFind(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))

//         if (isDefined(selectedProduct)) {
//           selectedProduct.value.quantity += 1
//           selectedProduct.value.total = selectedProduct.value.quantity * selectedProduct.value.product.price
//         }
//       } else {
//         _cart.value.push(item)
//       }

//       if (isDefined(callback)) {
//         callback(item)
//       }
//     }
//   }

//   const createItem = useThrottleFn(_createItem, 500)

//   async function _reduceQuantity(product: ProductNode, size: BaseSizeSet) {
//     const selectedProduct = useArrayFind(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))
    
//     if (isDefined(selectedProduct)) {
//       selectedProduct.value.quantity -= 1
//       selectedProduct.value.total = selectedProduct.value.quantity * selectedProduct.value.product.price
//     }
//   }

//   const reduceQuantity = useThrottleFn(_reduceQuantity, 500)

//   async function _removeProduct(product: ProductNode) {

//   }

//   const removeProduct = useThrottleFn(_removeProduct, 500)
  
//   // async function _removeProduct(product: ProductNode, size: BaseSizeSet) {
//   //   const selectedProductIndex = useArrayFindIndex(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))
    
//   //   if (selectedProductIndex.value !== -1) {
//   //     console.log('Removing product from cart')
//   //     _cart.value.splice(selectedProductIndex.value, 1)
//   //   }
//   // }

//   return {
//     cartSessionId,
//     cartSession,
//     cart,
//     lastProduct,
//     createItem,
//     removeProduct,
//     reduceQuantity
//   }
// })
