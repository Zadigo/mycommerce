<template>
  <v-app>
    <header class="fixed-top">
      <!-- Top banner -->
      <base-top-banner v-if="$route.meta.fullPage==false" />

      <!-- Navbar -->
      <base-navbar v-if="$route.meta.fullPage==false" />

      <!-- Messages -->
      <base-messages />

      <!-- Search -->
      <base-search-modal />
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
    </v-main>

    <base-footer v-if="$route.meta.fullPage==false" />
  </v-app>
</template>
<script>

import languageMixin from '@/mixins/languageMixin'

import BaseSearchModal from '@/components/BaseSearchModal.vue'
import BaseNavbar from '@/components/BaseNavbar.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'

export default {
  name: 'BaseSite',
  components: { 
    BaseFooter,
    BaseNavbar,
    BaseSearchModal,
    ModalLanguageSelection
  },
  mixins: [languageMixin],
  computed: {
    displayItem() {
      return this.getVerticalScrollPercentage(document.body) >= 10
    }
  }
}
</script>
