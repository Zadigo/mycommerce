<template>
  <v-main>
    <!-- Top Banner -->
    <base-top-banner />
    <!-- Navbar -->
    <base-navbar />
  
    <!-- Messages -->
    <base-messages />

    <transition name="general-transition" mode="out-in">
      <router-view :key="$route.name"/>
    </transition>

    <!-- Modals -->
    <modal-cart />
    <login-modal />
    <base-subscription-modal />
    <modal-language-selection />

    <!-- Footer -->
    <base-footer />
  </v-main>
</template>

<script>
import languageMixin from '../components/languageMixin'

import BaseNavbar from '../components/BaseNavbar.vue'
import BaseFooter from '../components/BaseFooter.vue'
import ModalLanguageSelection from '../components/ModalLanguageSelection.vue'

export default {
  name: 'BaseSite',
  components: { 
    BaseNavbar,
    BaseFooter,
    ModalLanguageSelection
  },
  mixins: [languageMixin],
}
</script>
