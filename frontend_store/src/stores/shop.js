import _ from "lodash"
import { defineStore } from "pinia"

const useShop = defineStore('shop', {
  state: () => ({
    visitedProducts: [],
    likedProducts: [{ id: 1 }]
  }),
  actions: {
    addToHistory (product) {
      // Adds the product to the list of
      // products that were historically
      // visited by the user
      this.visitedProducts.push(product)
    },
    addToWishlist (product) {
      const existingProduct = _.find(this.likedProducts, { id: product.id })

      if (typeof existingProduct === 'undefined') {
        this.likedProducts.push(product)
      }
    },
    removeFromWishlist (product) {
      const index = _.findIndex(this.likedProducts, { id: product.id })

      if (index >= 0) {
        this.likedProducts.splice(index, 1)
      }
    }
  },
  getters: {
    numberOfVisitedProducts () {
      return this.visitedProducts.length
    },
    uniqueVisitedProductIds () {
      const ids = _.map(this.visitedProducts, product => product.id)
      return _.uniq(ids)
    }
  }
})

export {
  useShop
}
