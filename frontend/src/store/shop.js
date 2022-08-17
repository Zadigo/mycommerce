import _, { toNumber } from 'lodash'
import { defineStore } from 'pinia'
import { useAuthentication } from './authentication'

// const useCart = defineStore('cart', {
//     state: () => ({
//         cart: []
//     })
// })

const useShop = defineStore('shop', {
  state: () => ({
    cachedCartResponse: {},
    cartSessionId: null,
    cartItems: [],
    cart: [],

    openCart: false,
    showSearchModal: false,
    showSubscriptionModal: false,

    likedProducts: [],
    recentlyViewed: [],

    originalProductsResponse: {},
    products: [],
    currentProduct: {},
    currentProductReviews: [],

    previousUrl: null,
    nextUrl: null,

    searchedPrice: [],

    userLists: []
  }),
  actions: {
    logout () {
      const store = useAuthentication()
      store.logout()
    },
    resetProducts () {
      this.localStorage.remove('products')
    },
    updateCart (data) {
      if (data) {
        this.cachedCartResponse = data
        this.cartSessionId = data.session_id
        this.cartItems = data.results
        this.cart = data.statistics
      } else {
        this.cart = []
      }
    },
    reloadProducts () {
      // Reloads existing products
      // from the localstorage
      if (this.products.length === 0) {
        const items = this.localstorage.retrieve('products') || {}
        this.originalProductsResponse = items
        this.products = items.products
      }
    },
    getProduct (productId) {
      this.reloadProducts()
      const currentProduct = _.find(this.products, ['id', toNumber(productId)])
      this.currentProduct = currentProduct || {}
      this.recentlyViewed.push(toNumber(productId))

      const existingItems = this.localstorage.retrieve('recentlyViewed') || []
      if (existingItems.length > 0) {
        existingItems.push(toNumber(productId))
        this.localstorage.create('recentlyViewed', existingItems)
      } else {
        this.localstorage.create('recentlyViewed', this.recentlyViewed)
      }
    },
    getProductIndex (productId) {
      return _.findIndex(this.products, ['id', toNumber(productId)])
    },
    setProducts (response) {
      this.originalProductsResponse = response.data
      this.products = response.data.results
    }
  },
  getters: {
    cartLength () {
      return this.cartItems.length
    },
    minPrice () {
      return _.minBy(this.products, 'get_price')
    },
    maxPrice () {
      return _.maxBy(this.products, 'get_price')
    },
    hasProducts () {
      return this.products.length > 0
    },
    displayedProductsCount () {
      return this.products.length
    },
    getRecentlyViewedProducts () {
      const ids = _.uniq(this.recentlyViewed)

      const items = _.filter(this.products, (product) => {
        return ids.includes(product.id)
      })

      if (items.length > 3) {
        // Return the 4 last items
        return items.slice(items.length - 4, items.length)
      }
      return items
    }
  }
})

export {
  useShop
}
