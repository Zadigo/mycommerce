<template>
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
    <base-size-block :sizes="currentProduct.sizes" @update-size="(size) => { userSelection.size = size }" @show-size-guide-drawer="() => {}" />

    <!-- Size Guide -->
    <div class="d-flex justify-content-start gap-3 mt-4 mb-2">
      <a href class="btn btn-light btn-rounded fw-bold shadow-none" @click.prevent="$emit('show-size-guide')">
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
</template>

<script lang="ts">
import { defineComponent, inject } from 'vue';
import { useCartComposable  } from '@/composables/cart'
import { useShopComposable, useShopUtilities } from '@/composables/shop'
import { Product } from '@/types/shop';
import { useCart } from '@/stores/cart';
import { storeToRefs } from 'pinia';

import AdditionalInfoBlock from './AdditionalInfoBlock.vue';
import BaseSizeBlock from '../BaseSizeBlock.vue';
import DeliveryType from './DeliveryType.vue';
import DeliveryTypes from './DeliveryTypes.vue';
import BreadcrumbBlock from './BreadcrumbBlock.vue';

export default defineComponent({
  name: 'ProductAside',
  components: {
    AdditionalInfoBlock,
    BaseSizeBlock,
    BreadcrumbBlock,
    DeliveryType,
    DeliveryTypes
  },
  emits: {
    'show-size-guide' () {
      return true
    }
  },
  setup () {
    const currentProduct = inject<Product>('currentProduct')
    const isLoading = inject<boolean>('isLoading')

    const { translatePrice, parseMainImage } = useShopUtilities()
    const { isLiked, handleLike } = useShopComposable()
    const { addToCart, showSizeSelectionWarning, userSelection } = useCartComposable()

    const cartStore = useCart()
    const { showAddedProductDrawer } = storeToRefs(cartStore)

    return {
      isLiked,
      isLoading,
      currentProduct,
      showSizeSelectionWarning,
      userSelection,
      showAddedProductDrawer,
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
  methods: {
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
  }
})
</script>
