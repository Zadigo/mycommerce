import { defineStore } from 'pinia'

const useAuthentication = defineStore('authentication', {
  state: () => ({
    showLoginDrawer: false,
    token: null
  }),
  getters: {
    isAuthenticated () {
      return this.token !== null
    }
  },
  actions: {
    login () {
      this.token = 'logged_in'
    },
    logout () {
      this.token = null
      this.$router.push({
        name: 'shop_products'
      })
    }
  }
})

export {
  useAuthentication
}
