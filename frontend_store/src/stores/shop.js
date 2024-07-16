import _ from 'lodash'
import { defineStore } from 'pinia'
import { createMockupProducts } from 'src/utils'

const useShop = defineStore('shop', {
  state: () => ({
    visitedProducts: [],
    likedProducts: createMockupProducts(2)
  }),
  actions: {
    /**
     * Adds the product to the list of
     * products that were historically
     * visited by the user in the store
     * 
     * @param {Object} product The product object
     * @param {Number} product.id The unique ID of the product
     * @param {String} product.name The product's name
     */
    addToHistory (product) {
      this.visitedProducts.push(product)
    },
    /**
     * Adds the product to the user's
     * wishlist on the frontend
     * 
     * @param {Object} product  
     */
    addToWishlist (product) {
      const existingProduct = _.find(this.likedProducts, { id: product.id })

      if (typeof existingProduct === 'undefined') {
        this.likedProducts.push(product)
      }
    },
    /**
     * Removes the product to the user's
     * wishlist on the frontend
     * 
     * @param {Object} product The product object
     * @param {Number} product.id The unique ID of the product
     * @param {String} product.name The product's name
     */
    removeFromWishlist (product) {
      const index = _.findIndex(this.likedProducts, { id: product.id })

      if (index >= 0) {
        this.likedProducts.splice(index, 1)
      }
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
      const ids = _.map(this.visitedProducts, product => product.id)
      return _.uniq(ids)
    }
  }
})

export {
  useShop
}
