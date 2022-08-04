import { defineStore } from 'pinia'

const useAuthentication = defineStore('authentication', {
  state: () => ({
    user: {
      email: null
    },
    token: null,

    loginModal: false
  }),
  actions: {
    logoutUser () {
      this.user = { email: null, token: null }
      this.token = null
      this.session.remove('auth')
    },
    loginUser (data) {
      this.user = data
      this.token = data.token
    },
    loadUserSession () {
      const session = this.session.retrieve('auth')
      const data = session || { email: null, token: null }
      this.loginUser(data)
    }
  },
  getters: {
    isAuthenticated () {
      this.loadUserSession()
      return this.token !== null
    }
  }
})

export {
  useAuthentication
}
