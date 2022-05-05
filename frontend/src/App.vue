<template>
  <component :is="currentSite" />
</template>

<script>
import { useShop } from '@/store/shop'
import { storeToRefs } from 'pinia'

import BaseSite from '@/layouts/shop/BaseSite.vue'

export default {
  name: 'App',
  components: {
    BaseSite
  },
  setup() {
    var store = useShop()
    var { currentSite } = storeToRefs(store)

    return {
      currentSite
    }
  }
}
</script>

<style>

</style>
