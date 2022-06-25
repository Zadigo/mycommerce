<template>
  <transition name="site-transition" mode="in-out">
    <component :is="currentSite" />
  </transition>
</template>

<script>
import { useShop } from '@/store/shop'
import { storeToRefs } from 'pinia'

import BaseSite from '@/layouts/shop/BaseSite.vue'
import DashboardSite from '@/layouts/dashboard/DashboardSite.vue'
import useLanguage from './composables/language'

export default {
  name: 'App',
  components: {
    BaseSite,
    DashboardSite
  },
  setup () {
    var store = useShop()
    useLanguage()
    var { currentSite } = storeToRefs(store)

    return {
      currentSite
    }
  }
}
</script>

<style>
@import url('./assets/style.css');
@import url('./assets/skeletons.css');

.site-transition-enter-active {
  transition: all .3s ease-in-out;
}

.site-transition-leave-active {
  transition: all .3s ease-in-out;
}

.site-transition-enter-from {
  opacity: 0;
  transform: translateX(-50px) scale3d(.9, .9, .9);
}

.site-transition-enter-to {
  opacity: 1;
  transform: translateX(0px) scale3d(1, 1, 1);
}

.site-transition-leave-from {
  opacity: 1;
  transform: translateX(0px) scale3d(1, 1, 1);
}

.site-transition-leave-to {
  opacity: 0;
  transform: translateX(0px) scale3d(.9, .9, .9);
}

.site-transition-move {
  transition: all .3s ease;
}
</style>
