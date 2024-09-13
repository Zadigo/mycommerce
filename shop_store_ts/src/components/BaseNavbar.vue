<template>
  <header class="navbar-light navbar-sticky header-static">
    <nav class="navbar navbar-expand-lg bg-white fixed-top shadow-sm" style="z-index: 1000;">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#shop-navbar" aria-controls="shop-navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon" />
        </button>
        
        <div id="shop-navbar" class="collapse navbar-collapse">
          <div class="d-flex justify-content-around w-100">
            <div class="navbar-nav">
              <router-link :to="{ name: 'shop_collections' }" class="nav-link">
                Collection
              </router-link>
            </div>
  
            <router-link :to="{ name: 'shop_collections' }" class="navbar-brand text-uppercase fw-bold text-center">
              {{ companyDetails.name }}
            </router-link>
  
            <div class="navbar-nav">
              <v-btn variant="text" class="nav-link" rounded @click="$emit('display-search')">
                <font-awesome-icon :icon="['fas', 'fa-magnifying-glass']" />
              </v-btn>
  
              <router-link :to="{ name: 'wishlist' }" class="nav-link">
                <font-awesome-icon :icon="['fas', 'fa-heart']" />
              </router-link>

              <router-link v-if="authenticationStore.isAuthenticated" :to="{ name: 'accounts_home' }" class="nav-link">
                <font-awesome-icon :icon="['fas', 'user']" />
              </router-link>
              <a href class="nav-link" @click.prevent="authenticationStore.showLoginDrawer = true">
                <font-awesome-icon :icon="['fas', 'user']" />
              </a>
                
              <a href class="nav-link" @click.prevent="() => { showCartDrawer = true }">
                <font-awesome-icon :icon="['fas', 'fa-shopping-cart']" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script lang="ts">
import { useCompany } from '@/composables/company'
import { storeToRefs } from 'pinia'
import { useAuthenticationComposable } from 'src/composables/authentication'
import { useAuthentication } from 'src/stores/authentication'
import { useCart } from 'src/stores/cart'
import { defineComponent } from 'vue'

export default defineComponent({
  emits: {
    'display-search' () {
      return true
    }
  },
  setup () {
    const { companyDetails } = useCompany()

    const { logout } = useAuthenticationComposable()

    const authenticationStore = useAuthentication()
    const { showLoginDrawer } = storeToRefs(authenticationStore)

    const cartStore = useCart()
    const { showCartDrawer } = storeToRefs(cartStore)

    return {
      logout,
      companyDetails,
      showLoginDrawer,
      showCartDrawer,
      authenticationStore
    }
  },
  methods: {
    /**
     * Proxy to handle to logout process  
     */
    handleLogout () {
      this.logout(() => {
        this.$router.push({
          name: 'shop_collections'
        })
      })
    }
  }
})
</script>
