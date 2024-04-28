<template>
  <shop-layout>
    <section class="container-fluid">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-none mb-1">
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <h1 class="text-uppercase fw-bold text-center">Soutien-Gorge corbeille</h1>

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
          <default-filtering @update-grid-size="handleGridSize" />
        </div>

        <div class="col-12">
          <suspense>
            <template #default>
              <async-product-items :grid-size="currentGridSize" @update-products="handleSEO" />
            </template>

            <template #fallback>
              <loading-product-items />
            </template>
          </suspense>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script>
import _ from 'lodash'
import { ref } from 'vue'
import { useHead } from 'unhead'
import { defineAsyncComponent } from 'vue'
import { defineProduct, useSchemaOrg } from '@unhead/schema-org'

import LoadingProductItems from 'components/products/LoadingProductItems.vue'
import DefaultFiltering from 'components/products/filtering/DefaultFiltering.vue'

export default {
  name: 'ProductsPage',
  components: {
    DefaultFiltering,
    LoadingProductItems,
    AsyncProductItems: defineAsyncComponent({
      loader: async () => import('components/products/ProductItems.vue')
    })
  },
  setup () {
    useHead({
      title: 'Collection name',
      description: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: 'https://example.com/image.png',
      twitterCard: 'summary_large_image',
      ogSiteName: 'Ma Boutique'
    })

    useSchemaOrg([

    ])
    
    const currentGridSize = ref(4)
    
    return {
      currentGridSize
    }
  },
  methods: {
    handleGridSize (size) {
      this.currentGridSize = size
    },
    handleSEO (products) {
      useSchemaOrg(_.map(products, (product) => {
        return defineProduct({
          name: product.name,
          offers: [
            {
              price: product.price
            }
          ]
        })
      }))
    }
  }
}
</script>
