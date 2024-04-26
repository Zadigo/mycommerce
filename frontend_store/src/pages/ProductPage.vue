<template>
  <shop-layout>
    <section id="product" class="container-fluid my-5">
      <div class="row gy-1">
        <!-- Product -->
        <div id="product-image" class="col-12">
          <div class="row">
            <div id="product-image" class="col-6">
              <!-- <vue-image-zoomer regular="../assets/img4.jpeg" zoom="../assets/img4.jpeg" @on-zoom="() => {}">
                <img src="../assets/img4.jpeg" class="img-fluid" alt="">
              </vue-image-zoomer> -->
              <v-img :src="buildImagePath(currentProduct.get_main_image?.original)" :lazy-src="buildImagePath(currentProduct.get_main_image?.original)" :alt="currentProduct.name" />
            </div>

            <!-- TODO: Detect which sections can be reusable components -->
            <div id="product-information" class="col-6">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'shop_products' }">
                    Shop
                  </router-link>
                </li>
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'shop_products_collection', params: { id: 'soutien-gorge' } }">
                    Soutien-Gorge
                  </router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  {{ currentProduct.name }}
                </li>
              </ol>

              <!-- Information -->
              <h1 class="h3 fw-bold" aria-label="Product name">{{ currentProduct.name }}</h1>
              <p class="fw-light text-body-secondary" aria-label="Product reference">Ref. 3970/623/800</p>

              <!-- Price -->
              <p class="h5 fw-bold" aria-label="Product price">
                {{ $n(parseFloat(currentProduct.get_price), 'currency') }}
              </p>

              <!-- Reviews -->
              <div class="fw-bold d-flex justify-content-start gap-1">
                <a href="#" class="link-dark me-2">3 stars</a>
                <div class="stars">
                  <font-awesome-icon v-for="i in 5" :key="i" :icon="['fas', 'star']" />
                </div>
                <span class="fs-6 fw-light text-body-secondary">
                  ({{ $t('avis', { n: 45 }) }})
                </span>
              </div>

              <!-- Variants -->
              <div id="variants" class="d-flex justify-content-start align-items-center gap-1 my-4">
                <div v-for="product in currentProduct.variants" :key="product" class="variant">
                  <router-link :to="{ name: 'shop_product', params: { id: product } }">
                    <img src="../assets/img8.jpeg" class="img-fluid" width="50" height="50" alt="">
                  </router-link>
                </div>
              </div>

              <!-- Sizes -->
              <fashion-information :sizes="currentProduct.sizes" @update-size="(size) => { userSelection.size = size }" @show-size-guide-drawer="sizeGuideDrawer = true" />

              <transition id="choose-size" tag="div" name="opacity">
                <p v-if="showSizeSelectionWarning" class="text-danger fs-6 fw-light mb-1">Tu dois sélectionner une taille</p>
              </transition>

              <div class="actions d-flex justify-content-start gap-1">
                <button id="btn-add-to-cart" type="button" class="btn btn-primary btn-lg shadow-none btn-rounded" aria-label="Add to cart" @click="handleAddToCart">
                  Ajouter au panier
                </button>

                <button type="button" class="btn btn-primary btn-lg shadow-none btn-rounded" aria-label="Like product" @click="handleLike">
                  <font-awesome-icon v-if="isLiked" :icon="['fas', 'heart']" />
                  <font-awesome-icon v-else :icon="['far', 'heart']" />
                </button>
              </div>

              <!-- Delivery Types -->
              <div class="list-group mt-5">
                <div class="list-group-item d-flex justify-content-start gap-3 align-items-center p-3">
                  <font-awesome-icon :icon="['fas', 'shop']" />
                  <span>Enlèvement en magasin</span>
                  <span class="fw-bold text-uppercase">Gratuit</span>
                </div>

                <div class="list-group-item d-flex justify-content-start gap-3 align-items-center p-3">
                  <font-awesome-icon :icon="['fas', 'truck']" />
                  <span>Livraison standard à domicile</span>
                  <span class="fw-bold text-uppercase">Gratuit</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- More Product Images -->
        <div id="product-images" class="col-12">
          <div v-if="currentProduct.images" class="row g-1">
            <div v-for="image in currentProduct.images" :key="image.id" class="col-4">
              <v-img :src="buildImagePath(image.original)" :lazy-src="buildImagePath(image.original)" :alt="image.name" />
            </div>
          </div>
          <div v-else class="row g-1">
            <div v-for="image in 6" :key="image.id" class="col-4">
              <v-img :src="buildImagePath('placeholder.svg', false, true)" :lazy-src="buildImagePath('placeholder.svg', false, true)" alt="Boutique" />
            </div>
          </div>
        </div>

        <!-- More Products -->
        <!-- TODO: Make this a component: ProductsRecommentation.vue -->
        <div id="more-products" ref="moreProductsIntersect" class="col-12 mt-5">
          <!-- <h2 class="h4 text-center mb-4">Cela peut t'intéresser</h2>
          <div class="row g-1">
            <div v-for="product in moreProducts" :key="product" class="col-sm-6 col-md-3">
              <product-card :product="product" />
            </div>
          </div> -->
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
      <v-navigation-drawer id="size-guide" v-model="sizeGuideDrawer" width="400" location="right" temporary>
        <v-toolbar class="border-bottom" color="white">
          <v-toolbar-title class="fw-bold">Guide des tailles</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon="mdi-close" @click="sizeGuideDrawer = false"></v-btn>
        </v-toolbar>

        <div class="container my-4">
          <div class="row g-1">
            <div class="col-12">
              <p class="fs-6 fw-bold">Sélectionne une taille</p>

              <p class="fs-6 fw-bold">Mensurations</p>
              <p class="fw-light text-body-secondary text-uppercase">Corps</p>

              <div class="sizes">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="col-auto">Tour de Poitrine</div>
                  <div class="col-auto">82</div>
                </div>
              </div>
            </div>

            <div class="col-12 mt-4">
              <v-btn color="primary" block>Ajouter au panier</v-btn>
            </div>

            <div class="col-12 mt-4">
              <p class="fs-6 fw-bold">Comprendre tes mesures ?</p>
              <v-img src="../assets/size-guide.jpg" lazy-src="../assets/size-guide.jpg" width="300"></v-img>
            </div>

            <div class="col-12 mt-4">
              <p class="fs-6 fw-bold mb-1">Tour de Poitrine</p>
              <p class="fw-light text-body-secondary mb-4">Pour mesurer la circonférence de ta poitrine, utilise un mètre ruban et place-le autour de la partie la plus large de ta poitrine.</p>

              <p class="fs-6 fw-bold mb-1">Tour de Taille</p>
              <p class="fw-light text-body-secondary mb-4">Place le mètre ruban autour de la partie la plus étroite de ta taille.</p>

              <p class="fs-6 fw-bold mb-1">Tour de Hanches</p>
              <p class="fw-light text-body-secondary mb-4">Mets tes pieds l'un contre l'autre et place le mètre ruban autour de la partie la plus large de ton tour de hanche.</p>
            </div>
          </div>
        </div>
      </v-navigation-drawer>
    </section>
  </shop-layout>
