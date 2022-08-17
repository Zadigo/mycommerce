/**
 * Implements functionnalities for components
 * and views that require working with the cart
 * 
 */

import { ref } from 'vue'

import { LOCALSTORAGE_INSTANCE } from '@/plugins/vue-storages/local-storage'
import { useShop } from '../store/shop'
import { client } from '@/plugins/axios'

export default function useCartComposable () {
  const addingToCart = ref(false)
  const store = useShop()
  const productOptions = ref({ 
    default_size: 'Unique',
    product: null,
    session_id: null
  })

  function cartCache () {
    return LOCALSTORAGE_INSTANCE.retrieve('cart')
  }

  function sessionId () {
    try {
      return cartCache().session_id
    } catch {
      return null
    }
  }

  async function removeFromCart (product) {
    product
  }

  async function addToCart (product, success) {
    try {
      addingToCart.value = true
      
      const options = {}
      Object.assign(options, productOptions.value)
      options.product = product.id
      options.session_id = sessionId()
      console.log('addToCart', options, product)
      // productOptions.value.product = product.id
      // productOptions.value.default_size = productOptions.value.default_size || 'Unique'
      // productOptions.value.sesssion_id = LOCALSTORAGE_INSTANCE.retrieve('cart')?.session_id
      // console.log(productOptions.value)

      const response = await client.post('cart/add', options)
      const data = response.data
      
      store.$patch((state) => {
        state.cart = data
        LOCALSTORAGE_INSTANCE.create('cart', data)
      })
      
      try {
        success(data)
        addingToCart.value = false
      } catch (error) {
        console.error('no function', error)
      }
      
    } catch (error) {
      store.addErrorMessage(`V-AX-CA: ${error}: ${error}`)
    }
  }

  return {
    cartCache,
    sessionId,
    removeFromCart,
    addToCart,
    productOptions
  }
}
