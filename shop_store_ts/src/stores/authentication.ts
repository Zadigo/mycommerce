import { defineStore } from 'pinia'
import { Profile } from '../types/authentication';

declare type RootState = {
  showLoginDrawer: boolean;
  token: string | null;
  profile: Profile | object;
};

const useAuthentication = defineStore('authentication', {
  state: (): RootState => ({
    showLoginDrawer: false,
    token: null,
    profile: {}
  }),
  getters: {
    /**
     * Indicates whether the user is authenticated
     */
    isAuthenticated (): boolean {
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
