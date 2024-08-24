import _ from 'lodash'
import { defineStore } from 'pinia'

export const useAuthentication = defineStore('authentication', {
  state: () => ({

  }),
  getters: {
    isAuthenticated () {
      return true
    }
  },
  actions: {
    
  }
})
