<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white shadow">
    <div class="container">
      <router-link :to="{ name: 'home', params: { lang: $i18n.locale } }" class="navbar-brand">
        <span class="text-uppercase font-weight-bold">
          {{ myproject.company.legalName }}
        </span>
      </router-link>

      <div class="collapse navbar-collapse justify-content-around">

        <ul class="navbar-nav">
          <li class="nav-item" @mouseenter="showMegaMenu">
            <router-link :to="{ name: 'collection_details', params: { collection: 'all', lang: $i18n.locale } }" class="nav-link text">
              {{ $t('Shop') }}
            </router-link>
          </li>

           <li class="nav-item">
            <router-link :to="{ name: 'fitting_room_view' }" class="nav-link text">
              {{ $t('Fitting room') }}
            </router-link>
          </li>

           <li class="nav-item">
            <router-link :to="{ name: 'dashboard_index' }" class="nav-link text">
              {{ $t('Admin') }}
            </router-link>
          </li>

          <!-- Mega-menu -->
          <ecommerce-megamenu :is-visible="isVisible" @close-megamenu="isVisible=false"></ecommerce-megamenu>
        </ul>

        <ul class="navbar-nav">
          <form class="form-inline px-3">
            <v-text-field :placeholder="$t('Search')" type="search" outlined hide-details></v-text-field>
          </form>
          
          <li class="nav-item">
            <router-link :to="{ name: 'wishlist', params: { lang: $i18n.locale } }" class="nav-link">
              <v-icon size="28" class="mr-2">mdi-heart</v-icon>
            </router-link>
          </li>

          <li class="nav-item" @click="$store.commit('toggleModalCart')">
            <a class="nav-link">
              <v-icon size="28" class="mr-2">mdi-cart</v-icon>
            </a>
          </li>
        </ul>
      
      </div>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

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
    logout() {
      this.$store.commit('authenticationModule/logout')
      this.$router.push({ name: 'home', params: { lang: this.$i18n.locale } })
    },

    showMegaMenu() {
      // var html = document.querySelector('body')
      // html.style.backgroundColor = "rgba(0, 0, 0, 0.6)"
      this.isVisible=true
    }
  }
}
</script>

<style scoped>
.navbar {
  height: 90px;
}

.navbar-light .navbar-nav .nav-link.text:focus, .navbar-light .navbar-nav .nav-link.text:hover {
  color: rgba(0,0,0,.7);
  border-bottom: 2px solid #000000;
}

.nav-item {
  font-weight: 600;
}
</style>
