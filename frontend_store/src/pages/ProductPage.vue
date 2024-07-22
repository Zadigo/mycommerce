<template>
  <shop-layout>
    <section id="product" class="container-fluid space-section">
      <!-- Product -->
      <div class="row gy-1">
        <div id="product-image" class="col-12">
          <div class="row row-cols-5">
            <div id="product-main-image" class="col-6">
              <div id="main-image">
                <v-img :src="parseMainImage(currentProduct)" :lazy-src="parseMainImage(currentProduct)" :alt="currentProduct.name" />
              </div>
            </div>

            <!-- TODO: Detect which sections can be reusable components -->
            <div id="product-information" class="col-4 ms-5">
              <v-skeleton-loader v-if="isLoading" type="text"></v-skeleton-loader>
              <ol v-else class="breadcrumb">
                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'shop_products' }" class="link-dark">
                    Shop
                  </router-link>
                </li>

                <li class="breadcrumb-item">
                  <router-link :to="{ name: 'shop_products_collection', params: { id: currentProduct.category?.toLowerCase() } }" class="link-dark">
                    {{ currentProduct.category }}
                  </router-link>
                </li>

                <li class="breadcrumb-item active" aria-current="page">
                  {{ currentProduct.name }}
                </li>
              </ol>

              <!-- Information -->
              <h1 class="h3 fw-light" aria-label="Product name">{{ currentProduct.name }}</h1>

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
              <div class="fw-bold d-flex justify-content-start gap-1">
                <div aria-label="3 stars" data-rating="3" class="stars">
                  <font-awesome-icon v-for="i in 5" :key="i" :icon="['fas', 'star']" />
                </div>

                <span class="fs-6 fw-light text-body-secondary">
                  ({{ $t('avis', { n: 45 }) }})
                </span>
              </div>

              <!-- Variants -->
              <div v-if="hasColorVariants" id="variants" class="d-flex justify-content-start align-items-center gap-1 my-4">
                <div v-for="variant in currentProduct.variants" :key="variant.id" class="variant">
                  <router-link :to="{ name: 'shop_product', params: { id: variant.id } }" :aria-label="`${variant.name} ${variant.color}`">
                    <v-img :src="parseMainImage(variant, 'original')" :lazy-src="parseMainImage(variant, 'original')" :alt="variant.color" width="50" />
                  </router-link>
                </div>
              </div>

              <!-- Sizes -->
              <base-size-block :sizes="currentProduct.sizes" @update-size="(size) => { userSelection.size = size }" @show-size-guide-drawer="sizeGuideDrawer = true" />

              <!-- Size Guide -->
              <p class="mt-4 d-flex justify-content-start gap-3">
                <a href class="btn btn-light btn-rounded fw-bold shadow-none" @click.prevent="sizeGuideDrawer = true">
                  <v-icon icon="mdi-ruler" class="me-2" /> {{ $t('Guide des tailles') }}
                </a>

                <!-- <span class="fw-light">
                  {{ $t('Taille porté', { size: 'S' }) }} | {{ $t('Taille du mannequin', { heigth: 176 }) }}
                </span> -->
              </p>

              <transition id="choose-size" tag="div" name="opacity">
                <p v-if="showSizeSelectionWarning" class="text-danger fs-6 fw-light mb-1">Tu dois sélectionner une taille</p>
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
                <delivery-types icon-name="shop" text="Enlèvement en magasin"></delivery-types>
                <delivery-types icon-name="truck" text="Livraison standard à domicile"></delivery-types>
              </delivery-type>
              
              <!-- Additional Information -->
              <div class="py-3 bg-white mt-4 d-flex justify-content-start align-items-center gap-2 fw-ecommerce-small-1">
                <a href class="link-dark fw-bold" aria-label="Livraison et retour" @click.prevent="showCompositionDrawer = true">
                  Composition, soin et traçabilité
                </a> |

                <a href class="link-dark fw-bold" aria-label="Livraison et retour" @click.prevent="showDeliveryDrawer = true">
                  Livraison et retour
                </a>
              </div>
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
      <v-navigation-drawer id="size-guide-modal" v-model="sizeGuideDrawer" width="400" location="right" temporary>
        <v-toolbar class="border-bottom" color="white">
          <v-toolbar-title class="fw-bold">Guide des tailles</v-toolbar-title>

          <v-spacer></v-spacer>

          <v-btn icon="mdi-close" @click="sizeGuideDrawer = false"></v-btn>
        </v-toolbar>

        <div class="container my-4">
          <div class="row g-1">
            <div class="col-12">
              <p class="fs-6 fw-bold mb-1">Sélectionne une taille</p>
              <base-size-block :sizes="currentProduct.sizes" @update-size="(size) => { userSelection.size = size }" @show-size-guide-drawer="sizeGuideDrawer = true" />

              <p class="fs-6 fw-bold mt-4 mb-1">Mensurations</p>
              <p class="fw-light text-body-secondary text-uppercase">Corps</p>

              <div class="sizes">
                <div class="d-flex justify-content-between align-items-center">
                  <div class="col-auto">Tour de Poitrine</div>
                  <div class="col-auto">82</div>
                </div>
              </div>
            </div>

            <div class="col-12 mt-4">
              <v-btn color="primary" block @click="handleAddToCart">
                {{ $t('Ajouter au panier') }}
              </v-btn>
            </div>

            <div class="col-12 mt-4">
              <p class="fs-6 fw-bold">Comprendre tes mesures ?</p>
              <v-img :src="localImagePath('size-guide.jpg')" :lazy-src="localImagePath('size-guide.jpg')" :width="300"></v-img>
            </div>

            <div class="col-12 mt-4">
              <p class="fs-6 fw-bold mb-1">Tour de Poitrine</p>
              <p class="fw-light text-body-secondary mb-4">
                Pour mesurer la circonférence de ta poitrine, utilise un mètre
                ruban et place-le autour de la partie la plus large de ta poitrine.
              </p>

              <p class="fs-6 fw-bold mb-1">Tour de Taille</p>
              <p class="fw-light text-body-secondary mb-4">
                Place le mètre ruban autour de la partie la plus
                étroite de ta taille.
              </p>

              <p class="fs-6 fw-bold mb-1">Tour de Hanches</p>
              <p class="fw-light text-body-secondary mb-4">
                Mets tes pieds l'un contre l'autre et place le mètre ruban
                autour de la partie la plus large de ton tour de hanche.
              </p>
            </div>
          </div>
        </div>
      </v-navigation-drawer>

      <!-- Composition -->
      <v-navigation-drawer id="composition-modal" v-model="showCompositionDrawer" width="400" location="right" temporary>
        <div class="container my-4 fw-light">
          <h4 class="h5 mb-1 mt-3">Composition</h4>
          <ul>
            <li>75% viscose</li>
            <li>22% polyamide</li>
            <li>3% élasthanne</li>
          </ul>
        </div>
      </v-navigation-drawer>

      <!-- Delivery And Returns -->
      <v-navigation-drawer id="delivery-modal" v-model="showDeliveryDrawer" width="400" location="right" temporary>
        <div class="container my-4 fw-light">
          <div class="row">
            <p class="fw-bold mb-1 mt-3">Livraison</p>
            <p>Livraison en magasin GRATUITE</p>

            <p class="fw-bold mb-1 mt-3">Dans le magasin de votre choix</p>
            <p>en 2-4 jours ouvrables</p>

            <div>
              <div class="d-flex justify-content-between fw-bold">
                <span>Standard</span>
                <span>4.95€</span>
              </div>
              <p>En 2-5 jours ouvrables</p>
            </div>

            <div>
              <div class="d-flex justify-content-between fw-bold">
                <span>Express</span>
                <span>9.95€</span>
              </div>
              <p>En 2-3 jours ouvrables</p>
            </div>

            <div>
              <div class="d-flex justify-content-between fw-bold">
                <span>Point Relais Colis</span>
                <span>3.95€</span>
              </div>
              <p>En 2-4 jours ouvrables</p>
            </div>

            <h4 class="h5">Remboursement:</h4>

            <p class="fw-bold mb-1 mt-3">Remboursement</p>
            <p>Vous disposez de 30 jours à compter de la date d'expédition de la commande Les retours en magasin sont toujours GRATUITS</p>

            <p>Vous pouvez restituer un produit dans l'un de nos magasins situé dans le pays dans lequel vous avez effectué votre achat.</p>

            <p class="fw-bold mb-1 mt-3">Retour en point relais</p>
            <p>
              Tu peux demander à retourner un article via l'un de nos points relais dans la
              section « Mon Compte » de notre site en sélectionnant « Retour en point relais ».
              Cette option est gratuite si tu effectues ton premier retour en point relais dans les 15 premiers
              jours de la période de retour. Si tu effectues ton retour en point relais une fois les 15 premiers
              jours de la période de retour passés, ou si c'est ta deuxième demande de retour pour la même commande,
              les frais de retour seront de 4,95€.
            </p>

            <div class="mt-3">
              <div class="d-flex justify-content-between fw-bold">
                <span>Retour à domicile</span>
                <span>5,95€</span>
              </div>
              <p>
                Vous pouvez demander le retour d'un produit via un
                ramassage par un transporteur en visitant la section "Mon Compte" sur notre
                site Web et en sélectionnant "Retour à domicile". Cette option a un coût de 5,95€.
              </p>
            </div>

            <p class="fw-bold mb-1 mt-3">Ne peuvent être ni échangés ni retournés :</p>
            <ul>
              <li>Les articles personnalisés</li>
              <li>Les sous-vêtements</li>
              <li>Les boucles d'oreilles</li>
              <li>Les accessoires pour les cheveux</li>
              <li>Les casquettes et les chapeaux</li>
              <li>Articles imprimés sur demande</li>
              <li>Produits The Bershka Print Shop</li>
            </ul>

            <a href="#" class="mt-3">
              Consulte ici les conditions et exceptions 
              pour les retours et les échanges
            </a>
          </div>
        </div>
      </v-navigation-drawer>
    </section>
  </shop-layout>
