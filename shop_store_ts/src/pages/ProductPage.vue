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

            <div id="product-aside" class="col-4 ms-5 mt-4">
              <!-- Breadcrumb -->
              <breadcrumb-block />

              <!-- Information -->
              <h1 class="h3 fw-light" aria-label="Product name">
                {{ currentProduct.name }}
              </h1>

              <!-- Reference -->
              <p class="fw-light text-body-secondary mb-2" aria-label="Product reference">
                Ref. 3970/623/800
              </p>

              <!-- Price -->
              <v-skeleton-loader :loading="isLoading" type="text" style="margin-left: 0;">
                <p class="h5 fw-bold mb-3" aria-label="Product price">
                  {{ translatePrice(currentProduct.get_price) }}
                </p>
              </v-skeleton-loader>

              <!-- Reviews -->
              <reviews-block />

              <!-- Variants -->
              <div v-if="hasColorVariants" id="variants" class="d-flex justify-content-start align-items-center gap-1 my-4">
                <div v-for="variant in currentProduct.variants" :key="variant.id" class="variant">
                  <router-link :to="{ name: 'shop_product', params: { id: variant.id } }" :aria-label="`${variant.name} ${variant.color}`">
                    <v-img :src="parseMainImage(variant, 'original')" :lazy-src="parseMainImage(variant, 'original')" :alt="variant.color" width="50" />
                  </router-link>
                </div>
              </div>

              <hr class="my-5 text-body-tertiary">

              <!-- Sizes -->
              <base-size-block :sizes="currentProduct.sizes" @update-size="(size) => { userSelection.size = size }" @show-size-guide-drawer="sizeGuideDrawer=true" />

              <!-- Size Guide -->
              <div class="d-flex justify-content-start gap-3 mt-4 mb-2">
                <a href class="btn btn-light btn-rounded fw-bold shadow-none" @click.prevent="sizeGuideDrawer = true">
                  <font-awesome-icon icon="ruler" class="me-2" /> {{ $t('Guide des tailles') }}
                </a>
              </div>

              <transition id="choose-size" tag="div" name="opacity">
                <p v-if="showSizeSelectionWarning" class="text-danger fs-6 fw-light mb-1">
                  {{ $t("Tu dois sélectionner une taille") }}
                </p>
              </transition>

              <div class="actions d-flex justify-content-start gap-1">
                <!-- TODO: Make as a reusable component -->
                <button id="btn-add-to-cart" type="button" class="btn btn-primary btn-lg shadow-none btn-rounded" aria-label="Add to cart" @click="handleAddToCart">
                  {{ $t('Ajouter au panier') }}
                </button>

                <button type="button" class="btn btn-lg shadow-none btn-rounded btn-light" aria-label="Like product" @click="handleLike(currentProduct)">
                  <font-awesome-icon v-if="isLiked" :icon="['fas', 'heart']" />
                  <font-awesome-icon v-else :icon="['far', 'heart']" />
                </button>
              </div>

              <!-- Delivery Types -->
              <delivery-type>
                <delivery-types icon-name="shop" text="Enlèvement en magasin" />
                <delivery-types icon-name="truck" text="Livraison standard à domicile" />
              </delivery-type>
              
              <!-- Additional Information -->
              <additional-info-block />
            </div>
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

      <!-- Modals -->
      <!-- Size Guide -->
      <teleport to="body">
        <v-navigation-drawer id="size-guide-modal" v-model="sizeGuideDrawer" width="400" location="right" temporary>
          <v-toolbar class="border-bottom" color="white">
            <v-toolbar-title class="fw-bold">
              {{ $t("Guide des tailles") }}
            </v-toolbar-title>

            <v-spacer />

            <v-btn icon="mdi-close" @click="sizeGuideDrawer = false" />
          </v-toolbar>

          <div class="container my-4">
            <div class="row g-1">
              <div class="col-12">
                <p class="fs-6 fw-bold mb-1">
                  {{ $t("Sélectionne une taille") }}
                </p>
                
                <base-size-block :sizes="currentProduct.sizes" @update-size="(size) => { userSelection.size = size }" @show-size-guide-drawer="sizeGuideDrawer = true" />

                <p class="fs-6 fw-bold mt-4 mb-1">
                  {{ $t("Mensurations") }}
                </p>

                <p class="fw-light text-body-secondary text-uppercase">
                  {{ $t("Corps") }}
                </p>

                <div class="sizes">
                  <div class="d-flex justify-content-between align-items-center">
                    <div class="col-auto">
                      {{ $t("Tour de Poitrine") }}
                    </div>
                    
                    <div class="col-auto">
                      82
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-12 mt-4">
                <v-btn color="primary" block @click="handleAddToCart">
                  {{ $t('Ajouter au panier') }}
                </v-btn>
              </div>

              <div class="col-12 mt-4">
                <p class="fs-6 fw-bold">
                  {{ $t("Comprendre tes mesures ?") }}
                </p>

                <v-img :src="localImagePath('size-guide.jpg')" :lazy-src="localImagePath('size-guide.jpg')" :width="300" />
              </div>

              <div class="col-12 mt-4">
                <p class="fs-6 fw-bold mb-1">
                  {{ $t("Tour de Poitrine") }}
                </p>
                <p class="fw-light text-body-secondary mb-4">
                  Pour mesurer la circonférence de ta poitrine, utilise un mètre
                  ruban et place-le autour de la partie la plus large de ta poitrine.
                </p>

                <p class="fs-6 fw-bold mb-1">
                  {{ $t("Tour de Taille") }}
                </p>
                <p class="fw-light text-body-secondary mb-4">
                  Place le mètre ruban autour de la partie la plus
                  étroite de ta taille.
                </p>

                <p class="fs-6 fw-bold mb-1">
                  {{ $t("Tour de Hanches") }}
                </p>
                <p class="fw-light text-body-secondary mb-4">
                  Mets tes pieds l'un contre l'autre et place le mètre ruban
                  autour de la partie la plus large de ton tour de hanche.
                </p>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
      </teleport>
    </section>
  </shop-layout>
