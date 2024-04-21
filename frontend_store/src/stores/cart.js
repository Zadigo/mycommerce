import _ from 'lodash'
import { defineStore } from "pinia"

const useCart = defineStore('cart', {
  state: () => ({
    requestData: {
      firstname: null,
      lastname: null,
      email: null,
      telephone: null,
      address_line: null,
      zip_code: null,
      country: null,
      city: null,
      delivery: 'Post office'
    },
    
    cart: [],
    
    showAddedProductDrawer: false,
    showEditProductDrawer: false,
    showCartDrawer: false,
  }),
  getters: {
    hasProducts () {
      return this.cart.length > 0
    },
    lastAddedProduct () {
      // The last product that was added to
      // the user's cart
      return _.last(this.cart)
    },
    cartTotal () {
      // Calculate the cart total dynamically
      return _.sum(_.map(this.cart, product => product.quantity * product.product.price))
    },
    freeDeliveryTarget () {
      // Target that the customer must
      // attain in order to get free
      // delivery on his cart total
      const difference = 50 - this.cartTotal
      return difference < 0 ? 0 :  difference
    }
  },
  actions: {
    addToCart (productData) {
      // TODO: This does not work since it keeps
      // adding different products to the same exact one
      const existingProduct = _.find(this.cart, {
        id: productData.id,
        size: productData.size
      })
      
      if (typeof existingProduct === 'undefined') {
        this.cart.push(productData)
      } else {
        existingProduct.quantity += 1
      }
    }
  }
})

export {
  useCart
}
