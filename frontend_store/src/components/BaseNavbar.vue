<template>
  <header class="navbar-light navbar-sticky header-static">
    <nav class="navbar navbar-expand-lg bg-white fixed-top" style="z-index: 1000;">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#shop-navbar" aria-controls="shop-navbar" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        
        <div id="shop-navbar" class="collapse navbar-collapse">
          <div class="d-flex justify-content-around w-100">
            <div class="navbar-nav">
              <router-link :to="{ name: 'shop_products' }" class="nav-link">
                Collection
              </router-link>
            </div>
  
            <router-link :to="{ name: 'shop_products' }" class="navbar-brand text-uppercase fw-bold text-center">
              Shop
            </router-link>
  
            <div class="navbar-nav">
              <v-btn variant="tonal" class="nav-link" @click="$emit('display-search')">
                <font-awesome-icon :icon="['fas', 'fa-magnifying-glass']" />
              </v-btn>
  
              <router-link :to="{ name: 'wishlist' }" class="nav-link">
                <font-awesome-icon :icon="['fas', 'fa-heart']" />
              </router-link>
  
              <a href class="nav-link" @click.prevent="() => { showCartDrawer = true }">
                <font-awesome-icon :icon="['fas', 'fa-shopping-cart']" />
              </a>
  
              <router-link v-if="authenticationStore.isAuthenticated" :to="{ name: 'accounts_home' }" class="nav-link">
                <font-awesome-icon :icon="['fas', 'user']" />
              </router-link>
            </div>
          </div>
          <!-- <div v-if="authenticationStore.isAuthenticated" class="navbar-nav">
            <router-link :to="{ name: 'wishlist' }" class="nav-link">Wishlist</router-link>
            <a href class="nav-link" @click.prevent="() => { showCartDrawer = true }">
              Cart
            </a>

            <router-link :to="{ name: 'accounts_home' }" class="nav-link">
              <font-awesome-icon :icon="['fas', 'user']" />
            </router-link>

            <v-btn class="nav-link" @click="handleLogout">
              <font-awesome-icon :icon="['fas', 'right-from-bracket']" />
            </v-btn>

            <v-btn @click="$emit('display-search')">Search</v-btn>
          </div>

          <div v-else class="navbar-nav">
            <router-link :to="{ name: 'wishlist' }" class="nav-link">
              Wishlist
            </router-link>

            <a href class="nav-link" @click.prevent="() => { showCartDrawer = true }">
              Cart
            </a>

            <a href class="nav-link" @click.prevent="() => { showLoginDrawer = true }">
              <font-awesome-icon :icon="['fas', 'user']" />
            </a>

            <v-btn @click="$emit('display-search')">
              Search
            </v-btn>
          </div> -->
        </div>
      </div>
    </nav>
  </header>
</template>

<script>
import { storeToRefs } from 'pinia'
import { useAuthenticationComposable } from 'src/composables/authentication';
import { useAuthentication } from 'src/stores/authentication';
import { useCart } from 'src/stores/cart';

export default {
  emits: {
    'display-search' () {
      return true
    }
  },
  setup () {
    const { logout } = useAuthenticationComposable()

    const authenticationStore = useAuthentication()
    const { showLoginDrawer } = storeToRefs(authenticationStore)

    const cartStore = useCart()
    const { showCartDrawer } = storeToRefs(cartStore)

    return {
      logout,
      showLoginDrawer,
      showCartDrawer,
      authenticationStore
    }
  },
  methods: {
    handleLogout () {
      this.logout(() => {
        this.$router.push({
          name: 'shop_products'
        })
      })
    }
  }
}
</script>
