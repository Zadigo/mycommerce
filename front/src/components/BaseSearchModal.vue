<template>
  <transition name="search-transition">
    <div v-if="showSearchModal" id="search">
      <div class="container">
        <div class="row">
          <div class="col-12 d-flex justify-content-around">
            <v-text-field v-model="search" :placeholder="$t('Search')" type="text" outlined hide-details></v-text-field>

            <v-btn text x-large @click="showSearchModal=false">
              <v-icon class="mr-2">mdi-close</v-icon>
            </v-btn>
          </div>
        </div>

        <v-row>
          <v-col v-for="product in searchedProducts" :key="product.id" cols="3">
            <card :product="product" :is-loading="isLoading" @product-card-click="showSearchModal=false" />
          </v-col>
        </v-row>
      </div>
    </div>
  </transition>
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
  computed: {
    showSearchModal: {
      get() { return this.$store.state.showSearchModal },
      set() { this.$store.commit('toggleSearchModal') }
    }
  },
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
    async searchProducts() {
      try {
        // TODO: When the user types a search query, implement it also
        // in the url for seo purposes
        var response = await this.axios.get('/shop/search', { params: { q: this.search } })
        this.searchedProducts = response.data
        this.isLoading = false
      } catch(error) {
        console.log('search', error)
      }
    },

    timeout(ms) {
      return new Promise(resolve => setTimeout(() => { resolve }, ms))
    }
  }
}
</script>

<style scoped>
#search {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: white;
  height: 100vh;
  min-height: 300px;
  width: 100%;
  padding: 3rem;
  overflow-y: scroll;
}

.search-transition-enter-active,
.search-transition-leave-active {
  transition: all .3s cubic-bezier(0.95, 0.05, 0.795, 0.035);
}

.search-transition-enter,
.search-transition-leave-to {
  opacity: 0;
  transform: translateY(-50%);
}

.search-transition-leeave,
.search-transition-enter-to {
  opacity: 1;
  transform: translateY(0%);
}
</style>
