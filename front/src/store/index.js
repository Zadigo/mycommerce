import Vue from 'vue'
import Vuex from 'vuex'

var _ = require('lodash')

import shopModule from './modules/shop'
import messagesModule from './modules/messages'
import dashboardModule from './modules/dashboard'

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
    },
    
    reset(state) {
      state.user = {}
      state.token = null
    }
  },

  getters: {
    isAuthenticated(state) {
      // Check whether the user is authenticated
      return state.token != null
    }
  }
}

export default new Vuex.Store({
  state: {
    openCart: false,

    cachedCartResponse: {},
    cartSessionId: null,
    cartItems : [],
    cart: [],

    likedProducts: [],

    showSearchModal: false,

    currentSite: 'base-site'
  },

  mutations: {
    changeSite(state, name) {
      state.currentSite = name
    },

    toggleModalCart(state) {
      state.openCart = !state.openCart
    },

    toggleSearchModal(state) {
      state.showSearchModal = !state.showSearchModal
    },

    updateCart(state, result) {
      if (result) {
        state.cachedCartResponse = result
        state.cartSessionId = result.session_id
        state.cartItems = result.results
        state.cart = result.statistics
      } else {
        state.cart = []
      }
    }
  },
  
  getters: {
    cartCount (state) {
      return state.cart.length
    },
    
    cartTotal (state) {
      var prices = _.map(state.cart, (product) => {
        return _.toNumber(product.unit_price)
      })
      var total = _.sum(prices)
      return total > 0 ? total : 0
    }
  },

  modules: {
    shopModule: shopModule,
    messagesModule: messagesModule,
    authenticationModule: authenticationModule,
    dashboardModule: dashboardModule
  }
})
