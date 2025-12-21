import { doc, updateDoc, increment } from 'firebase/firestore'
import { CARTSESSIONNAME } from '~/composables/use'
import type { Arrayable, BaseSizeSet, CartItem, CartSessionData, ProductNode, Undefineable } from '~/types'

export const useCartComposable = createGlobalState(() => {
  const defaultReturn = {
    cartSession: null,
    cart: ref<Arrayable<CartItem>>([]),
    lastProduct: ref<CartItem | null>(null),
    add: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { },
    removeProduct: async (_product: Undefineable<ProductNode>): Promise<void> => { },
    reduceQuantity: async (_product: Undefineable<ProductNode>, _size: Undefineable<BaseSizeSet>): Promise<void> => { }
  }

  if (import.meta.server) {
    return defaultReturn
  }

  const cartSessionId = useCookie<CartSessionData>(CARTSESSIONNAME)
  
  if (!isDefined(cartSessionId)) {
    console.error('Cart session ID cookie is undefined.')
    return defaultReturn
  }
  
  const fireStore = useFirestore()
  const docRef = doc(fireStore, 'carts', cartSessionId.value)
  const cartSession = useDocument<CartSessionData>(docRef)

  console.log('Cart session data loaded:', cartSession.data.value)

  const _cart = ref<CartItem[]>([])
  const cart = computed(() => isDefined(cartSession.data) ? cartSession.data.value.items : [])

  watchArray(_cart, (newCart, _oldCart, _added, _removed) => {
    console.log('Updating cart in Firestore:', newCart)

    // Calculate total for each item
    _cart.value.forEach(item => { item.total = item.quantity * item.product.price })

    // Calculate overall total and number of items
    const total = _cart.value.reduce((sum, item) => sum + item.total, 0)
    const numberOfItems = _cart.value.reduce((sum, item) => sum + item.quantity, 0)

    // Update Firestore document
    const executeUpdate = async () => {
      try {
        await updateDoc(docRef, { items: newCart, total, numberOfItems })
      } catch (error) {
        console.error('Error updating cart document:', error)
      }
    }

    executeUpdate()
  })

  function _hasSize(product: ProductNode, size: Undefineable<BaseSizeSet>) {
    if (!isDefined(size)) return ref(false)
    return useArrayIncludes(product.node.sizeSet, size, (a, b) => a.name === b.name)
  }

  function _hasProduct(product: ProductNode) {
    return useArrayIncludes<CartItem, ProductNode>(_cart, product, (a, b) => a.product.id === b.node.id)
  }

  async function _add(product: ProductNode, size: Undefineable<BaseSizeSet>) {
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
        console.log(_cart.value)
        const selectedProduct = useArrayFind(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))

        if (isDefined(selectedProduct)) {
          console.log('Product already in cart, updating quantity')
          selectedProduct.value.quantity += 1
          selectedProduct.value.total = selectedProduct.value.quantity * selectedProduct.value.product.price
        }
      } else {
        console.log('Adding new product to cart')
        _cart.value.push(item)
      }
    }
  }

  const add = useThrottleFn(_add, 500)

  async function _reduceQuantity(product: ProductNode, size: BaseSizeSet) {
    const selectedProduct = useArrayFind(_cart, (item) => (item.product.id === product.node.id) && (item.size.name === size.name))
    
    if (isDefined(selectedProduct)) {
      console.log('Reducing product quantity in cart')
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

  const lastProduct = computed(() => _cart.value[_cart.value.length - 1] || null)

  return {
    cartSession,
    cart,
    lastProduct,
    add,
    removeProduct,
    reduceQuantity
  }
})
