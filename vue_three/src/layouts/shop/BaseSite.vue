<template>
  <!-- <v-app> -->
  <section>
    <header class="fixed-top">
      <!-- Top banner -->
      <!-- <base-top-banner v-show="!$route.meta.isFullPage" /> -->

      <!-- Navbar -->
      <base-navbar-vue v-show="!$route.meta.isFullPage" />

      <!-- Messages -->
      <base-messages-vue />

      <!-- Search -->
      <!-- <base-search-modal /> -->
    </header>

    <!-- <v-main> -->
    <div role="main">
      <!-- <router-view :key="$route.name"/> -->

      <router-view v-slot="{ Component }">
        <transition name="opacity" mode="in-out">
          <component :is="Component" />
        </transition>
      </router-view>

      <!-- <scroll-top-button /> -->

      <modal-cart-vue />
      <!-- <cart-off-canvas /> -->
      <!-- <login-modal /> -->
      <!-- <base-subscription-modal :show-modal="showSubscriptionModal" /> -->
      <!-- <modal-language-selection /> -->
    </div>
    <!-- </v-main> -->

    <base-footer-vue v-show="!$route.meta.isFullPage" />
  <!-- </v-app> -->
  </section>
</template>

<script>
// import BaseSearchModal from '@/components/BaseSearchModal.vue'
import BaseMessagesVue from '@/components/BaseMessages.vue'
import BaseNavbarVue from '@/components/BaseNavbar.vue'
import BaseFooterVue from '@/components/BaseFooter.vue'
import ModalCartVue from '@/components/shop/ModalCart.vue'

// import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'
// import ScrollTopButton from '@/components/ScrollTopButton.vue'
// import CartOffCanvas from '@/components/shop/cart/CartOffCanvas.vue'
// import { mapState } from 'vuex'

export default {
  name: 'BaseSite',
  components: {
    BaseFooterVue,
    BaseMessagesVue,
    BaseNavbarVue,
    ModalCartVue
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
