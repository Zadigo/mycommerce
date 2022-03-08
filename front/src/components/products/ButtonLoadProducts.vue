<template>
  <v-btn :x-large="true" @click="loadMoreProducts">
    <slot></slot>
  </v-btn>
</template>

<script>
export default {
  name: 'ButtonLoadProducts',
  methods: {
    loadMoreProducts() {
      this.$emit('is-loading', true)

      this.$api.shop.products.filter(this.nextUrl)
      .then((response) => {
        var products = response.data

        this.$store.commit('setProducts', products)
        this.$session.set('products', products)
        
        setTimeout(() => {
          this.$emit('end-loading', false)
        }, 1000)
      })
      .catch((error) => {
        this.dispatch('addErrorMessage', error.response.statusText)
      })
    }
  }
}
</script>
