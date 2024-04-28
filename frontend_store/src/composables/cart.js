import { client } from 'src/plugins/axios'
import { useVueSession } from 'src/plugins/vue-storages'
import { useCart } from 'src/stores/cart'
import { getCurrentInstance, ref } from 'vue'

export function useCartComposable () {
  const app = getCurrentInstance()
  const cartStore = useCart()
  const { session } = useVueSession()

  const userSelection = ref({
    id: null,
    size: null,
    quantity: 1,
    product: {},
    session_id: null
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
      const sessionId = session.retrieve('session_id')
      userSelection.value.session_id = sessionId || null

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
   * @addToCartNoSize
   */
  async function addToCart (product, callback) {
    try {
      if (userSelection.value.size === null && product.has_size) {
        showSizeSelectionWarning.value = true
      } else {
        userSelection.value.product = product
        const response = await requestAddToCart(userSelection.value)
        cartStore.addToCart(product, userSelection.value)

        if (typeof callback === 'function') {
          callback.call(app, response.data)
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
      userSelection.value.product = product
      const response = await requestAddToCart(userSelection.value)
      
      cartStore.addToCart(product, userSelection.value)
      
      if (typeof callback === 'function') {
        callback.call(app, response.data)
      }
    } catch (e) {
      console.error('Failed to cart', e.response)
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
