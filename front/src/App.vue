<template>
  <transition mode="out-in">
    <component :is="currentSite" />
  </transition>
</template>

<script>
import languageMixin from '@/mixins/languageMixin'
import { mapState } from 'vuex'
// import BaseNavbar from './components/BaseNavbar.vue'
// import BaseNavbar from '@/components/BaseNavbar.vue'
// import BaseFooter from '@/components/BaseFooter.vue'
// import BaseSearchModal from '@/components/BaseSearchModal.vue'
// import ModalLanguageSelection from '@/components/ModalLanguageSelection.vue'

import BaseSite from '@/layouts/BaseSite.vue'
import BlankSite from '@/layouts/BlankSite.vue'
import DashboardSite from '@/layouts/DashboardSite.vue'

export default {
  name: 'App',

  components: {
    BaseSite,
    BlankSite,
    DashboardSite
  },

  // components: { 
  //   BaseNavbar,
  //   BaseFooter,
  //   ModalLanguageSelection,
  //   BaseSearchModal
  // },

  mixins: [languageMixin],

  data: () => ({
    routerViewForAdmin: false
  }),

  computed: {
    ...mapState(['currentSite'])
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

  header.fixed-top {
    position: fixed;
    top: 0px;
    right: 0;
    left: 0;
    z-index: 1030;
  }
</style>
