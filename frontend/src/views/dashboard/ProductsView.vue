<template>
  <section>
    <base-card>
      <template #header>
        <base-input id="search" input-type="search" @update:initial="(value) => { search = value }" />
        <base-dropdown-button id="actions" :items="actions" />
      </template>

      <template #body>
        <!-- Table -->
        <div class="list-group">
          <router-link v-for="product in searchedProducts" :key="product.id" :to="{ name: 'dashboard_product_view', params: { id: product.id, lang: $i18n.locale }}" class="list-group-item list-group-item-action">
            {{ product.id }} / {{ product.name }}
          </router-link>
        </div>
      </template>
    </base-card>

    <base-modal id="rename" :show="renameProductsModal">
      <div class="container">

      </div>
    </base-modal>
  </section>
</template>

<script>
import _ from 'lodash'
import { useDashboard } from '@/store/dashboard'
import { storeToRefs } from 'pinia'
// import { mapState } from 'vuex'
// import { searchHelper } from '@/utils'
// import PageContent from '@/layouts/dashboard/PageContent.vue'
import BaseCard from '@/layouts/bootstrap/cards/BaseCard.vue'
import BaseDropdownButton from '@/layouts/bootstrap/BaseDropdownButton.vue'
import BaseInput from '@/layouts/bootstrap/BaseInput.vue'
import BaseModal from '@/layouts/bootstrap/BaseModal.vue'

export default {
  name: 'DashboardProductsView',
  components: {
    BaseCard,
    BaseDropdownButton,
    BaseInput,
    BaseModal
  },
  setup () {
    const store  = useDashboard()
    const { products } = storeToRefs(store)
    return {
      products
    }
  },
  data () {
    return {
      search: null,
      newProductsName: null,
      selectedProducts: [],
      renameProductsModal: false,

      actions: [
        {
          name: 'Activate'
        },
        {
          name: 'Deactivate'
        },
        {
          name: 'Rename'
        },
        {
          name: 'Delete'
        }
      ]
    }
  },
  // data: () => ({
  //   // products: [],
  //   headers: [
  //     {
  //       text: 'ID',
  //       align: 'start',
  //       sortable: true,
  //       value: 'id'
  //     },
  //     {
  //       text: 'Nom du produit',
  //       align: 'start',
  //       sortable: true,
  //       value: 'name'
  //     },
  //     {
  //       text: 'Actif',
  //       align: 'start',
  //       sortable: true,
  //       value: 'active'
  //     }
  //   ]
  // }),
  
  computed: {
    searchedProducts () {
      if (this.search) {
        return _.filter(this.products, (product) => {
          return product.name.includes(this.search)
        })
      }
      return this.products
    }
  //   ...mapState('dashboardModule', ['products']),
  //   searchedProducts() {
  //     return searchHelper(this.search, this.products, ['name'])
  //   },
  //   hasSelection () {
  //     return this.selectedProducts.length > 0
  //   },
  //   selectedProductsIds () {
  //     return _.map(this.selectedProducts, (product) => {
  //       return product.id
  //     })
  //   }
  },
  beforeMount() {
    this.getProducts()
  },
  methods: {
    async getProducts() {
      try {
        // TODO: Check for when pagination is integrated
        const response = await this.$http.get('shop/dashboard/products')
        this.products = response.data
      } catch(error) {
        console.log(error)
      }
    }
  //   async renameProducts() {
  //     var data = {
  //       name: this.newProductsName,
  //       products: this.selectedProducts
  //     }
  //     try {
  //       var response = await this.axios.post('/dashboard/products/rename', data)
  //       response
  //       this.renameProductsModal = false
  //     } catch(error) {
  //       console.log(error)
  //     }
  //   },
  //   async activateProducts() {
  //     try {
  //       var productIds = this.selectedProducts.map((product) => {
  //         return product.id
  //       })
  //       var response = await this.axios.post('shop/dashboard/products/activate', { products: productIds })
  //       this.$store.commit('dashboardModule/selectiveProductUpdates', response.data)
  //       this.selectedProducts = []
  //     } catch(error) {
  //       console.log(error)
  //     }
  //   },
  //   async deactivateProducts() {
  //     try {
  //       var productIds  = this.selectedProducts.map((product) => {
  //         return product.id
  //       })
  //       var response = await this.axios.post('shop/dashboard/products/deactivate', { products: productIds })
        
  //       this.$store.dispatch('dashboardModule/selectiveProductUpdates', response.data)
  //       this.selectedProducts = []
  //     } catch(error) {
  //       console.log(error)
  //     }
  //   },
  //   getColor (state) {
  //     if (state) {
  //       return 'green'
  //     } else {
  //       return 'red'
  //     }
  //   }
  }
}
</script>
