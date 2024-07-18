import _ from 'lodash'
import { client } from 'src/plugins/axios'
import { useVueSession } from 'src/plugins/vue-storages'
import { useCart } from 'src/stores/cart'
import { getCurrentInstance, ref } from 'vue'

/**
 * The cart composable is a function that allows
 * the implementation of cart functionnalities all
 * around the application. It allows also to work
 * with both axios and pinia at the same time when
 * working with adding or removing items from the cart
 * using proxy functions
 */
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

  /***
   * Syncs the cart details retrieved from the backend
   * to the one in the frontend
   * 
   * @param {Object} responseData 
   */
  function sync (responseData) {
    _.forEach(cartStore.products, (product) => {
      const item = _.find(responseData.statistics, { id: product.id })
      if (typeof item !== 'undefined') {
        cartStore.products[product.id].quantity = item.quantity
      }
    })
  }


  /**
   * This is a callback function that can be used
   * to get details on the current stock of a given
   * product in the database
   * 
   * @param {Number | String} id The product ID
   */
  async function requestCheckStock (id) {
    try {
      id
      stockDetailsResponse.value = {}
    } catch (e) {
      console.log(e)
    }
  }
  
  /**
   * Function used to communicate to the backend
   * that a product was added to the cart
   * 
   * @param {Object} data
   * @returns {Object}
   */
  async function requestAddToCart (data) {
    try {
      const sessionId = session.retrieve('session_id')
      // By changing this, it updates in the underlying
      // proxy in the ref since data is that proxy
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
   * Proxy function used for example on the product
   * page to communicate between the page and 
   * `requestAddToCart`. This requires a size
   * selection. For no size see {@linkcode addToCartNoSize}
   * 
   * @param {Object} product
   * @param {Function} callback
   */
  async function addToCart (product, callback) {
    try {
      if (userSelection.value.size === null && product.has_size) {
        showSizeSelectionWarning.value = true
      } else {
        userSelection.value.product = product
        const response = await requestAddToCart(userSelection.value)
        cartStore.addToCart(product, userSelection.value)
        sync(response.data)

        if (typeof callback === 'function') {
          callback.call(app, response.data)
        }
      }

    } catch (e) {
      console.log(e)
    }
  }

  /**
    * Proxy function used for example on the product
    * page to communicate between the page and 
    * `requestAddToCart`. This does not requires a size
    *
    * @param {Object} product The product object
    * @param {Function} callback The callback function to execute
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
      console.error('Failed to add product to cart', e.response)
    }
  }

  /**
   * Adds a product to the customer's cart when the
   * the product size or other caracteristics are
   * available in a list (e.g. ProductsPage, CollectionsPage...) 
   * 
   * @param {Object} product The product object
   * @param {String | Number} size The product's size attribute
   * @param {Function} callback The callback function to execute
   */
  async function quickAddToCart(product, size, callback) {
    userSelection.value.size = size
    userSelection.value.id = product.id
    userSelection.value.product = product
    await addToCart(product, callback)
  }

  /**
   * Adds a product to the customer's cart when the
   * the product size or other caracteristics are
   * available in a list (e.g. ProductsPage, CollectionsPage...) 
   * 
   * @param {Object} product
   * @param {Function} callback 
   */
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
