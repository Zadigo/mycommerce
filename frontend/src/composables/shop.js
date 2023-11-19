import _ from 'lodash'
import { client } from "@/plugins/axios"
import { useShop } from "@/store/shop"
import { ref } from "vue"

export function useShopComposable (app, route) {
  const isLoading = ref(true)

  // TODO: Create a utils
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

export function navigationComposable () {
  const items = ref([])
  
  function runCallback (func, newIndex) {
    try {
      func(items.value[newIndex])
    } catch (error) {
      console.log(error)
    }
  } 

  function previousItem (id, onafter = () => { }) {
    const index = _.findIndex(items.value, ['id', id * 1])
    let newIndex = index - 1
    if (newIndex < 0) {
      newIndex = 0
    }
    runCallback(onafter, newIndex)
    // var image = this.images['results'][newIndex]
    // this.$router.push({ name: 'dashboard_image_view', params: { id: image.id } })
  }

  function nextItem (id, onafter = () => { }) {
    const index = _.findIndex(items.value, ['id', id * 1])
    let newIndex = index + 1
    if (newIndex > items.value.length) {
      newIndex = 0
    }
    runCallback(onafter, newIndex)
    // var image = this.images['results'][newIndex]
    // this.$router.push({ name: 'dashboard_image_view', params: { id: image.id } })
  }

  return {
    items,
    previousItem,
    nextItem
  }
}
