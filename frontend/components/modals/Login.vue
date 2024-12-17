
<template>
  <v-navigation-drawer v-model="shouldShowLoginDrawer" width="400" location="right" sticky temporary @close="shouldShowLoginDrawer=false">
    <div class="container">
      <v-btn variant="tonal" class="mt-2" @click="shouldShowLoginDrawer=false">
        <font-awesome icon="chevron-left" />
      </v-btn>
    </div>

    <v-divider />
    
    <BlockSignup v-if="showSignup" @authenticate="handleAuthenticateCart" />
    <BlockLogin v-else @show-signup="showSignup=true" @authenticate="handleAuthenticateCart" />
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { AxiosError } from 'axios';
import { useSessionStorage } from '@vueuse/core'

const route = useRoute()
const authenticationStore = useAuthentication()
const authenticatedCart = useSessionStorage('authenticated_cart', false)
const sessionId = useCookie('session_id')

const { $client } = useNuxtApp()
const { showLoginDrawer } = storeToRefs(authenticationStore)

const showSignup = ref(false)

const shouldShowLoginDrawer = computed<boolean>({
  get: () => {
    return route.query.login === '0' || showLoginDrawer.value
  },
  set: (value: boolean) => {
    showLoginDrawer.value = value
  }
})

/**
 * When the user has added a set of products to his
 * cart when he was not logged in, this function will
 * get called in order to attribute all the products
 * to his authenticated account once he logs in  
 */
async function handleAuthenticateCart () {
  try {
    if (authenticatedCart.value) {
      await $client.post('cart/authenticate', {
        session_id: sessionId.value
        // session_id: this.$session.retrieve<string>('session_id')
      })
    }
    // if (!this.$session.retrieve<boolean>('authenticated_cart')) {
    //   await this.$http.post('cart/authenticate', {
    //     session_id: this.$session.retrieve<string>('session_id')
    //   })
    //   this.$session.toggle('authenticated_cart')
    // }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Handle error
    }
  }
}
</script>
