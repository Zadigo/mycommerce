<template>
  <nav ref="link" class="navbar navbar-expand-lg navbar-light bg-white shadow-md border-bottom p-0">
    <div class="container">
      <router-link :to="{ name: 'shop_view', params: { lang: $i18n.locale } }" class="navbar-brand">
        <span class="text-uppercase fw-bold">
          {{ myproject.company.legalName }}
        </span>
      </router-link>

      <div class="collapse navbar-collapse justify-content-around">
        <ul class="navbar-nav text-uppercase">
          <li class="nav-item">
            <router-link :to="{ name: 'collection_details_view', params: { lang: $i18n.locale, collection: 'all' } }" class="nav-link text">
              {{ $t('Shop') }}
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'collection_details_view', params: { lang: $i18n.locale, collection: 'shorts' } }" class="nav-link text">
              Shorts
            </router-link>
          </li>

          <!-- <li class="nav-item" @mouseenter="showMegaMenu">
            <a class="nav-link text">
              {{ $t('Shop') }}
            </a>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'fitting_room_view' }" class="nav-link text">
              {{ $t('Fitting room') }}
            </router-link>
          </li> -->

          <!-- Mega-menu -->
          <!-- <ecommerce-megamenu :is-visible="isVisible" @close-megamenu="isVisible=false"></ecommerce-megamenu> -->
        </ul>

        <ul class="navbar-nav text-uppercase">
          <!-- <li class="nav-item">
            <a class="nav-link" @click="toggleSearchModal">
              <v-icon size="28" class="mr-2">mdi-magnify</v-icon>
            </a>
          </li> -->

          <li class="nav-item">
            <router-link :to="{ name: 'liked_products_view', params: { lang: $i18n.locale } }" class="nav-link">
              <font-awesome-icon icon="fa-solid fa-heart" />
            </router-link>
          </li>

          <li v-if="authStore.isAuthenticated" class="nav-item">
            <a href class="nav-link" @click.prevent="logout">
              <font-awesome-icon icon="fa-solid fa-right-from-bracket" />
            </a>
          </li>

          <li v-else class="nav-item">
            <router-link :to="{ name: 'login_view', params: { lang: 'fr' } }" class="nav-link">
              <font-awesome-icon icon="fa-solid fa-right-to-bracket" />
            </router-link>
          </li>

          <li class="nav-item">
            <a href class="nav-link" @click.prevent="cartStore.openCart = true">
              <font-awesome-icon icon="fa-solid fa-cart-shopping" />
            </a>
          </li>

          <li class="nav-item">
            <a href class="nav-link" @click.prevent="goToAdmin">
              <font-awesome-icon icon="fa-solid fa-lock" />
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { useShop } from '@/store/shop'
import { useAuthentication } from '@/store/authentication'
import { mapState } from 'pinia'

import useAuthenicationComposable from '../composables/authentication'
import { useCart } from '@/store/cart'

// import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BaseNavbar',
  setup () {
    const store = useShop()
    const cartStore = useCart()
    const authStore = useAuthentication()
    const { performLogout } = useAuthenicationComposable()
    return {
      store,
      cartStore,
      authStore,
      performLogout
    }
  },
  data: () => ({
    isVisible: false
  }),
  computed: {
    ...mapState(useAuthentication, ['isAuthenticated'])

    // ...mapGetters(['cartCount']),
  },

  methods: {
    //   ...mapMutations(['toggleSearchModal']),

    logout () {
      this.performLogout(() => {
        this.authStore.logoutUser()
        this.$localstorage.remove('cart')
        this.$session.remove('auth')
        this.$router.push({ name: 'shop_view', params: { lang: this.$i18n.locale } })
      }, (errors) => {
        console.error(errors)
      })
    },

    goToAdmin () {
      this.store.changeSite('dashboard-site')
      this.$router.push({ name: 'dashboard_index_view' })
    }

    //   showMegaMenu() {
    //     this.isVisible=true
    //   }
  }
}
</script>

<style scoped>
.navbar {
  height: 90px;
}

.nav-item {
  font-weight: 600;
}
</style>