</template>

<script>
import { ref, inject, defineAsyncComponent } from 'vue'
import { mapActions, storeToRefs } from 'pinia'
import { useSeoMeta } from 'unhead'
import { useCart } from 'src/stores/cart'
import { useAuthentication } from 'stores/authentication'
import { useShop } from  'stores/shop'
import { useSchemaOrg, defineProduct, defineBreadcrumb } from '@unhead/schema-org'
import { useShopComposable } from 'composables/shop'
import { useIntersectionObserver } from '@vueuse/core'
import { useRouter, useRoute } from 'vue-router'
import { buildImagePath } from 'src/utils'

// import { VueImageZoomer } from 'vue-image-zoomer'
// import { createMockupProduct } from 'src/utils'
// import { useI18n } from 'vue-i18n'

import 'vue-image-zoomer/dist/style.css'

import FashionInformation from 'src/components/product/information/FashionInformation.vue'
import LoadingRecommendationsBlock from 'src/components/LoadingRecommendationsBlock.vue'
// import ProductCard from 'components/products/ProductCard.vue'

export default {
  name: 'ProductPage',
  components: {
    FashionInformation,
    LoadingRecommendationsBlock,
    // ProductCard,
    // VueImageZoomer,
    AsyncRecommendationBlock: defineAsyncComponent({
      loader: async () => import('components/RecommendationsBlock.vue')
    })
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.handleViewingHistory(vm.currentProduct)
    })
  },
  setup () {
    const documentVisible = inject('documentVisible')

    const router = useRouter()
    const route = useRoute()
    
    // Interceptor to check that the user has moved
    // down to the the "more-products" section of
    // the product page
    const intersectionTarget = ref(null)

    const { isLiked, handleLike } = useShopComposable()

    const authenticationStore = useAuthentication()
    const shopStore = useShop()

    const cartStore = useCart()
    const { showAddedProductDrawer } = storeToRefs(cartStore)

    const sizeGuideDrawer = ref(false)
    const showSizeSelectionWarning = ref(false)

    const currentProduct = ref({})
    const userSelection = ref({
      size: null,
      quantity: 1,
    })

    const productPath = router.resolve({ name: 'shop_product', params: { id: route.params.id } })
    setTimeout(() => {
      useSeoMeta({
        title: currentProduct.value.name,
        description: currentProduct.value.description,
        ogTitle: currentProduct.value.name,
        ogDescription: currentProduct.value.description,
        ogImage: buildImagePath(currentProduct.value.get_main_image.original),
        twitterCard: 'summary_large_image',
        ogSiteName: 'Ma Boutique'
      })

      useSchemaOrg([
        defineProduct({
          name: currentProduct.value.name,
          itemCondition: 'NewCondition',
          brand: 'My Brand',
          logo: '',
          description: currentProduct.value.description,
          image: [
            buildImagePath(currentProduct.value.get_main_image.original)
          ],
          offers: [
            { 
              price: currentProduct.value.price
            }
          ]
        }),
        defineBreadcrumb({
          itemListElement: [
            { name: 'Boutique', item: '/' },
            { name: 'Soutien-Gorge', item: productPath.fullPath },
            { name: currentProduct.value.name },
          ],
        })
      ])
    }, 400)

    useIntersectionObserver(intersectionTarget, ([{ isIntersecting }], observerElement) => {
      observerElement
      isIntersecting
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
      handleLike,
      buildImagePath,
      showSizeSelectionWarning
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
      // Instead of sending each visited product
      // statistics at once, wait for when the user
      // either changes page or refreshes the page
      // to send these statistics at once
      if (n !== 'visible') {
        this.handleSendingStatistics()
      }
    }
  },
  beforeMount () {
    this.requestProduct()
    // As with the "documentVisible" watcher function,
    // listen for when the user refreshes the page
    // or closes the tab to send statistics related
    // to products that he has visited
    // window.addEventListener('beforeunload', this.handleSendingStatistics)
  },
  mounted () {
    this.intersectionTarget = this.$refs.moreProductsIntersect
  },
  beforeUpdate () {
    useSeoMeta({
      title: this.currentProduct.name,
      description: this.currentProduct.description,
      ogTitle: this.currentProduct.name,
      ogDescription: this.currentProduct.description,
      ogImage: this.currentProduct.get_main_image.original,
      twitterCard: 'summary_large_image',
      ogSiteName: 'Ma Boutique'
    })

    useSchemaOrg([
      defineProduct({
        name: this.currentProduct.name,
        itemCondition: 'NewCondition',
        brand: 'My Brand',
        logo: '',
        description: this.currentProduct.description,
        image: ['https://example.com/photos/16x9/photo.jpg'],
        offers: [
          {
            price: this.currentProduct.price
          }
        ]
      }),
      defineBreadcrumb({
        itemListElement: [
          { name: 'Boutique', item: '/' },
          { name: 'Soutien-Gorge', item: this.$route.fullPath },
          { name: this.currentProduct.name },
        ],
      })
    ])
  },
  beforeUnmount () {
    // window.removeEventListener('beforeunload', this.handleSendingStatistics)
  },
  methods: {
    ...mapActions(useShop, ['addToHistory']),
    async requestProduct () {
      // Request the details of the given product
      // from the backend. This dos not use products
      // that were preloaded in the products page but
      // requests the product details on each page just
      // like would do a static page
      // this.currentProduct = createMockupProduct(this.$route.params.id)

      try {
        const response = await this.$http.get(`shop/products/${this.$route.params.id}`)
        this.currentProduct = response.data
      } catch (e) {
        console.log(e)
      }
    },
    async handleAddToCart () {
      // Handles the action of adding a product
      // to the current user's cart
      if (this.userSelection.size === null) {
        this.showSizeSelectionWarning = true
      } else {
        this.cartStore.addToCart(this.currentProduct, this.userSelection)
        this.showAddedProductDrawer = true
      }
    },
    async handleViewingHistory () {
      // Handles the action of keeping track
      // of the products that were viewed by
      // the user during his session
      this.addToHistory(this.currentProduct)
    },
    async handleSendingStatistics () {
      // TODO: We need to send these statistics ONLY if
      // if there are products to be sent and ONLY IF there's
      // a change the existing visited products array that we
      // have stored in the session
      if (this.sessionStorage.visitedProducts.length > 0) {
        console.log('User left the screen send visitedPages statistics')
      }
    }
  }
}
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
</style>
