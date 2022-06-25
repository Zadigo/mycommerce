/**
 * Implements functionnalities for components
 * and views that require working with products
 * in the backend
 * 
 */

import { ref } from 'vue'
import { useShop } from '../store/shop'

import { client } from '../plugins/axios'

export default function useShopComposable (app, route) {
  const isLoading = ref(true)

  /**
   * Get variants for a specific product
   */
  async function requestProductVariants () {
    const store = useShop()

    try {
      const response = await client.post(`/shop/products/${store.currentProduct.id}`)

      this.productVariants = response.data.variants
      this.reviews = response.data.reviews

      // TODO: If the recommended products is below 1, maybe propose
      // and alternative set of items to the user
      this.recommendedProducts = response.data.recommended_products

      isLoading.value = false
    } catch (error) {
      store.addErrorMessage('V-AX-PV - Could not get the current product variants')
    }
  }

  /**
   * Request products from a given
   * collection
   */
  async function productsRequest () {
    const store = useShop()

    try {
      // Sends a request to get the backend
      // without sending an emit
      const collectionName = route.params.collection
      let response = null

      if (collectionName === 'all') {
        response = await client.get('/collection/all')
      } else {
        // FIXME: When reloading thee product page
        // the collectionName is undefineed making the
        // product page not being able to retrieve the
        // variants
        response = await client.get(`/collection/${collectionName}`)
      }

      store.$patch((state) => {
        state.originalProductsResponse = response.data
        state.products = state.originalProductsResponse.results
        app.appContext.config.globalProperties.$localstorage.create('products', state.products)
        app.appContext.config.globalProperties.$session.create('products', response.data)
      })
    } catch (error) {
      console.error(error)
      store.addErrorMessage('V-AX-PR - An error occured while trying get the collection')
    }
  }

  function getProducts () {
    app.emit('start-load')
    productsRequest()
    app.emit('end-load')
  }

  return {
    isLoading,
    productsRequest,
    requestProductVariants,
    getProducts
  }
}
