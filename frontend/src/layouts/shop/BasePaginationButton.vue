<template>
  <button type="button" class="btn btn-lg btn-secondary" @click="getProducts">
    <slot></slot>
  </button>
</template>

<script>
import { getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'

import useShopComposable from '../../composables/shop'

export default {
  name: 'BasePaginationButton',
  emits: {
    'start-load': () => true,
    'end-load': () => true
  },
  setup () {
    const app = getCurrentInstance()
    const route = useRoute()
    const { getProducts } = useShopComposable(app, route)
    return {
      getProducts
    }
  }
}
</script>
