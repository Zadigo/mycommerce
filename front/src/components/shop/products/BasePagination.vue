<template>
  <v-btn :x-large="true" @click="getProducts">
    <slot></slot>
  </v-btn>
</template>

<script>
import shopMixin from '@/mixins/shop'

export default {
  name: 'BasePagination',
  mixins: [shopMixin]
}
</script>
