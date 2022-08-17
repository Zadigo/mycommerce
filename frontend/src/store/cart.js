import { defineStore } from "pinia"
import { toNumber } from '@vue/shared'
// import _ from 'lodash'

const useCart = defineStore('cart', {
  state: () => ({
    openCart: false,
    sessionId: null,
    cartItems: [],
    cachedCart: []
  }),
  actions: {
    reloadCache () {
      const data = this.$localStorage.retrieve('cart') || {}
      this.updateCart(data)
    },
    updateCart (data) {
      this.cachedCart = data
      this.sessionId = data.session_id
      this.cartItems = data.results  || []
    }
  },
  getters: {
    total () {
      return toNumber(this.cachedCart?.total || 0)
    },
    // totalDiscounts () {
    //   return _.sum(_.map(this.cartItems, (item => {
    //     return item.product.unit_price * 1 - item.product.sale_price * 1
    //   })))
    // },
    count () {
      return this.cartItems?.length || 0
    },
    isEmpty () {
      return this.cartItems.length === 0
    }
  }
})

export {
  useCart
}
