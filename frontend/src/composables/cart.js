import { client } from "@/plugins/axios"
import { useShop } from "@/store/shop"
import { ref } from "vue"

export default function useCartComposable (app) {
  const isSending = ref(false)
  const productOptions = ref({
    default_size: null
  })

  // TODO: Create a utils
  function runCallback (func, response) {
    if (func && typeof func === 'function') {
      try {
        func(response.data)
      } catch (error) {
        console.error('CAR-ATC', error)
      }
    }
  }

  function enforceSize () {
    return productOptions.value.default_size !== null
  }

  function cachedCart () {
    return app.data.localStorage.cart || { results: [] }
  }

  function setProductOption (key, value) {
    productOptions.value[key] = value
  }

  async function addToCart (product, callback) {
    const store = useShop()

    try {
      isSending.value = true

      const options = {}
      
      Object.assign(options, productOptions.value)
      options.session_id = app.data.localStorage.cart?.session_id || null
      options.product = product.id
      options.default_size = options.default_size || 'Unique'

      const response = await client.post('cart/add', options)
      runCallback(callback, response)
      
      isSending.value = false
    } catch (error) {
      store.addErrorMessage(`V-AX-CA: ${error}: ${error}`)
    }
  }

  async function removeFromCart (product, callback) {
    const store = useShop()

    try {
      isSending.value = true

      const options = {}

      Object.assign(options, productOptions.value)
      options.session_id = app.data.localStorage.cart?.session_id || null
      options.product = product.id
      options.default_size = options.default_size || 'Unique'

      const response = await client.post('cart/remove', options)
      runCallback(callback, response)

      isSending.value = false
    } catch (error) {
      store.addErrorMessage(`V-RM-CA: ${error}: ${error}`)
    }
  }

  return {
    addToCart,
    cachedCart,
    enforceSize,
    isSending,
    productOptions,
    removeFromCart,
    setProductOption
  }
}
