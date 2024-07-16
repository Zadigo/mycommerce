<template>
  <shop-layout>
    <section class="container-fluid my-5">
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
          <default-filtering :products="products" @update-grid-size="handleGridSize" />
        </div>

        <div class="col-12">
          <suspense>
            <template #default>
              <async-product-items :grid-size="currentGridSize" @update-products="handleProducts" />
            </template>

            <template #fallback>
              <loading-product-items />
            </template>
          </suspense>
        </div>

        <div class="col-8 offset-md-2 h1 fw-bold text-center p-5">
          No products
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
// import { defineProduct, useSchemaOrg } from '@unhead/schema-org'

import DefaultFiltering from 'src/components/products/filtering/DefaultFiltering.vue'
import LoadingProductItems from 'src/components/products/LoadingProductItems.vue'

export default {
  name: 'ProductsPage',
  components: {
    DefaultFiltering,
    LoadingProductItems,
    AsyncProductItems: defineAsyncComponent({
      loader: () => import('src/components/products/ProductItems.vue'),
      delay: 1000
    })
  },
  setup () {
    const products = ref({})
    const productsLoading = ref(true)
    const currentGridSize = ref(4)

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
      productsLoading,
      currentGridSize
    }
  },
  beforeMount() {
    if (this.$session.keyExists('grid-size')) {
      this.currentGridSize = this.sessionStorage.retrieve('grid-size')
    }
  },
  methods: {
    handleGridSize (size) {
      // Changes the size of the grid to
      // reduce or increase the amount of
      // products displayed on the screen
      this.currentGridSize = size
      this.$session.create('grid-size', size)
    },
    handleProducts (products) {
      // Returns the products from the child
      // component to the parent so that we
      // can process them e.g. SEO here
      this.products = products
      this.productsLoading = false
      // this.handleSEO()
    },
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
