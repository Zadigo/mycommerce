<template>
  <base-modal-vue id="modal-search" :show="showSearchModal" :scrollable="true" size="fullscreen" @close="showSearchModal = false">
    <div class="container">
      <div class="row">
        <div class="col-10 offset-md-1">
          <base-input id="search" :placeholder="$t('Search')" @update:initial="runSearch" />
          
          <nav class="navbar my-3"></nav>

          <div v-if="products.length > 0" class="row">
            <div v-for="product in products" :key="product.id" class="col-3">
              <product-card :product="product" @product-card-click="showSearchModal = false" />
            </div>
          </div>

          <div v-else class="row">
            <div class="col-10">
              <div class="my-3">
                <h4 class="text-center">
                  Votre recherche n’a donné aucun résultat. 
                </h4>
                <h4 class="text-center">
                  Vérifiez l’orthographe ou essayez un autre terme
                </h4>
              </div>

              <h4 class="my-3 text-center">
                {{ $t('You may also like') }}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </div>
  </base-modal-vue>
</template>

<script>
import { useShop } from '@/store/shop'
import { storeToRefs } from 'pinia'

import BaseModalVue from '@/layouts/bootstrap/BaseModal.vue'
import BaseInput from '@/layouts/bootstrap/BaseInput.vue'
import ProductCard from '@/components/shop/products/ProductCard.vue'

export default {
  name: 'ModalSearch',
  components: {
    BaseModalVue,
    BaseInput,
    ProductCard
  },
  setup () {
    const store = useShop()
    const { showSearchModal } = storeToRefs(store)
    return {
      showSearchModal
    }
  },
  data () {
    return {
      products: []
    }
  },
  methods: {
    async runSearch (value) {
      try {
        const result = await this.$http.get('shop/search', { params: { q: value } })
        this.products = result.data
      } catch (error) {
        console.log('Failed for search')
      }
    }
  }
}
</script>
