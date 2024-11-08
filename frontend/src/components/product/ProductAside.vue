<template>
  <div id="product-aside" class="col-4 ms-5 mt-4">
    <!-- Breadcrumb -->
    <breadcrumb-block />

    <!-- Information -->
    <h1 class="h3 fw-light" aria-label="Product name">
      {{ currentProduct?.name || 'Put loader...' }}
    </h1>

    <!-- Reference -->
    <p class="fw-light text-body-secondary mb-2" aria-label="Product reference">
      Ref. 1/2/3
    </p>

    <!-- Price -->
    <base-skeleton :loading="isLoading" class="mb-3" width="50px">
      <p class="h5 fw-bold mb-3" aria-label="Product price">
        {{ translatePrice(currentProduct?.get_price) }}
      </p>
    </base-skeleton>

    <!-- Reviews -->
    <reviews-block />

    <!-- Variants -->
    <div v-if="hasColorVariants" id="variants" class="d-flex justify-content-start align-items-center gap-1 my-4">
      <div v-for="variant in currentProduct?.variants" :key="variant.id" class="variant">
        <router-link id="product-variant" :to="{ name: 'shop_product', params: { id: variant.id } }" :aria-label="`${variant.id} ${variant.color}`">
          <v-img :src="parseMainImage(variant, 'original')" :lazy-src="parseMainImage(variant, 'original')" :alt="variant.color" width="50" />
        </router-link>
      </div>
    </div>

    <hr class="my-5 text-body-tertiary">

    <!-- Sizes -->
    <base-size-block v-if="currentProduct" :sizes="currentProduct.sizes" @update-size="handleSizeSelection" @show-size-guide-drawer="() => {}" />

    <!-- Size Guide -->
    <div class="d-flex justify-content-start gap-3 mt-4 mb-2">
      <a href="#" class="btn btn-light btn-rounded fw-bold shadow-none" @click.prevent="showSizeGuideDrawer=true">
        <font-awesome-icon icon="ruler" class="me-2" /> {{ $t('Guide des tailles') }}
      </a>
    </div>

    <transition id="choose-size" tag="div" name="opacity">
      <p v-if="showSizeSelectionWarning" class="text-danger fs-6 fw-light mb-1">
        {{ $t("Tu dois sélectionner une taille") }}
      </p>
    </transition>

    <div class="actions d-flex justify-content-start gap-1">
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

    <!-- Modals -->
    <!-- Size Guide -->
    <teleport to="body">
      <v-navigation-drawer id="size-guide-modal" v-model="showSizeGuideDrawer" width="400" location="right" temporary>
        <v-toolbar class="border-bottom" color="white">
          <v-toolbar-title class="fw-bold">
            {{ $t("Guide des tailles") }}
          </v-toolbar-title>

          <v-spacer />

          <v-btn icon="mdi-close" @click="showSizeGuideDrawer = false" />
        </v-toolbar>

        <div v-if="currentProduct" class="container my-4">
          <div class="row g-1">
            <div class="col-12">
              <p class="fs-6 fw-bold mb-1">
                {{ $t("Sélectionne une taille") }}
              </p>
              
              <base-size-block :sizes="currentProduct.sizes" @update-size="handleSizeSelection" @show-size-guide-drawer="showSizeGuideDrawer=true" />

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
  </div>
</template>

<script lang="ts">
import { useCartComposable } from '@/composables/cart';
import { useShopComposable, useShopUtilities } from '@/composables/shop';
import { useCart } from '@/stores/cart';
import { Product } from '@/types/shop';
import { storeToRefs } from 'pinia';
import { defineComponent, inject, ref } from 'vue';

import BaseSkeleton from '@/layouts/BaseSkeleton.vue';
import BaseSizeBlock from '../BaseSizeBlock.vue';
import AdditionalInfoBlock from './AdditionalInfoBlock.vue';
import BreadcrumbBlock from './BreadcrumbBlock.vue';
import DeliveryType from './DeliveryType.vue';
import DeliveryTypes from './DeliveryTypes.vue';
import ReviewsBlock from './ReviewsBlock.vue';

export default defineComponent({
  name: 'ProductAside',
  components: {
    AdditionalInfoBlock,
    BaseSkeleton,
    BaseSizeBlock,
    BreadcrumbBlock,
    DeliveryType,
    DeliveryTypes,
    ReviewsBlock
  },
  emits: {
    'size-guide' () {
      return true
    },
    'add-to-cart' () {
      return true
    }
  },
  setup () {
    const currentProduct = inject<Product>('currentProduct')
    const isLoading = inject<boolean>('isLoading')

    const { translatePrice, parseMainImage, localImagePath } = useShopUtilities()
    const { isLiked, handleLike } = useShopComposable()
    const { addToCart, showSizeSelectionWarning, userSelection } = useCartComposable()

    const cartStore = useCart()
    const { showAddedProductDrawer } = storeToRefs(cartStore)
    const showSizeGuideDrawer = ref(false)

    return {
      isLiked,
      isLoading,
      currentProduct,
      showAddedProductDrawer,
      showSizeGuideDrawer,
      showSizeSelectionWarning,
      userSelection,
      localImagePath,
      addToCart,
      parseMainImage,
      handleLike,
      translatePrice
    }
  },
  computed: {
    /**
     * Indicates if the product has other color variants     * 
     */
    hasColorVariants (): boolean {
      if (this.currentProduct) {
        return this.currentProduct.variants.length > 0
      } else {
        return false
      }
    }
  },
  methods: {
    handleSizeSelection (size: string | undefined) {
      if (typeof size !== 'undefined') {
        this.userSelection.size = size
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
      if (this.currentProduct) {
        this.addToCart(this.currentProduct, (data) => {
          this.showAddedProductDrawer = true
          
          if (!this.$session.keyExists('session_id')) {
            this.$session.create('session_id', data.session_id)
          }
        })
      }
    },
  }
})
</script>

<style lang="scss" scoped>
#product-variant.router-link-exact-active {
  opacity: 0.5;
}
</style>
