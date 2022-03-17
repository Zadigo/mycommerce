<template>
  <v-btn :x-large="true" @click="getProducts">
    <slot></slot>
  </v-btn>
</template>

<script>
import shopMixin from '../shopMixin'

export default {
  name: 'ButtonLoadProducts',
  mixins: [shopMixin]
}
</script>
