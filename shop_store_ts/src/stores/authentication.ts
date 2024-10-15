import { defineStore } from 'pinia'
import { LoginAPIResponse, Profile } from '@/types/authentication';

declare type RootState = {
  showLoginDrawer: boolean;
  token: string | null;
  profile: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
};

const useAuthentication = defineStore('authentication', {
  state: (): RootState => ({
    showLoginDrawer: false,
    token: null,
    profile: null,
    accessToken: null,
    refreshToken: null
  }),
  getters: {
    /**
     * Indicates whether the user is authenticated
     */
    isAuthenticated (): boolean {
      // return (
      //   this.token !== null &&
      //   typeof this.token !== 'undefined'
      // )
      return (
        this.accessToken !== null &&
        typeof this.accessToken !== 'undefined'
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
      const data = this.$session.retrieve<LoginAPIResponse>('authentication')

      if (data === null || typeof data === 'undefined') {
        return
      }
      
      // if ('token' in data) {
      //   this.token = data.token
      //   this.profile = data.user
      // }
      if ('access' in data) {
        this.accessToken = data.access
        this.refreshToken = data.refresh
      }
    },
    logout () {
      this.accessToken = null
      this.refreshToken = null
      this.token = null
    }
  }
})

export {
  useAuthentication
}
