<template>
  <section id="collection" class="ecommerce-section">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <!-- Filters -->
          <filters-bar @loading-products-start="isLoading=true" @loading-products-end="isLoading=false" />          
        </div>

        <!-- FIXME: This gets displayed before the products are shown
        because the array is initially 0 -->
        <!-- <div v-if="sortedProducts.length == 0" class="col-12">
          <div class="col-md-12 text-center py-8">
            <v-icon class="mb-3" size="70">mdi-emoticon-sad-outline</v-icon>
            <h2 class="p-1 mb-5 font-weight-bold">{{ $t('No products found') }}</h2>

            <div class="row">
              <div class="col-12">
                <base-pagination-button>
                  <v-icon class="mr-2">mdi-refresh</v-icon>
                  {{ $t('Refresh page') }}
                </base-pagination-button>
              </div>
            </div>
          </div>
        </div> -->

        <!-- TODO: Add a Suspense -->
        <async-product-items ref="products" style="z-index:-2;" />
        
        <hr class="mt-5 mb-2">

        <!-- Pagination -->
        <pagination-row :product-count="searchedProductsCount" />
          
        <!-- Ad -->
        <div class="col-12 my-6">
          <router-link :to="{ name: 'home_view', lang: $i18n.locale }">
            <!-- TODO: Emit a PageView when clicking on this section -->
            <img src="https://img.ltwebstatic.com/images3_acp/2022/02/25/164578700614872218156e3ff9868de22e7c67a145.webp" class="img-fluid" />
          </router-link>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { defineAsyncComponent } from 'vue'

import PaginationRow from '@/components/shop/products/PaginationRow.vue'
import ProductItemsLoadingVue from '@/components/shop/products/ProductItemsLoading.vue'
import FiltersBar from '@/components/shop/products/FiltersBar.vue'

export default {
  name: 'CollectionView',
  components: {
    // Asynchronously load the section that iterates
    // on the products to prevent blocking the whole
    // collection page
    AsyncProductItems: defineAsyncComponent({
      loader: () => import('@/components/shop/products/ProductItems.vue'),
      loadingComponent: ProductItemsLoadingVue,
      delay: 300
    }),
    FiltersBar,
    PaginationRow
  },
  computed: {
    searchedProductsCount() {
      // Since the product count will change in the
      // child component as the user filters/sorts, 
      // products, use it's internal count to display 
      // additional information here
      // return this.$refs.products.sortedProducts.length
      return 0
    }
  }
}
</script>
