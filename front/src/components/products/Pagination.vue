<template>
  <v-row class="text-center">
    <v-col cols="12" class="pb-6">
      <!-- TODO: Translate with "AFFICHAGE ACTUEL 1-48 DE 386 STYLES" -->
      <p>Showing <span class="font-weight-bold">{{ productCount }}</span> of <span class="font-weight-bold">{{ totalCount }}</span> products</p>
      
      <v-btn :x-large="true" @click="loadMoreProducts">
        <v-icon class="mr-2">mdi-arrow-down</v-icon>
        {{ $t('Load more') }}
      </v-btn>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Pagination',

  props: {
    productCount: {
      type: Number,
      default: 0
    }
  },

  computed: {
    ...mapGetters(['totalCount', 'nextUrl']),
  },

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
        console.log(error)
      })
    }
  }
}
</script>
