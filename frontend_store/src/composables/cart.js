import { client } from 'src/plugins/axios'
import { useCart } from 'src/stores/cart'
import { getCurrentInstance, ref } from 'vue'

export function useCartComposable () {
  const app = getCurrentInstance()
  const cartStore = useCart()

  const userSelection = ref({
    id: null,
    size: null,
    quantity: 1,
    product: {}
  })

  const showSizeSelectionWarning = ref(false)

  /**
   * Adds a product to the customer's cart. Useful
   * for the product page
   */
  async function addToCart (product, callback) {
    try {
      if (userSelection.value.size === null) {
        showSizeSelectionWarning.value = true
      } else {
        cartStore.addToCart(product, userSelection)

        const response = await client.post('cart', userSelection.value)

        if (typeof callback === 'function') {
          callback.call(app, response.value)
        }
      }

    } catch (e) {
      console.log(e)
    }
  }

  /**
   * Adds a product to the customer's cart when the
   * the product size or other caracteristics are
   * available in a list (e.g. ProductsPage, CollectionsPage...) 
   */
  async function quickAddToCart(product, size, callback) {
    userSelection.value.size = size
    userSelection.value.id = product.id
    userSelection.value.product = product
    await addToCart(product, callback)
  }

  return {
    userSelection,
    showSizeSelectionWarning,
    addToCart,
    quickAddToCart
  }
}
