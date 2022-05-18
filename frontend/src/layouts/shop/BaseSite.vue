<template>
  <!-- <v-app> -->
  <section>
    <header class="fixed-top">
      <!-- Top banner -->
      <!-- <base-top-banner v-show="!$route.meta.isFullPage" /> -->

      <!-- Navbar -->
      <base-navbar v-show="!$route.meta.isFullPage" />

      <!-- Messages -->
      <!-- <base-messages /> -->

      <!-- Search -->
      <!-- <base-search-modal /> -->
    </header>
    
    <!-- <v-main> -->
    <div role="main">
      <router-view :key="$route.name"/>

      <!-- <router-view v-slot="{ Component }">
        <transition :key="$route.name">
          <component :is="Component" />
        </transition>
      </router-view> -->

      <!-- <scroll-top-button /> -->

      <modal-cart-vue />
      <!-- <cart-off-canvas /> -->
      <!-- <login-modal /> -->
      <!-- <base-subscription-modal :show-modal="showSubscriptionModal" /> -->
      <!-- <modal-language-selection /> -->
    </div>
    <!-- </v-main> -->

    <base-footer v-show="!$route.meta.isFullPage" />
  <!-- </v-app> -->
  </section>
</template>

<script>
// import BaseSearchModal from '@/components/BaseSearchModal.vue'
import BaseNavbar from '@/components/BaseNavbar.vue'
import BaseFooter from '@/components/BaseFooter.vue'
import ModalCartVue from '@/components/shop/ModalCart.vue'
// import CartModal from '@/components/'
// import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'
// import ScrollTopButton from '@/components/ScrollTopButton.vue'
// import CartOffCanvas from '@/components/shop/cart/CartOffCanvas.vue'
// import { mapState } from 'vuex'

export default {
  name: 'BaseSite',
  components: { 
    BaseFooter,
    BaseNavbar,
    ModalCartVue,
    // BaseSearchModal,
    // CartOffCanvas,
    // ModalLanguageSelection,
    // ScrollTopButton
  },
  computed: {
    // ...mapState(['showSubscriptionModal'])
  }
}
</script>
