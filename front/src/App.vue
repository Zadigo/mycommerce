<template>
  <v-app>
    
    <!-- <dashboard-site v-if="routerViewForAdmin" /> -->

    <!-- <base-site v-else /> -->

    <!-- TODO: Think of a more efficient way to switch between the dashboard and the shop section -->
    <!-- <v-main v-if="routerViewForAdmin">
      <router-view :key="$route.name" name="dashboard" />
    </v-main> -->
    
    <!-- <v-main v-else> -->
    <v-main>
      <base-top-banner />

      <base-navbar />
    

      <base-messages />

      <transition name="general-transition" mode="out-in">
        <router-view :key="$route.name"/>
      </transition>


      <modal-cart />
      <login-modal />
      <base-subscription-modal />
      <modal-language-selection />


      <base-footer />
    </v-main>

  </v-app>
</template>

<script>
// import BaseSite from '@/views/BaseSite.vue'
// import DashboardSite from '@/views/DashboardSite.vue'
import languageMixin from './components/languageMixin'

import BaseNavbar from './components/BaseNavbar.vue'
import BaseFooter from './components/BaseFooter.vue'
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
    ModalLanguageSelection
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
</style>
