<doc>
  Shows the list of poducts available in the shop
</doc>

<template>
  <section id="collection" class="ecommerce-section">
    <div class="container-fluid">
      <div class="row">
        <div class="col-12">
          <h2 class="text-center w-100 mb-3">
            {{ capitalizeFirstLetter($route.params.collection) }}
          </h2>

          <!-- Filters -->
          <filters-bar style="z-index:20;" @loading-products-start="isLoading = true" @loading-products-end="isLoading = false" />
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

        <!-- TODO: Prefer Suspense ?? -->
        <!-- <products-wrapper-vue /> -->
        <async-products-wrapper-vue />
        <!-- <suspense>

          <template #fallback>
            <collection-view1 />
          </template>
        </suspense> -->

        <hr class="mt-5 mb-2">

        <!-- Pagination -->
        <pagination-row :product-count="searchedProductsCount" />

        <!-- Ad -->
        <div class="col-12 my-6">
          <router-link :to="{ name: 'shop_view', params: { lang: $i18n.locale } }">
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
import { capitalizeFirstLetter } from '@/utils'

import FiltersBar from '@/components/shop/products/FiltersBar.vue'
import PaginationRow from '@/components/shop/products/PaginationRow.vue'
// import ProductsWrapperLoadingVue from '@/components/shop/products/ProductsWrapperLoading.vue'
// import ProductsWrapperVue from '../../components/shop/products/ProductsWrapper.vue'
// import CollectionView1 from '../../components/skeletons/CollectionView.vue'

export default {
  name: 'CollectionView',
  components: {
    // ProductsWrapperVue,
    AsyncProductsWrapperVue: defineAsyncComponent({
      // TODO: Rename ProductItems -> ProductsWrapper
      loader: () => import('@/components/shop/products/ProductsWrapper.vue'),
      // loadingComponent: ProductsWrapperLoadingVue,
      delay: 500
      // errorComponent: ProductsWrapperLoadingVue,
      // timeout: 5000
    }),
    FiltersBar,
    PaginationRow
    // CollectionView1
  },
  setup () {
    return {
      capitalizeFirstLetter
    }
  },
  computed: {
    searchedProductsCount () {
      // Since the product count will change in the
      // child component as the user filters/sorts, 
      // products, use it's internal count to display 
      // additional information here
      // console.log(this.$refs.products.sortedProducts)
      // return this.$refs.products.sortedProducts.length
      return 0
    }
  }
}
</script>
