<template>
  <v-app>
    
    <v-main>
      <base-top-banner />
      <!-- Navbar -->
      <base-navbar />
    
      <!-- Messages -->
      <!-- <base-messages /> -->

      <transition name="general-transition" mode="out-in">
        <router-view :key="$route.name"/>
      </transition>

      <!-- Modals -->
      <base-modal-cart />
      <login-modal />
      <base-subscription-modal />
      <modal-language-selection />

      <!-- Footer -->
      <base-footer />
    </v-main>

  </v-app>
</template>

<script>
import languageMixin from './components/languageMixin'

import BaseNavbar from './components/BaseNavbar.vue'
import BaseFooter from './components/BaseFooter.vue'
import ModalLanguageSelection from './components/ModalLanguageSelection.vue'

export default {
  name: 'App',

  components: { 
    BaseNavbar,
    BaseFooter,
    ModalLanguageSelection
  },

  mixins: [languageMixin]
}
</script>

<style>
  /* @import url('https://fonts.googleapis.com/css?family=Roboto:100,300,400,500,700,900'); */
  @import url('https://cdnjs.cloudflare.com/ajax/libs/mdb-ui-kit/3.10.2/mdb.min.css');
  @import './assets/style.css';

  .text-decoration-none {
    text-decoration: none;
  }
</style>
