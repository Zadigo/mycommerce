import { client } from "@/plugins/axios"
import { useShop } from "@/store/shop"
import { reactive } from "vue"

export default function useShopComposable (app, route) {
  const isLoading = reactive(true)

  function runCallback (func, response) {
    if (func && typeof func === 'function') {
      try {
        func(response.data)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function getAllProducts (callback) {
    const store = useShop()

    try {
      const collectionName = route.params.collection
      let response = null

      if (collectionName === 'all') {
        response = await client.get('/collection/all')
      } else {
        response = await client.get(`/collection/${collectionName}`)
      }

      store.$patch((state) => {
        // TODO: Improve this section
        state.originalProductsResponse = response.data
        state.products = response.data.results
        app.appContext.config.globalProperties.$localstorage.create('products', state.products)
        app.appContext.config.globalProperties.$session.create('products', response.data)
      })

      runCallback(callback)
    } catch (error) {
      store.addErrorMessage('V-AX-PR - An error occured while trying get the collection')
    }
  }

  return {
    isLoading,
    getAllProducts
  }
}
