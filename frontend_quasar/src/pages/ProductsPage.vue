<template>
  <q-page padding>
    <table-page-component page-name="Products">
      <q-card>
        <q-card-section>
          <q-table v-model:selected="requestData.selected" :columns="productColumns" :rows="searchedProducts" :loading="loading" row-key="id" selection="multiple" flat>
            <template v-slot:top>
              <q-input v-model="search" borderless dense debounce="300" color="primary">
                <template v-slot:prepend>
                  <q-icon name="search" />
                </template>
              </q-input>

              <q-space />

              <q-btn @click="uploadProductsFile">Upload file</q-btn>
              <q-btn :to="{ name: 'images_view' }" color="primary" icon="fas fa-image" label="Images" unelevated rounded />
              <q-btn :to="{ name: 'product_view', params: { id: 1 } }" color="primary" icon="fas fa-plus" label="Create" unelevated rounded />
              <q-btn color="primary" :disable="loading" label="Add row" unelevated rounded />
              <q-btn class="q-ml-sm" color="primary" :disable="loading" label="Remove row" unelevated rounded />
            </template>

            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                <router-link :to="{ name: 'product_view', params: { id: props.row.id }, query: { id: props.row.id } }">
                  {{ props.row.id }}
                </router-link>
              </q-td>
            </template>

            <template v-slot:body-cell-active="props">
              <q-td :props="props">
                <q-badge v-if="props.row.active" color="green-3" label="Active"></q-badge>
                <q-badge v-else color="red-3" label="Inactive"></q-badge>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>

      <!-- Modals -->

      <q-dialog v-model="showUploadProductsFile">
        <q-card style="width: 400px;">
          <q-card-section>

          </q-card-section>

          <q-separator></q-separator>

          <q-card-section>
            <q-form @submit.prevent>
              <q-file v-model="productsFile" outlined label="Outlined" accept=".json, .csv" />
            </q-form>
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat>
              Cancel
            </q-btn>

            <q-btn color="primary" @click="uploadProductsFile">
              <q-spinner-cube size="xs" color="white" class="q-mr-sm" />
              Upload
            </q-btn>
          </q-card-actions>
        </q-card>
      </q-dialog>
    </table-page-component>
  </q-page>
</template>

<script>
import _ from 'lodash'
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useShop } from '../stores/shop'
import TablePageComponent from '../components/TablePageComponent.vue'


const productColumns = [
  {
    name: 'id',
    label: 'ID',
    field: row => row.id,
    sortable: true
  },
  {
    name: 'name',
    label: 'Name',
    field: row => row.name,
    sortable: true
  },
  {
    name: 'unit_price',
    label: 'Unit price',
    field: row => row.unit_price,
    sortable: true
  },
  {
    name: 'active',
    label: 'Active',
    field: row => row.active,
    sortable: true
  }
]

export default {
  name: 'ProductsPage',
  components: {
    TablePageComponent
  },
  setup () {
    const store = useShop()
    const { products } = storeToRefs(store)
    const search = ref(null)
    const loading = ref(true)
    const requestData = ref({
      selected: []
    })

    const showUploadProductsFile = ref(false)
    const productsFile = ref(null)
    
    return {
      search,
      loading,
      requestData,
      productsFile,
      showUploadProductsFile,
      productColumns,
      products
    }
  },
  computed: {
    searchedProducts () {
      // Allows us to search products in the database
      if (this.search === null || this.search === "") {
        return this.products
      } else {
        return _.filter(this.products, (product) => {
          return (
            product.name.toLowerCase() === this.search ||
            product.name.includes(this.search)
          )
        })
      }
    }
  },
  beforeMount () {
    this.requestProducts()
  },
  methods: {
    async requestProducts () {
      // Get all the products from the database
      try {
        const response = await this.$api.get('shop/products?admin=true')
        
        this.products = response.data
        this.$session.create('products', this.products)

        setTimeout(() => {
          this.loading = false
        }, 1000)
      } catch (e) {
        console.log(e)
      }
    },
    async uploadProductsFile () {
      try {
        const response = await this.$api.post('shop/products/upload')
        response
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>
