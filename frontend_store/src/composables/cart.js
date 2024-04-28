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
  const stockDetailsResponse = ref({})

  /**
   * This callback internal function can be used
   * to get details on the current stock of a given
   * product in the database 
   */
  async function requestCheckStock (id) {
    id
    stockDetailsResponse.value = {}
  }

  async function requestAddToCart (data) {
    try {
      const response = await client.post('cart/add', data)
      await requestCheckStock()
      return response
    } catch (e) {
      console.error(e)
      return {}
    }
  }

  /**
   * Adds a product to the customer's cart. Useful
   * for the product page - This requires a size
   * selection. For no size see
   * @something
   */
  async function addToCart (product, callback) {
    try {
      if (userSelection.value.size === null) {
        showSizeSelectionWarning.value = true
      } else {
        cartStore.addToCart(product, userSelection.value)

        const response = await requestAddToCart(userSelection.value)
        response

        if (typeof callback === 'function') {
          callback.call(app, {})
        }
      }

    } catch (e) {
      console.log(e)
    }
  }

  /**
    * Adds a product to the customer's cart for items
    * that do not require a size selection
    */
  async function addToCartNoSize (product, callback) {
    try {
      cartStore.addToCart(product, userSelection.value)
      const response = await requestAddToCart(userSelection.value)
      response
      if (typeof callback === 'function') {
        callback.call(app, {})
      }
    } catch (e) {
      console.error(e)
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

  async function quickAddToCartNoSize (product, callback) {
    userSelection.value.id = product.id
    userSelection.value.product = product
    await addToCartNoSize(product, callback)
  }

  async function deleteFromCart (product) {
    try {
      cartStore.removeFromCart(product)
    } catch (e) {
      console.error(e)
    }
  }

  return {
    userSelection,
    showSizeSelectionWarning,
    stockDetailsResponse,
    addToCartNoSize,
    deleteFromCart,
    quickAddToCartNoSize,
    addToCart,
    quickAddToCart
  }
}