</template>

<script lang="ts">
import 'vue-image-zoomer/dist/style.css'

import { useCompany } from '@/composables/company'
import { useIntersectionObserver } from '@vueuse/core'
import { mapActions, storeToRefs } from 'pinia'
import { useCartComposable } from 'src/composables/cart'
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
import BaseSizeBlock from 'src/components/BaseSizeBlock.vue'
import LoadingRecommendationsBlock from 'src/components/LoadingRecommendationsBlock.vue'
import DeliveryType from 'src/components/product/DeliveryType.vue'
import DeliveryTypes from 'src/components/product/DeliveryTypes.vue'
import FiveImages from 'src/components/product/FiveImages.vue'
import ShopLayout from '@/layouts/ShopLayout.vue'
import SixImages from 'src/components/product/SixImages.vue'

import { Product } from '@/types/shop'

export default defineComponent({
  name: 'ProductPage',
  components: {
    AdditionalInfoBlock,
    BreadcrumbBlock,
    BaseSizeBlock,
    DeliveryType,
    DeliveryTypes,
    FiveImages,
    ReviewsBlock,
    ShopLayout,
    SixImages,
    LoadingRecommendationsBlock,
    // VueImageZoomer,
    AsyncRecommendationBlock: defineAsyncComponent({
      loader: () => import('src/components/RecommendationsBlock.vue'),
      delay: 500
    })
  },
  setup () {
    const { locale } = useI18n()
    const { createTitle } = useCompany()
    const documentVisible = inject('documentVisible')

    const isLoading = ref(true)
    // Interceptor to check that the user has moved
    // down to the the "more-products" section of
    // the product page
    const intersectionTarget = ref<HTMLElement | null>(null)

    const { localImagePath, parseMainImage, djangoMediaPath, translatePrice } = useShopUtilities()

    const { addToCart, showSizeSelectionWarning, userSelection } = useCartComposable()

    const { isLiked, handleLike } = useShopComposable()

    const authenticationStore = useAuthentication()
    const shopStore = useShop()

    const cartStore = useCart()
    const { showAddedProductDrawer } = storeToRefs(cartStore)

    const sizeGuideDrawer = ref(false)

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
      sizeGuideDrawer,
      showAddedProductDrawer,
      userSelection,
      currentProduct,
      authenticationStore,
      isLiked,
      isLoading,
      productVariants,
      showSizeSelectionWarning,
      requestProduct,
      createTitle,
      addToCart,
      djangoMediaPath,
      parseMainImage,
      translatePrice,
      localImagePath,
      handleLike
    }
  },
  computed: {
    /**
     * Returns the proper image component to display
     * the remaining images for the given product
     */
    imageComponent (): string {
      if (this.currentProduct.images?.length === 6) {
        return 'six-images'
      } else if (this.currentProduct.images?.length === 5) {
        return 'five-images'
      } else {
        return 'six-images'
      }
    },
    /**
     * Indicates if the product has other color variants     * 
     */
    // FIXME: currentProduct.variants exists?
    hasColorVariants (): boolean {
      const variants = this.currentProduct.variants.filter((product) => {
        return product.id !== this.currentProduct.id
      })
      return variants.length > 0
      // const variants = _.filter(this.currentProduct.variants, (product) => {
      //   return product.id !== this.currentProduct.id
      // })
      // return variants.length > 0
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
    this.intersectionTarget = this.$refs.moreProductsIntersect
  },
  methods: {
    ...mapActions(useShop, ['addToHistory']),
    /**
     * Handles the action of adding a product
     * to the current user's cart. Products that
     * require a size will force the user to
     * select a size before handling the action
     * 
     * @listens click
     */
    async handleAddToCart () {
      this.addToCart(this.currentProduct, (data) => {
        this.showAddedProductDrawer = true
        
        if (!this.$session.keyExists('session_id')) {
          this.$session.create('session_id', data.session_id)
        }
      })
    },
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
    }
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
