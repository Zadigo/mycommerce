import { useCart } from 'src/stores/cart'
import { ref } from 'vue'

export function useCartComposable () {
  const cartStore = useCart()

  const productData = ref({
    size: null
  })

  /**
   * 
   * Adds a product to the customer's cart
   *  
   */
  async function addToCart (callback) {
    try {
      cartStore

      if (typeof callback === 'function') {
        callback()
      }
    } catch (e) {
      console.log(e)
    }
  }

  /**
   *
   * Adds a product to the customer's cart when the
   * the product size or other caracteristics are
   * available in a list (e.g. ProductsPage, CollectionsPage...) 
   * 
   */
  async function quickAddToCart(size, callback) {
    productData.value.size = size
    await addToCart(callback)
  }

  return {
    productData,
    addToCart,
    quickAddToCart
  }
}