</template>

<script>
import _ from 'lodash'
import 'vue-image-zoomer/dist/style.css'

import { ref, inject, defineAsyncComponent } from 'vue'
import { mapActions, storeToRefs } from 'pinia'
import { useCart } from 'src/stores/cart'
import { useAuthentication } from 'src/stores/authentication'
import { useShop } from  'src/stores/shop'
// import { useSeoMeta } from 'unhead'
// import { useSchemaOrg, defineProduct, defineBreadcrumb } from '@unhead/schema-org'
// import { useI18n } from 'vue-i18n'
import { useShopComposable } from 'src/composables/shop'
import { useIntersectionObserver } from '@vueuse/core'
import { buildImagePath } from 'src/utils'
import { useCartComposable } from 'src/composables/cart'
import { useUtilities } from 'src/composables/shop'

// import { VueImageZoomer } from 'vue-image-zoomer'

import BaseSizeBlock from 'src/components/BaseSizeBlock.vue'
import DeliveryType from 'src/components/product/DeliveryType.vue'
import DeliveryTypes from 'src/components/product/DeliveryTypes.vue'
import FiveImages from 'src/components/product/FiveImages.vue'
import LoadingRecommendationsBlock from 'src/components/LoadingRecommendationsBlock.vue'
import SixImages from 'src/components/product/SixImages.vue'

