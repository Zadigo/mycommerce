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
    
    products: [],
    
    showAddedProductDrawer: false,
    showEditProductDrawer: false,
    showCartDrawer: false,
  }),
  getters: {
    hasProducts () {
      return this.products.length > 0
    },
    numberOfProducts () {
      // Count the number of products in the cart
      // which can be the quantity of items stored
      // under each product
      if (this.hasProducts) {
        return _.sum(_.map(this.products, product => product.quantity))
      } else {
        return 0
      }
    },
    lastAddedProduct () {
      // The last product that was added to
      // the user's cart. This is mainly for
      // the dialog that shows the lasts product
      // that was added to the cart
      return _.last(this.products) || {}
    },
    cartTotal () {
      // Calculate the cart total dynamically which is
      // the amount of similar products that were added
      // to the cart multiplied by their respected prices
      if (this.hasProducts) {
        return _.sum(_.map(this.products, item => item.quantity * item.product.get_price))
      } else {
        return 0
      }
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
    loadFromCache () {
      // Preload the cart from the session if we actually
      // have the data. This allows us then to dynamically
      // calculate the items that the user has selected
      console.log('Load from cache')
      this.products = this.$session.retrieve('cart') || []
    },
    addToCart (product, userSelection) {
      // TODO: Build functions depending on clothes or
      // types of productst that do not specifically
      // require size etc
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
      console.log('cartStore', existingProduct)
      
      if (typeof existingProduct === 'undefined') {
        this.products.push(productData)
      } else {
        existingProduct.quantity += 1
      }
    },
    removeFromCart (product) {
      const index = _.findIndex(this.products, { id: product.id })
      this.products.splice(index, 1)
    }
  }
})

export {
  useCart
}
