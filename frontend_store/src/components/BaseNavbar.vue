<template>
  <nav class="navbar navbar-expand-lg bg-white fixed-top" style="z-index: 1000;">
    <div class="container-fluid">
      <router-link :to="{ name: 'shop_products' }" class="navbar-brand">
        Shop
      </router-link>

      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#shop-navbar" aria-controls="shop-navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="shop-navbar" class="collapse navbar-collapse">
        <div v-if="authenticationStore.isAuthenticated" class="navbar-nav">
          <router-link :to="{ name: 'wishlist' }" class="nav-link">Wishlist</router-link>
          <router-link :to="{ name: 'shop_payment_home' }" class="nav-link">Cart</router-link>

          <router-link :to="{ name: 'accounts_home' }" class="nav-link">
            <font-awesome-icon :icon="['fas', 'user']" />
          </router-link>

          <v-btn class="nav-link" @click="logout">
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
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapActions, storeToRefs } from 'pinia'
import { useAuthentication } from 'src/stores/authentication';
import { useCart } from 'src/stores/cart';

export default {
  emits: {
    'display-search' () {
      return true
    }
  },
  setup () {
    const authenticationStore = useAuthentication()
    const { showLoginDrawer } = storeToRefs(authenticationStore)

    const cartStore = useCart()
    const { showCartDrawer } = storeToRefs(cartStore)

    return {
      showLoginDrawer,
      showCartDrawer,
      authenticationStore
    }
  },
  methods: {
    ...mapActions(useAuthentication, ['logout'])
  }
}
</script>