export default {
  name: 'ProductPage',
  components: {
    BaseSizeBlock,
    DeliveryType,
    DeliveryTypes,
    FiveImages,
    SixImages,
    LoadingRecommendationsBlock,
    // VueImageZoomer,
    AsyncRecommendationBlock: defineAsyncComponent({
      loader: () => import('components/RecommendationsBlock.vue'),
      delay: 500
    })
  },
  // beforeRouteEnter (to, from, next) {
  //   next(vm => {
  //     vm.handleViewingHistory(vm.currentProduct)
  //   })
  // },
  setup () {
    const documentVisible = inject('documentVisible')

    // const router = useRouter()
    // const route = useRoute()
    
    const isLoading = ref(true)
    // Interceptor to check that the user has moved
    // down to the the "more-products" section of
    // the product page
    const intersectionTarget = ref(null)

    const { localImagePath, parseMainImage, djangoMediaPath, translatePrice } = useUtilities()

    const { addToCart, showSizeSelectionWarning, userSelection } = useCartComposable()

    const { isLiked, handleLike } = useShopComposable()

    const authenticationStore = useAuthentication()
    const shopStore = useShop()

    const cartStore = useCart()
    const { showAddedProductDrawer } = storeToRefs(cartStore)

    const sizeGuideDrawer = ref(false)
    const showDeliveryDrawer = ref(false)
    const showCompositionDrawer = ref(false)

    const currentProduct = ref({})

    // const userSelection = ref({
    //   size: null,
    //   quantity: 1,
    // })

    // const productPath = router.resolve({ name: 'shop_product', params: { id: route.params.id } })
    // setTimeout(() => {
    //   useSeoMeta({
    //     title: currentProduct.value.name,
    //     description: currentProduct.value.description,
    //     ogTitle: currentProduct.value.name,
    //     ogDescription: currentProduct.value.description,
    //     ogImage: buildImagePath(currentProduct.value.get_main_image.original),
    //     twitterCard: 'summary_large_image',
    //     ogSiteName: 'Ma Boutique'
    //   })

    //   useSchemaOrg([
    //     defineProduct({
    //       name: currentProduct.value.name,
    //       itemCondition: 'NewCondition',
    //       brand: 'My Brand',
    //       logo: '',
    //       description: currentProduct.value.description,
    //       image: [
    //         buildImagePath(currentProduct.value.get_main_image.original)
    //       ],
    //       offers: [
    //         { 
    //           price: currentProduct.value.price
    //         }
    //       ]
    //     }),
    //     defineBreadcrumb({
    //       itemListElement: [
    //         { name: 'Boutique', item: '/' },
    //         { name: 'Soutien-Gorge', item: productPath.fullPath },
    //         { name: currentProduct.value.name },
    //       ],
    //     })
    //   ])
    // }, 800)

    const productVariants = ref([])

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
      showCompositionDrawer,
      showDeliveryDrawer,
      showAddedProductDrawer,
      userSelection,
      currentProduct,
      authenticationStore,
      isLiked,
      isLoading,
      productVariants,
      showSizeSelectionWarning,
      addToCart,
      djangoMediaPath,
      parseMainImage,
      translatePrice,
      localImagePath,
      handleLike,
      buildImagePath,
    }
  },
  computed: {
    /**
     * Returns the proper image component to display
     * the remaining images for the given product
     * 
     * @returns {String} The name of the image component
     */
    imageComponent () {
      if (this.currentProduct.images?.length === 6) {
        return 'six-images'
      } else if (this.currentProduct.images?.length === 5) {
        return 'five-images'
      } else {
        return 'six-images'
      }
    },
    /**
     * Indicates if the product has other color variants
     * 
     * @returns {Boolean}
     */
    hasColorVariants () {
      const variants = _.filter(this.currentProduct.variants, (product) => {
        return product.id !== this.currentProduct.id
      })
      return variants.length > 0
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
  },
  mounted () {
    this.intersectionTarget = this.$refs.moreProductsIntersect
    this.addToHistory(this.currentProduct)

    // TODO:
    // useSeoMeta({
    //   title: this.currentProduct.name,
    //   description: null,
    //   ogTitle: null,
    //   ogDescription:null,
    //   ogImage: null,
    //   twitterCard: null,
    //   ogSiteName: null
    // })
  },
  beforeUpdate () {
    // useSeoMeta({
    //   title: this.currentProduct.name,
    //   description: this.currentProduct.description,
    //   ogTitle: this.currentProduct.name,
    //   ogDescription: this.currentProduct.description,
    //   ogImage: this.currentProduct.get_main_image.original,
    //   twitterCard: 'summary_large_image',
    //   ogSiteName: 'Ma Boutique'
    // })

    // useSchemaOrg([
    //   defineProduct({
    //     name: this.currentProduct.name,
    //     itemCondition: 'NewCondition',
    //     brand: 'My Brand',
    //     logo: '',
    //     description: this.currentProduct.description,
    //     image: ['https://example.com/photos/16x9/photo.jpg'],
    //     offers: [
    //       {
    //         price: this.currentProduct.price
    //       }
    //     ]
    //   }),
    //   defineBreadcrumb({
    //     itemListElement: [
    //       { name: 'Boutique', item: '/' },
    //       { name: 'Soutien-Gorge', item: this.$route.fullPath },
    //       { name: this.currentProduct.name },
    //     ],
    //   })
    // ])
  },
  methods: {
    ...mapActions(useShop, ['addToHistory']),
    /**
     * Request the details of the given product
     * from the backend. This dos not use products
     * that were preloaded in the products page but
     * requests the product details on each page just
     * like would do a static page
     */
    async requestProduct () {
      try {
        const response = await this.$http.get(`shop/products/${this.$route.params.id}`)
        this.currentProduct = response.data
        this.isLoading = false
      } catch (e) {
        if (e.response.status === 404) {
          this.$router.push({
            name: 'not_found'
          })
        }
      }
    },
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
