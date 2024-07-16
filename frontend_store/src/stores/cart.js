import _ from 'lodash'
import { defineStore } from 'pinia'

const useCart = defineStore('cart', {
  state: () => ({
    requestData: {
      session_id: null,
      firstname: null,
      lastname: null,
      email: null,
      telephone: null,
      address_line: null,
      zip_code: null,
      country: null,
      city: null,
      delivery: 'Post office',
      card_token: null
    },
    
    products: [],
    
    showAddedProductDrawer: false,
    showEditProductDrawer: false,
    showCartDrawer: false,
  }),
  getters: {
    hasProducts () {
      return this.products.length > 0
    },
    /**
     * Count the number of products in the cart
     * which can be the quantity of items stored
     * under each product
     */ 
    numberOfProducts () {
      if (this.hasProducts) {
        return _.sum(_.map(this.products, product => product.quantity))
      } else {
        return 0
      }
    },
    /**
     * The last product that was added to
     * the user's cart. This is mainly for
     * the dialog that shows the last product
     * that was added to the cart
     */
    lastAddedProduct () {
      return _.last(this.products) || {}
    },
    /**
     * Calculate the cart total dynamically which is
     * the amount of similar products that were added
     * to the cart multiplied by their respective prices
     */
    cartTotal () {
      if (this.hasProducts) {
        return _.sum(_.map(this.products, item => item.quantity * item.product.get_price))
      } else {
        return 0
      }
    },
    /**
     * Target that the customer must
     * attain in order to get free
     * delivery on his cart total
     */
    freeDeliveryTarget () {
      const difference = 50 - this.cartTotal
      return difference < 0 ? 0 :  difference
    }
  },
  actions: {
    /**
     * Preload the cart from the session if we actually
     * have the data. This allows us then to dynamically
     * calculate the items that the user has selected 
     */
    loadFromCache () {
      console.log('Load from cache')
      this.products = this.$session.retrieve('cart') || []
    },
    /**
     * This is the main function that adds a product to
     * the user's cart in the frontend. When the product
     * does not exist, it is created otherwise, its quantity
     * is upgraded 
     */
    addToCart (product, userSelection) {
      const productData = {
        id: product.id,
        size: userSelection.size,
        color: null,
        quantity: 1,
        product: product
      }

      const existingProduct = _.find(this.products, {
        id: productData.id,
        size: productData.size
      })
      
      if (typeof existingProduct === 'undefined') {
        this.products.push(productData)
      } else {
        existingProduct.quantity += 1
      }
    },
    /**
     * Removes a product entirely from the cart 
     * regardless of quantity 
     */
    removeFromCart (product) {
      const index = _.findIndex(this.products, { id: product.id })
      this.products.splice(index, 1)
    }
  }
})

export {
  useCart
}
