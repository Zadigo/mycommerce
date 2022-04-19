<template>
  <v-app>
    <header class="fixed-top">
      <!-- Top banner -->
      <base-top-banner v-show="!$route.meta.isFullPage" />

      <!-- Navbar -->
      <base-navbar v-show="!$route.meta.isFullPage" />

      <!-- Messages -->
      <base-messages />

      <!-- Search -->
      <base-search-modal />
    </header>
    

    <v-main>
      <transition name="general-transition" mode="out-in">
        <router-view :key="$route.name"/>
      </transition>

      <scroll-top-button />

      <modal-cart />
      <login-modal />
      <base-subscription-modal />
      <modal-language-selection />
    </v-main>

    <base-footer v-show="!$route.meta.isFullPage" />
  </v-app>
</template>

<script>
import BaseSearchModal from '@/components/BaseSearchModal.vue'
import BaseNavbar from '@/components/BaseNavbar.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'
import ScrollTopButton from '@/components/ScrollTopButton.vue'

export default {
  name: 'BaseSite',
  components: { 
    BaseFooter,
    BaseNavbar,
    BaseSearchModal,
    ModalLanguageSelection,
    ScrollTopButton
  }
}
</script>
