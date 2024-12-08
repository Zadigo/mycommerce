import { UserProfile } from '@/types/authentication';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';


export const useAuthentication = defineStore('authentication', () => {
  const showLoginDrawer = ref(false)
  const access = ref<string>()
  const refresh = ref<string>()
  const profile = ref<UserProfile>()

  const isAuthenticated = computed(() => {
    return access.value !== null
  })

  return {
    profile,
    isAuthenticated,
    showLoginDrawer,
    access,
    refresh
  }
})

// type State = {
//   showLoginDrawer: boolean;
//   token: string;
//   profile: UserProfile | Record<string, Type>;
// };

// const useAuthentication = defineStore("authentication", {
//   state: (): State => ({
//     showLoginDrawer: false,
//     token: '',
//     profile: {},
//   }),
//   getters: {
//     /**
//      * Indicates whether the user is authenticated
//      */
//     isAuthenticated(): boolean {
//       return this.token !== null && this.token !== '' && typeof this.token !== "undefined";
//     },
//   },
//   actions: {
//     /**
//      * Allows us to load the token and profile information
//      * from the cache in order to determine if the user
//      * is still authenticated
//      */
//     loadFromCache() {
//       const data = this.$session.retrieve("authentication") || {};
//       this.token = data.token;
//       this.profile = data.user;
//     },
//   },
// });

// export {
//   useAuthentication
// };

