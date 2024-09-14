import { defineStore } from 'pinia'
import { LoginAPIResponse, Profile } from '@/types/authentication';

declare type RootState = {
  showLoginDrawer: boolean;
  token: string | null;
  profile: Profile | object;
  accessToken: string | null;
  refreshToken: string | null;
};

const useAuthentication = defineStore('authentication', {
  state: (): RootState => ({
    showLoginDrawer: false,
    token: null,
    profile: {},
    accessToken: null,
    refreshToken: null
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
      const data = this.$session.retrieve<LoginAPIResponse>('authentication')
      
      if ('token' in data) {
        this.token = data.token
        this.profile = data.user
      }
    }
  }
})

export {
  useAuthentication
}
