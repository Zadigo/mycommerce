import { updateDoc } from 'firebase/firestore'
import type { CartItem } from '~/types'

type PromiseReturn = (string | number | undefined)[]

type PromiseType<T> = () => Promise<T>

export const useEditCartItemComposable = createGlobalState(() => {
  const { docRef, cartSession, isInitialized, cart } = useCartComposable()
  const editedCartItem = refAutoReset<CartItem | undefined>(undefined, 1*60*1000) // 1 minute
  const operations = ref <PromiseType<PromiseReturn>[]>([])
  const isSyncing = ref(false)

  const defaultReturn = {
    editedCartItem,
    addQuantity: async () => { },
    decreaseQuantity: async () => {}
  }

  if (!isInitialized.value) {
    console.warn('Cart is not initialized yet')
    return defaultReturn
  }

  if (isDefined(editedCartItem)) {
    const { inc: _addQuantity, dec: _decreaseQuantity } = useCounter(editedCartItem.value.quantity, { min: 0, max: 100 })
  
    // Helper to queue operations if one is already in progress
    function _createTask(fn: PromiseType<PromiseReturn>) {
      if (isSyncing.value) {
        operations.value.push(fn)
      } else {
        fn().then(() => {
          isSyncing.value = false
        })
      }
    }
  
    function addQuantity(){
      const promise = new Promise<PromiseReturn>((resolve) => {
        isSyncing.value = true
        const newQuantity = _addQuantity()
        resolve([editedCartItem.value?.product.id || undefined, newQuantity])
      })
  
      _createTask(() => promise)
  
      return promise
    }
  
    function decreaseQuantity(){
      const promise = new Promise<PromiseReturn>((resolve) => {
        isSyncing.value = true
        const newQuantity = _decreaseQuantity()
        resolve([editedCartItem.value?.product.id || undefined, newQuantity])
      })
  
      _createTask(() => promise)
  
      return promise
    } 
  
    whenever(() => operations.value.length > 0, async () => {
      // Process the queue of operations on the cart item
      const { result } = useAsyncQueue<PromiseReturn[]>(operations.value)
      console.log('Result', result)
    })
  
    watchDebounced(editedCartItem, async (newItem) => {
      if (isDefined(cartSession)) {
        try {
          if (isDefined(docRef)) {
            const newItems = cart.value.map((item) => {
              if (item.product.id === editedCartItem.value.product.id &&
                  item.size.name === editedCartItem.value.size.name) {
                return {
                  ...item,
                  quantity: newItem.quantity
                }
              }
            })
            await updateDoc(docRef, { items: newItems })
          }
        } catch (error) {
          console.error('Error updating cart item:', error)
        }
      }
    }, {
      debounce: 300
    })
  
    return {
      editedCartItem,
      addQuantity,
      decreaseQuantity
    }
  } else {
    console.warn('editedCartItem is undefined')
    return defaultReturn
  }
})
