import Vue from 'vue'
import Vuex from 'vuex'

import shopModule from './modules/shop'
import messagesModule from './modules/messages'

var _ = require('lodash')

Vue.use(Vuex)

var authenticationModule = {
  namespaced: true,

  state: () => ({
    user: {},
    token: null,

    loginModal: false
  }),

  mutations: {
    loginUser(state) {
      // Toggle the login modal
      state.loginModal = !state.loginModal
    },

    logout(state) {
      state.user = {}
      state.token = null
    },
    
    setUserProfile(state, payload) {
      // Implement the different information
      // for the user
      state.token = payload.token
      state.user = payload.user
    }
  },

  getters: {
    isAuthenticated (state) {
      // Check whether the user is authenticated
      return state.token != null
    }
  }
}

export default new Vuex.Store({
  state: {
    openCart: false,
    cart : []
  },

  mutations: {
    toggleModalCart (state) {
      // Open the modal cart so that the 
      // user can see what is in his cart
      state.openCart = !state.openCart
    },
    updateCart (state, products) {
      // Adds a product to the cart
      state.cart = products
    }
  },
  
  actions: {
  },
  
  getters: {
    cartCount (state) {
      return state.cart.length
    },
    cartTotal (state) {
      // Returns the total of the
      // current items that the
      // user has in his cart
      var prices = []
      _.forEach(state.cart, (product) => {
        prices.push(_.toNumber(product.unit_price))
      })
      var total = _.sum(prices)
      return total > 0 ? total : 0
    }
  },
  modules: {
    shopModule: shopModule,
    messagesModule: messagesModule,
    authenticationModule: authenticationModule
  }
})
