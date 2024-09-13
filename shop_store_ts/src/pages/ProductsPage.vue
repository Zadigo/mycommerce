<template>
  <shop-layout>
    <section class="container-fluid section-margin">
      <div class="row">
        <div class="col-12">
          <div class="card shadow-none">
            <div class="card-body pb-1 d-flex flex-row justify-content-start">
              <h1 :aria-labelledby="$route.params.id" class="text-uppercase fw-bold h4">
                {{ $route.params.id }}
              </h1>
            </div>
          </div>
        </div>

        <div class="col-12">
          <suspense>
            <template #default>
              <async-products-feed @update-products="handleProductsLoaded" />
            </template>

            <template #fallback>
              <loading-products-feed />
            </template>
          </suspense>
        </div>

        <div v-if="products.length === 0" class="col-6 offset-md-3 text-center p-5">
          <p class="h4 fw-light">
            {{ $t('Page not available text') }}
          </p>

          <v-btn :to="{ name: 'shop_products_collection', params: { id: 'all' } }" class="mt-3" color="secondary" variant="tonal" rounded>
            {{ $t('Voir toute la collection') }}
          </v-btn>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script lang="ts">
import { Product } from '@/types/shop';
import { useUtilities } from 'src/composables/utils';
import { useAuthentication } from 'src/stores/authentication';
import { useHead } from 'unhead';
import { defineAsyncComponent, defineComponent, provide, ref } from 'vue';
import { useRoute } from 'vue-router';

import LoadingProductsFeed from '@/components/products/LoadingProductsFeed.vue';
import ShopLayout from '@/layouts/ShopLayout.vue';

export default defineComponent({
  name: 'ProductsPage',
  components: {
    AsyncProductsFeed: defineAsyncComponent({
      loader: () => import('@/components/products/AsyncProductsFeed.vue'),
      delay: 1000
    }),
    LoadingProductsFeed,
    ShopLayout
  },
  setup () {
    const { capitalizeFirstLetter } = useUtilities()

    const route = useRoute()
    const products = ref<Product[]>([])
    const productsLoading = ref(true)
    const authenticationStore = useAuthentication()

    provide('productsLoading', productsLoading)

    const pageHead = useHead({
      title: capitalizeFirstLetter(route.params.id),
      description: '',
      ogTitle: capitalizeFirstLetter(route.params.id),
    })

    return {
      pageHead,
      products,
      capitalizeFirstLetter,
      authenticationStore,
      productsLoading
    }
  },
  methods: {
    /**
     * Returns the products from the child
     * component to the parent so that we
     * can process them e.g. SEO here
     */
    handleProductsLoaded (products: Product[]) {
      this.products = products
      this.productsLoading = false
    }
  }
})
</script>
