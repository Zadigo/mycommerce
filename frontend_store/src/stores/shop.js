import _, { isUndefined } from 'lodash'
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
     * @param {Object} product The product object
     * @param {Number} product.id The unique ID of the product
     * @param {String} product.name The product's name
     * @param {String} product.color The product's color
     * @param {String} product.category The product's category
     * @param {String} product.sub_category The product's sub_category
     * @param {Object[]} product.sizes The product's sizes
     * @param {Number} product.sizes.id The product's sizes
     * @param {String} product.sizes.name The product's sizes
     * @param {String} product.sizes.sub_category The product's sizes
     * @param {Boolean} product.sizes.availability The product's sizes
     * @param {Boolean} product.has_sizes If the product has different sizes
     * @param {Boolean} product.get_price The product's price
     * @param {Number} product.sale_value The product's price
     * @param {Number} product.sale_price The product's price
     * @param {Boolean} product.on_sale The product's price
     * @param {Boolean} product.collection_set The product's price
     * @param {Number} product.collection_set.id The product's price
     * @param {String} product.collection_set.name The product's price
     * @param {String} product.collection_set.category The product's price
     * @param {String} product.collection_set.sub_category The product's price
     * @param {Number} product.collection_set.number_of_items The product's price
     * @param {String} product.collection_set.illustration The product's price
     * @param {String} product.collection_set.tags The product's price
     * @param {String} product.collection_set.get_view_name The product's price
     * @param {Object} product.get_main_image The product's price
     * @param {Object[]} product.images The product's price
     * @param {String} product.color_variant_name The product's price
     * @param {Boolean} product.is_new The product's price
     * @param {Boolean} product.active The product's price
     * @param {Boolean} product.display_new The product's price
     * @param {String} product.slug The product's price
     * @param {String} product.created_on The product's price
     * @param {String} product.modified_on The product's price
     */
    addToHistory (product) {
      this.visitedProducts.push({ id: product.id, name: product.name})
    },
    /**
     * Adds the product to the user's
     * wishlist on the frontend
     * 
     * @param {Object} product  
     */
    addToWishlist (product) {
      const existingProduct = _.find(this.likedProducts, { id: product.id })

      if (isUndefined(existingProduct)) {
        this.likedProducts.push(product)
      }
    },
    /**
     * Removes the product to the user's
     * wishlist on the frontend
     * 
     * @param {Object} product The product object
     */
    removeFromWishlist (product) {
      const index = _.findIndex(this.likedProducts, { id: product.id })

      if (index >= 0) {
        this.likedProducts.splice(index, 1)
      }
    },
    checkIsLiked (product) {
      return this.likedProductsIds.includes(product.id)
    },
    loadFromCache () {
      this.visitedProducts = this.$localstorage.retrieve('visitedProducts') || []
      this.likedProducts = this.$localstorage.retrieve('likedProducts') || []
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
    },
    /**
     * Returns the IDs of the products that were liked
     * by the user
     * 
     * @returns {number[]} The IDs of the products that were liked
     */
    likedProductsIds () {
      return _.map(this.likedProducts, (product) => product.id)
    }
  }
})

export {
  useShop
}
