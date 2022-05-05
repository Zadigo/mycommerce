<template>
  <button class="btn btn-lg btn-secondary" @click="getProducts">
    <slot></slot>
  </button>
</template>

<script>
import shopMixin from '@/mixins/shop'

export default {
  name: 'BasePaginationButton',
  mixins: [shopMixin]
}
</script>
