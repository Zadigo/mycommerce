import _ from 'lodash'
import { defineStore } from 'pinia'

const useShop = defineStore('shop', {
  state: () => ({
    visitedProducts: [],
    likedProducts: []
  }),
  actions: {
    /**
     * Adds the product to the list of
     * products that were historically
     * visited by the user in the store
     * 
     * @param {number} product The product to add to list of viewed items
     */
    addToHistory (product) {
      this.visitedProducts.push(product.id)
    },
    /**
     * Adds the product to the user's
     * wishlist on the frontend. The store has a main
     * subscription which allows the data to sync to
     * the local storage
     * 
     * @param {number} productId The ID of the product to like
     */
    addToWishlist (productId) {
      if (!this.likedProducts.includes(productId)) {
        this.likedProducts.push(productId)
      }
    },
    /**
     * Removes the product to the user's
     * wishlist on the frontend
     * 
     * @param {Object} product The product object
     */
    removeFromWishlist (productId) {
      const index = _.indexOf(this.likedProducts, productId)

      if (index >= 0) {
        this.likedProducts.splice(index, 1)
      }
    },
    loadFromCache () {
      this.likedProducts = this.$localstorage.retrieve('likedProducts')
      this.visitedProducts = this.$localstorage.retrieve('visitedProducts')
    }
  },
  getters: {
    /**
     * Returns the number of products that
     * were visited by the user for the
     * actual given session
     * 
     * @returns {Number} The number of visited products 
     */
    numberOfVisitedProducts () {
      return this.visitedProducts.length
    },
    /**
     * Returns the unique IDs of each products that
     * were visited by the user during his session
     * 
     * @returns {Number[]} The unique IDs for each visited product 
     */
    uniqueVisitedProductIds () {
      return _.uniq(this.visitedProducts)
    }
  }
})

export {
  useShop
}
