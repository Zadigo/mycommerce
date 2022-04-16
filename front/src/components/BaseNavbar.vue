<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-none border-bottom">
    <div class="container">
      <router-link :to="{ name: 'home_view', params: { lang: $i18n.locale } }" class="navbar-brand">
        <span class="text-uppercase font-weight-bold">
          {{ myproject.company.legalName }}
        </span>
      </router-link>

      <div class="collapse navbar-collapse justify-content-around">
        <ul class="navbar-nav">
          <li class="nav-item" @mouseenter="showMegaMenu">
            <router-link :to="{ name: 'collection_details_view', params: { collection: 'all', lang: $i18n.locale } }" class="nav-link text">
              {{ $t('Shop') }}
            </router-link>
          </li>

          <li class="nav-item">
            <router-link :to="{ name: 'fitting_room_view' }" class="nav-link text">
              {{ $t('Fitting room') }}
            </router-link>
          </li>

          <li class="nav-item">
            <a class="nav-link" @click="goToAdmin">
               {{ $t('Admin') }}
            </a>
          </li>

          <!-- Mega-menu -->
          <ecommerce-megamenu :is-visible="isVisible" @close-megamenu="isVisible=false"></ecommerce-megamenu>
        </ul>

        <ul class="navbar-nav">
          <li class="nav-item">
            <a class="nav-link" @click="toggleSearchModal">
              <v-icon size="28" class="mr-2">mdi-magnify</v-icon>
            </a>
          </li>
          
          <li class="nav-item">
            <router-link :to="{ name: 'wishlists_view', params: { lang: $i18n.locale } }" class="nav-link">
              <v-icon size="28" class="mr-2">mdi-heart</v-icon>
            </router-link>
          </li>

          <li class="nav-item" @click="$store.commit('toggleModalCart')">
            <a class="nav-link">
              <v-icon size="28" class="mr-2">mdi-cart</v-icon>
            </a>
          </li>

          <li class="nav-item">
            <a class="nav-link">
              <!-- <v-icon size="28" class="mr-2">mdi-account</v-icon> -->
              <v-icon v-if="isAuthenticated" size="28" class="mr-2">mdi-logout</v-icon>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'

export default {
  name: 'BaseNavbar',

  data: () => ({
    isVisible: false
  }),
  
  computed: {
    ...mapGetters(['cartCount']),
    ...mapGetters('authenticationModule', ['isAuthenticated'])
  },

  methods: {
    ...mapMutations(['toggleSearchModal']),
    
    logout() {
      this.$store.commit('authenticationModule/logout')
      this.$router.push({ name: 'home', params: { lang: this.$i18n.locale } })
    },

    goToAdmin() {
      this.$store.commit('changeSite', 'dashboard-site')
      this.$router.push({ name: 'dashboard_index_view' })
    },

    showMegaMenu() {
      this.isVisible=true
    }
  }
}
</script>

<style scoped>
.navbar {
  height: 90px;
}

/* .navbar-light .navbar-nav .nav-link.text:focus, .navbar-light .navbar-nav .nav-link.text:hover {
  color: rgba(0,0,0,.7);
  border-bottom: 2px solid #000000;
} */

.nav-item {
  font-weight: 600;
}
</style>
