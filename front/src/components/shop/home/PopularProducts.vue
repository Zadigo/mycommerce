<template>
  <v-row>
    <v-col cols="12">
      <h2>{{ $t('Nos produits les plus populaires') }}</h2>
    </v-col>
    
    <v-col cols="12">
      <card v-for="product in popularProducts" :key="product.id" :is-loading="isLoading" />
    </v-col>
  </v-row>
</template>

<script>
import Card from "@/components/shop/products/Card.vue"

export default {
  name: 'PopularProducts',

  components: { Card },
  
  data: () => ({
    popularProducts: [],
    isLoading: false
  })
}
</script>
