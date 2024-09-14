<template>
  <shop-layout>
    <section id="product" class="container-fluid" style="margin-top: 2%;">
      <!-- Product -->
      <div class="row gy-1">
        <div id="product-information" class="col-12">
          <div class="row row-cols-5">
            <div id="product-images" class="col-6">
              <div id="main-image">
                <v-img :src="parseMainImage(currentProduct)" :lazy-src="parseMainImage(currentProduct)" :alt="currentProduct.name" />
              </div>
            </div>
            
            <!-- Aside -->
            <product-aside />
          </div>
        </div>

        <!-- More Product Images -->
        <component :is="imageComponent" :images="currentProduct.images" />
      </div>

      <!-- More Products -->
      <div ref="moreProductsIntersect" class="row g-1 my-5">
        <div id="more-products" class="col-12">
          <suspense>
            <template #default>
              <async-recommendation-block :quantity="30" />
            </template>

            <template #fallback>
              <loading-recommendations-block :quantity="30" />
            </template>
          </suspense>
        </div>
      </div>
    </section>
  </shop-layout>
</template>

<script lang="ts">
import 'vue-image-zoomer/dist/style.css'

import { useCompany } from '@/composables/company'
import { useIntersectionObserver } from '@vueuse/core'
import { mapActions, storeToRefs } from 'pinia'
import { useShopComposable, useShopUtilities } from 'src/composables/shop'
import { client } from 'src/plugins/axios'
import { useAuthentication } from 'src/stores/authentication'
import { useCart } from 'src/stores/cart'
import { useShop } from 'src/stores/shop'
import { useHead } from 'unhead'
import { defineAsyncComponent, defineComponent, inject, provide, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import AdditionalInfoBlock from '@/components/product/AdditionalInfoBlock.vue'
import BreadcrumbBlock from '@/components/product/BreadcrumbBlock.vue'
import ReviewsBlock from '@/components/product/ReviewsBlock.vue'
import DeliveryType from 'src/components/product/DeliveryType.vue'
import DeliveryTypes from 'src/components/product/DeliveryTypes.vue'
import FiveImages from 'src/components/product/FiveImages.vue'
import LoadingRecommendationsBlock from 'src/components/LoadingRecommendationsBlock.vue'
import ProductAside from '@/components/product/ProductAside.vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import SixImages from 'src/components/product/SixImages.vue'

import { Product } from '@/types/shop'

export default defineComponent({
  name: 'ProductPage',
  components: {
    AdditionalInfoBlock,
    AsyncRecommendationBlock: defineAsyncComponent({
      loader: () => import('src/components/RecommendationsBlock.vue'),
      delay: 500
    }),
    BreadcrumbBlock,
    DeliveryType,
    DeliveryTypes,
    FiveImages,
    LoadingRecommendationsBlock,
    ReviewsBlock,
    ShopLayout,
    SixImages,
    ProductAside
    // VueImageZoomer,
  },
  setup () {
    const { locale } = useI18n()
    const { createTitle } = useCompany()
    const documentVisible = inject('documentVisible')

    const isLoading = ref(true)
    // Interceptor to check that the user has moved
    // down to the the "more-products" section of
    // the product page
    const intersectionTarget = ref<HTMLElement>()

    const { localImagePath, parseMainImage } = useShopUtilities()

    const { isLiked, handleLike } = useShopComposable()

    const authenticationStore = useAuthentication()
    const shopStore = useShop()

    const cartStore = useCart()
    const { showAddedProductDrawer } = storeToRefs(cartStore)

    const route = useRoute()
    const router = useRouter()
    const currentProduct = ref<Product | object>({})
    const productVariants = ref([])

    provide('currentProduct', currentProduct)
    provide('isLoading', isLoading)

    /**
     * Request the details of the given product
     * from the backend. This dos not use products
     * that were preloaded in the products page but
     * requests the product details on each page just
     * like would do a static page
     */
    async function requestProduct () {
      try {
        const response = await client.get(`shop/products/${route.params.id}`)
        currentProduct.value = response.data
        isLoading.value = false
      } catch (e) {
        if (e.response.status === 404) {
          router.push({ name: 'not_found' })
        }
      }
    }

    useIntersectionObserver(intersectionTarget, ([{ isIntersecting }], observerElement) => {
      observerElement
      isIntersecting
    })

    useHead({
      meta: [
        {
          name: 'language',
          content: locale.value
        }
      ]
    })

    return {
      documentVisible,
      intersectionTarget,
      cartStore,
      shopStore,
      showAddedProductDrawer,
      currentProduct,
      authenticationStore,
      isLiked,
      isLoading,
      productVariants,
      requestProduct,
      createTitle,
      parseMainImage,
      localImagePath,
      handleLike
    }
  },
  computed: {
    /**
     * Returns the proper image component to display
     * the remaining images for the given product
     */
    imageComponent (): 'five-images' | 'six-images' {
      if ('images' in this.currentProduct) {
        if (this.currentProduct.images.length === 6) {
          return 'six-images'
        } else if (this.currentProduct.images.length === 5) {
          return 'five-images'
        }
      }
      return 'six-images'
    },
    /**
     * Indicates if the product has other color variants     * 
     */
    // FIXME: currentProduct.variants exists?
    hasColorVariants (): boolean {
      if ('variants' in this.currentProduct) {
        const variants = this.currentProduct.variants.filter((product) => {
          return product.id !== this.currentProduct.id
        })
        return variants.length > 0
      } else {
        return false
      }
    }
  },
  watch: {
    '$route.params.id' (n, o) {
      if (n !== o) {
        this.requestProduct()
        this.addToHistory(this.currentProduct)
      }
    },
    documentVisible (n) {
      // Instead of sending each store statistics
      // at once, use a debouncing function
      if (n !== 'visible') {
        this.handleSendingStatistics()
      }
    }
  },
  created () {
    this.isLiked = this.localStorageData.likedProducts.includes(this.$route.params.id * 1)
    this.requestProduct()
    this.addToHistory(this.currentProduct)
  },
  mounted () {
    const targetEl = this.$refs.moreProductsIntersect as HTMLElement | undefined
    if (targetEl) {
      this.intersectionTarget = targetEl
    }
  },
  methods: {
    ...mapActions(useShop, ['addToHistory']),
    /**
     * Handles the action of keeping track 
     * of the products that were viewed by
     * the user during his session
     */
    // async handleViewingHistory () {
    //   this.addToHistory(this.currentProduct)
    // },
    /**
     * Sends the statistics to the backend for products
     * that were visited by the user to the backend
     */
    async handleSendingStatistics () {
      // TODO: We need to send these statistics ONLY if
      // if there are products to be sent and ONLY IF there's
      // a change the existing visited products array that we
      // have stored in the session
      if (this.localStorageData.visitedProducts.length > 0) {
        console.log('User left the screen send visitedPages statistics')
      }
    },
  }
})
</script>

<style scoped>
.variant {
  cursor: pointer;
}

#btn-add-to-cart {
  width: 200px;
}

#variants .router-link-exact-active img {
  border: 1px solid black;
}

.products-wrapper {
  height: 300px;
  widows: 100%;
  overflow-y: scroll
}

.products-wrapper::-webkit-scrollbar {
  display: none;
}

p[aria-label="Product reference"] {
  font-size: 0.8rem;
}

.fw-ecommerce-small-1 {
  font-size: 0.9rem;
}

h1 {
  font-size: 1.3rem;
}

#product-main-image {
  position: relative;
}

#main-image {
  position: sticky;
  top: 0;
  left: 0;
}

.v-skeleton-loader__image {
  height: 655px;
}
</style>
