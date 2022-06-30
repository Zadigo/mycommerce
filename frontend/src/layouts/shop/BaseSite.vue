<template>
  <section>
    <!-- Header -->
    <header class="fixed-top">
      <!-- Top banner -->
      <base-top-banner-vue v-show="!$route.meta.isFullPage" />

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
        <button v-if="scrollY > 100" type="button" class="btn btn-floating btn-lg btn-dark"
          @click="scrollToTop">
          <font-awesome-icon icon="fa-solid fa-arrow-up" />
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
import { useScroll } from '@vueuse/core'

import BaseMessagesVue from '@/components/BaseMessages.vue'
import BaseNavbarVue from '@/components/BaseNavbar.vue'
import BaseFooterVue from '@/components/BaseFooter.vue'
import BaseTopBannerVue from '@/components/BaseTopBanner.vue'
import DiscountDrawerVue from '../DiscountDrawer.vue'
import ModalCartVue from '@/components/shop/ModalCart.vue'
import { ref } from 'vue'

// import BaseSearchModal from '@/components/BaseSearchModal.vue'
// import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'
// import ScrollTopButton from '@/components/ScrollTopButton.vue'
// import CartOffCanvas from '@/components/shop/cart/CartOffCanvas.vue'

export default {
  name: 'BaseSite',
  components: {
    BaseTopBannerVue,
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
    const target = ref(null)
    const { y, directions } = useScroll(target)
    return {
      target,
      directions,
      scrollY: y,
      scrollToTop
    }
  },
  mounted () {
    this.target = window.document
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
