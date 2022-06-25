<template>
  <section>
    <!-- Header -->
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

    <!-- Main -->
    <div role="main">
      <router-view v-slot="{ Component }">
        <transition name="opacity" mode="in-out">
          <component :is="Component" />
        </transition>
      </router-view>

      <transition name="opacity">
        <button type="button" class="btn btn-floating btn-lg btn-dark" @click="scrollToTop">
          Up
        </button>
      </transition>

      <modal-cart-vue />
      <discount-drawer-vue />
      <!-- <cart-off-canvas /> -->
      <!-- <login-modal /> -->
      <!-- <base-subscription-modal :show-modal="showSubscriptionModal" /> -->
      <!-- <modal-language-selection /> -->
    </div>

    <!-- Footer -->
    <base-footer-vue v-show="!$route.meta.isFullPage" />
  </section>
</template>

<script>
import { scrollToTop } from '../../utils'
import BaseMessagesVue from '@/components/BaseMessages.vue'
import BaseNavbarVue from '@/components/BaseNavbar.vue'
import BaseFooterVue from '@/components/BaseFooter.vue'
import DiscountDrawerVue from '../DiscountDrawer.vue'
import ModalCartVue from '@/components/shop/ModalCart.vue'

// import BaseSearchModal from '@/components/BaseSearchModal.vue'
// import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'
// import ScrollTopButton from '@/components/ScrollTopButton.vue'
// import CartOffCanvas from '@/components/shop/cart/CartOffCanvas.vue'

export default {
  name: 'BaseSite',
  components: {
    BaseFooterVue,
    BaseMessagesVue,
    BaseNavbarVue,
    DiscountDrawerVue,
    ModalCartVue
    // BaseSearchModal,
    // CartOffCanvas,
    // ModalLanguageSelection,
    // ScrollTopButton
  },
  setup () {
    return {
      scrollToTop
    }
  }
}
</script>

<style scoped>
.btn-floating {
  position: fixed;
  right: 1%;
  bottom: 1%;
}
</style>
