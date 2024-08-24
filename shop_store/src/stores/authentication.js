import { defineStore } from 'pinia'

const useAuthentication = defineStore('authentication', {
  state: () => ({
    showLoginDrawer: false,
    token: null,
    profile: {}
  }),
  getters: {
    /**
     * Indicates whether the user is authenticated
     * 
     * @returns {Boolean} 
     */
    isAuthenticated () {
      return (
        this.token !== null &&
        typeof this.token !== 'undefined'
      )
    }
  },
  actions: {
    /**
     * Allows us to load the token and profile information
     * from the cache in order to determine if the user
     * is still authenticated
     */
    loadFromCache () {
      const data = this.$session.retrieve('authentication') || {}
      this.token = data.token
      this.profile = data.user
    }
  }
})

export {
  useAuthentication
}
