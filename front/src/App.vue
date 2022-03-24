  <!-- <dashboard-site v-if="routerViewForAdmin" /> -->

  <!-- <base-site v-else /> -->

  <!-- TODO: Think of a more efficient way to switch between the dashboard and the shop section -->
  <!-- <v-main v-if="routerViewForAdmin">
    <router-view :key="$route.name" name="dashboard" />
  </v-main> -->
  
  <!-- <v-main v-else> -->
<template>
  <v-app>
    <header class="fixed-top">
      <!-- Top banner -->
      <base-top-banner v-if="$route.meta.fullPage==false" />

      <!-- Navbar -->
      <base-navbar v-if="$route.meta.fullPage==false" />

      <!-- Messages -->
      <base-messages />
    </header>
    

    <v-main>
      <transition name="general-transition" mode="out-in">
        <router-view :key="$route.name"/>
      </transition>

      <button v-if="displayItem" type="button" class="btn btn-primary btn-lg btn-floating" style="position:fixed;right:3%;bottom:5%;z-index:9999;" @click="window.scrollTo(0, 0)">
        <v-icon>mdi-arrow-up</v-icon>
      </button>

      <modal-cart />
      <login-modal />
      <base-subscription-modal />
      <modal-language-selection />
      <base-search-modal />
    </v-main>

    <base-footer v-if="$route.meta.fullPage==false" />

  </v-app>
</template>

<script>
// import BaseSite from '@/views/BaseSite.vue'
// import DashboardSite from '@/views/DashboardSite.vue'
import languageMixin from './components/languageMixin'

import BaseNavbar from './components/BaseNavbar.vue'
import BaseFooter from './components/BaseFooter.vue'
import BaseSearchModal from './components/BaseSearchModal.vue'
import ModalLanguageSelection from './components/ModalLanguageSelection.vue'

export default {
  name: 'App',
  // components: {
  //   BaseSite,
  //   DashboardSite
  // },

  components: { 
    BaseNavbar,
    BaseFooter,
    ModalLanguageSelection,
    BaseSearchModal
  },

  mixins: [languageMixin],

  data: () => ({
    routerViewForAdmin: false
  }),

  watch: {
    $route (item) {
      item.meta.isAdmin ? this.routerViewForAdmin = true : this.routerViewForAdmin = false
    }
  },

  computed: {
    displayItem() {
      return this.getVerticalScrollPercentage(document.body) >= 10
    }
  },

  beforeMount () {
    this.$route.meta.isAdmin ? this.routerViewForAdmin = true : this.routerViewForAdmin = false
  }
}
</script>

<style>
  /* @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'); */
  @import url('https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.10.2/mdb.min.css');
  @import './assets/style.css';
  @import './assets/dashboard.css';

  .text-decoration-none {
    text-decoration: none;
  }

  main {
    position: relative
  }

  nav {
    z-index: 1000;
  }

  header.fixed-top {
    position: fixed;
    top: 0px;
    right: 0;
    left: 0;
    z-index: 1030;
  }
</style>
