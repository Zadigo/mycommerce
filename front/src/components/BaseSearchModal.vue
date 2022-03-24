<template>
  <!-- TODO: Implement search functionnality -->
  <div id="search" class="d-none">
    <div class="container">
      <div class="row">
        <div class="col-12">
          <v-text-field v-model="search" type="text" outlined hide-details></v-text-field>
        </div>
      </div>

      <v-row>
        <v-col v-for="product in searchedProducts" :key="product.id" cols="3">
          <card :product="product" :is-loading="isLoading" />
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
import Card from '@/components/products/Card.vue'

export default {
  name: 'BaseSearchModal',
  components: { Card }, 
  data: () => ({
    isLoading: false,
    search: null,
    searchedProducts: []
  }),
  watch: {
    search(newValue, oldValue) {
      if (newValue !== oldValue) {
        if (newValue && newValue !== "") {
          this.isLoading = true
            setTimeout(() => {
              this.searchProducts()
            }, 5000)
          }
        }
    }
  },
  methods: {
    timeout(ms) {
      return new Promise(resolve => setTimeout(() => { resolve }, ms))
    },

    async searchProducts() {
      try {
        // TODO: When the user types a search query, implement it also
        // in the url for seo purposes
        var response = await this.$axios.get('/shop/search', { params: { q: this.search } })
        this.searchedProducts = response.data
        this.isLoading = false
      } catch(error) {
        console.log('search', error)
      }
    }
  }
}
</script>

<style scoped>
#search {
  position: absolute;
  top: 0;
  left: 0;
  background-color: white;
  height: auto;
  min-height: 300px;
  width: 100%;
  padding: 3rem;
  overflow: hidden;
}
</style>
