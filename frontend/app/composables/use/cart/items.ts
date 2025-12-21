import { doc, updateDoc } from 'firebase/firestore'
import { CARTSESSIONNAME } from '~/composables/use'
import type { Arrayable, BaseSizeSet, CartItem, CartSessionData, ProductNode, Undefineable } from '~/types'

export const useCartComposable = createGlobalState(() => {
  const _cart = ref<Arrayable<CartItem>>([])
  const lastProduct = computed(() => _cart.value[_cart.value.length - 1] || null)

  const defaultReturn = {
    cartSessionId: ref(''),
    cartSession: null,
    cart: _cart,
    lastProduct,
    createItem: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
    removeProduct: async (_product: Undefineable<ProductNode>): Promise<void> => { },
    reduceQuantity: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { }
  }

  if (import.meta.server) {
    return defaultReturn
  }

  const cartSessionId = useCookie<string>(CARTSESSIONNAME, { default: () => '' })
  
  // if (!isDefined(cartSessionId)) {
  //   return defaultReturn
  // }
  
  const fireStore = useFirestore()
  const db = doc(fireStore, 'carts', cartSessionId.value)
  const cartSession = useDocument<CartSessionData>(db)

  watchArray(_cart, async (newCart, _oldCart, _added, _removed) => {
    console.log('For testing', _cart)

    // Update Firestore document
    try {
      await updateDoc(db, { items: newCart })
    } catch (error) {
      console.error('Error updating cart document:', error)
    }
  })

  watchDebounced(_cart, async () => {
    // Calculate total for each item
    _cart.value.forEach(item => { item.total = item.quantity * item.product.price })

    // Calculate overall total and number of items
    const total = _cart.value.reduce((sum, item) => sum + item.total, 0)
    const numberOfItems = _cart.value.reduce((sum, item) => sum + item.quantity, 0)

    // Update Firestore document
    try {
      await updateDoc(db, { total, numberOfItems })
    } catch (error) {
      console.error('Error updating cart document:', error)
    }
  }, {
    debounce: 3000
  })
  
  const cart = computed(() => cartSession?.data?.value?.items || [])
  
  function _hasSize(product: ProductNode, size: Undefineable<BaseSizeSet>) {
    if (!isDefined(size)) return ref(false)
    return useArrayIncludes(product.node.sizeSet, size, (a, b) => a.name === b.name)
  }

  function _hasProduct(product: ProductNode) {
    return useArrayIncludes<CartItem, ProductNode>(_cart, product, (a, b) => a.product.id === b.node.id)
  }

  async function _createItem(product: ProductNode, size: Undefineable<BaseSizeSet>, callback?: (item: CartItem) => void) {
    const hasSize = _hasSize(product, size)
    
    if (hasSize.value) {
      const item: CartItem = {
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
        total: 0
      }
      
      const hasProduct = _hasProduct(product)

      if (hasProduct.value) {
        const selectedProduct = useArrayFind(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))

        if (isDefined(selectedProduct)) {
          selectedProduct.value.quantity += 1
          selectedProduct.value.total = selectedProduct.value.quantity * selectedProduct.value.product.price
        }
      } else {
        _cart.value.push(item)
      }

      if (isDefined(callback)) {
        callback(item)
      }
    }
  }

  const createItem = useThrottleFn(_createItem, 500)

  async function _reduceQuantity(product: ProductNode, size: BaseSizeSet) {
    const selectedProduct = useArrayFind(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))
    
    if (isDefined(selectedProduct)) {
      selectedProduct.value.quantity -= 1
      selectedProduct.value.total = selectedProduct.value.quantity * selectedProduct.value.product.price
    }
  }

  const reduceQuantity = useThrottleFn(_reduceQuantity, 500)

  async function _removeProduct(product: ProductNode) {

  }

  const removeProduct = useThrottleFn(_removeProduct, 500)
  
  // async function _removeProduct(product: ProductNode, size: BaseSizeSet) {
  //   const selectedProductIndex = useArrayFindIndex(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))
    
  //   if (selectedProductIndex.value !== -1) {
  //     console.log('Removing product from cart')
  //     _cart.value.splice(selectedProductIndex.value, 1)
  //   }
  // }

  return {
    cartSessionId,
    cartSession,
    cart,
    lastProduct,
    createItem,
    removeProduct,
    reduceQuantity
  }
})
