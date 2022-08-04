/**
 * Implements functionnalities for components
 * and views that require working with the cart
 * 
 */

import { ref } from 'vue'

import { client } from '../plugins/axios'
import { useShop } from '../store/shop'

export default function useCartComposable (app) {
  const addingToCart = ref(false)
  const productOptions = ref({ default_size: 'Unique' })

  /**
   * Return the user cart
   * 
   * @returns Cart
   */
  function getCart () {
    return app.appContext.config.globalProperties.$localstorage.retrieve('cart')
  }



  function getSessionId () {
    try {
      return getCart().session_id
    } catch {
      return null
    }
  }

  /**
   * Function allows us to remove a product
   * from the cart
   * 
   * @param {Object} product - product to remove
   */
  async function removeFromCart (product) {
    const store = useShop()

    try {
      const options = {
        product: product.id,
        session_id: this.getSessionId()
      }
      const response = await client.post('cart/remove', options)
      const data = response.data

      store.$patch((state) => {
        state.cachedCartResponse = data
        app.appContext.config.globalProperties.$localstorage.create('cart', data)
      })
    } catch (error) {
      console.error(error)
      this.store.addErrorMessage(error)
    }
  }

  /**
   * Function that adds a product to the cart
   * rapidly
   * 
   * @param {Object} product - product to add
   * @param {String} size - the product's size
   */
  async function quickAddToCart (product, size) {
    const store = useShop()
    try {
      // console.info(this.axios)
      const details = {
        product: product.id,
        default_size: size.name,
        // NOTE: Check here
        session_id: this.getSessionId()
      }
      const response = await client.post('cart/add', details)
      const data = response.data

      store.updateCart(data)
      app.appContext.config.globalProperties.$localstorage.create('cart', data)

      // this.runCallback(openOnCreate)
    } catch (error) {
      console.log(error)
      this.store.addErrorMessage(error)
    }
  }

  // TODO: Implement
  async function addToCart (product, options) {
    try {
      addingToCart.value = true

      const defaultSize = options.default_size

      // When the size is unique, and since
      // we initially set the default size
      // as null, set it to Unique or this
      // will return an error requiring that
      // the default_size be not null
      if (!defaultSize) {
        options.default_size = 'Unique'
      }

      try {
        // Try to get a current session_id if the
        // user has already been adding items to
        // his current cart
        options.session_id = getSessionId()
      } catch (error) {
        options.session_id = null
      }
      options.product = product.id

      const response = await this.$http.post('cart/add', options)
      const data = response.data

      this.store.$patch((state) => {
        state.cart = data
        app.appContext.config.globalProperties.$localstorage.create('cart', data)
      })

      addingToCart.value = false
    } catch (error) {
      console.error(error)
      this.store.addErrorMessage(`V-AX-CA: ${error}: ${error.response.message}`)
    }
  }

  return {
    addToCart,
    addingToCart,
    productOptions,
    removeFromCart,
    quickAddToCart,
    getCart,
    getSessionId
  }
}
