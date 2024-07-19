<template>
  <shop-layout>
    <section class="container-fluid space-section">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-none mb-1">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <h1 aria-labelledby="" class="text-uppercase fw-bold text-center">
                Soutien-Gorge corbeille
              </h1>

              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item">
                    <router-link :to="{ name: 'shop_products' }">
                      Shop
                    </router-link>
                  </li>
                  
                  <li class="breadcrumb-item active" aria-current="page">
                    Soutien-Gorge
                  </li>
                </ol>
              </nav>
            </div>
          </div>
        </div>

        <div class="col-12">
          <suspense>
            <template #default>
              <async-products-feed @update-products="handleProducts" />
            </template>

            <template #fallback>
              <loading-products-feed />
            </template>
          </suspense>
        </div>

        <div v-if="products.length === 0" class="col-6 offset-md-3 text-center p-5">
          <p class="h4 fw-light">Cette page n'est pas disponible, mais nous en avons beaucoup d'autres à te montrer.</p>
          <v-btn :to="{ name: 'shop_products_collection', params: { id: 'all' } }" class="mt-3" color="secondary" variant="tonal" rounded>
            Haut de page
          </v-btn>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script>
// import _ from 'lodash'
// import { useHead } from 'unhead'
import { ref, provide } from 'vue'
import { defineAsyncComponent } from 'vue'
import { useAuthentication } from 'src/stores/authentication'
// import { defineProduct, useSchemaOrg } from '@unhead/schema-org'

// import DefaultFiltering from 'src/components/products/filtering/DefaultFiltering.vue'
import LoadingProductsFeed from '@/components/products/LoadingProductsFeed.vue'

export default {
  name: 'ProductsPage',
  components: {
    // DefaultFiltering,
    AsyncProductsFeed: defineAsyncComponent({
      loader: () => import('src/components/products/AsyncProductsFeed.vue'),
      delay: 1000
    }),
    LoadingProductsFeed
  },
  setup () {
    const products = ref({})
    const productsLoading = ref(true)
    const authenticationStore = useAuthentication()

    provide('productsLoading', productsLoading)

    // useHead({
    //   title: 'Collection name',
    //   description: '',
    //   ogTitle: '',
    //   ogDescription: '',
    //   ogImage: 'https://example.com/image.png',
    //   twitterCard: 'summary_large_image',
    //   ogSiteName: 'Ma Boutique'
    // })
    
    return {
      products,
      authenticationStore,
      productsLoading
    }
  },
  beforeMount () {
    // Some pages will redirect to this page indicating
    // that login is required via the ?login=0 query
    // DEBUG: Does not get the query
    // console.log('mounted', this.$route.query)
    // if (this.$route.query.login === 0) {
    //   this.authenticationStore.showLoginDrawer = true
    // }
  },
  methods: {
    /**
     * Returns the products from the child
     * component to the parent so that we
     * can process them e.g. SEO here
     * 
     * @param {Array} products 
     */
    handleProducts (products) {
      this.products = products
      this.productsLoading = false
      // this.handleSEO()
    }
    // TODO: Implement the Schema for products
    // handleSEO () {
    //   useSchemaOrg(_.map(this.products, (product) => {
    //     return defineProduct({
    //       name: product.name,
    //       offers: [
    //         {
    //           price: product.price
    //         }
    //       ]
    //     })
    //   }))
    // }
  }
}
</script>
