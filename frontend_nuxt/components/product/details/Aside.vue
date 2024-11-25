<template>
  <div id="product-aside" class="col-4 ms-5 mt-4">
    <!-- Information -->
    <h1 class="h3 fw-light" aria-label="Product name">
      {{ product?.name }}
    </h1>

    <!-- Reference -->
    <p class="fw-light text-body-secondary mb-2" aria-label="Product reference">
      Ref. {{ product?.id }}
    </p>

    <!-- Price -->
    <BaseSkeleton :loading="isLoading" class="mb-3" width="50px">
      <p class="h5 fw-bold mb-3" aria-label="Product price">
        {{ translatePrice(product?.get_price) }}
      </p>
    </BaseSkeleton>

    <!-- Variants -->
    <div v-if="hasColorVariants" id="variants" class="d-flex justify-content-start align-items-center gap-1 my-4">
      <div v-for="variant in product?.variants" :key="variant.id" class="variant">
        <NuxtLink id="product-variant" :to="`/shop/${variant.id}`" :aria-label="`${variant.id} ${variant.color}`">
          <v-img :src="mediaPath(variant.get_main_image?.original)" :alt="variant.color" width="50" />
        </NuxtLink>
      </div>
    </div>

    <hr class="my-5 text-body-tertiary">

    <!-- Sizes -->
    <ProductSizeBlock v-if="product" :sizes="product.sizes" @update-size="handleSizeSelection" />

    <!-- Size Guide -->
    <div class="d-flex justify-content-start gap-3 mt-4 mb-2">
      <a href="#" class="btn btn-light btn-rounded fw-bold shadow-none" @click.prevent="showSizeGuideDrawer=true">
        <font-awesome icon="ruler" class="me-2" /> {{ $t('Guide des tailles') }}
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

      <button type="button" class="btn btn-lg shadow-none btn-rounded btn-light" aria-label="Like product" @click="handleLike(product)">
        <font-awesome v-if="isLiked" :icon="['fas', 'heart']" />
        <font-awesome v-else :icon="['far', 'heart']" />
      </button>
    </div>

    <!-- Additional Information -->
    <ProductDetailsAdditionalInfo />

    <!-- Delivery Types -->
    <ProductDetailsDeliveryType>
      <ProductDetailsDeliveryTypes icon-name="shop" text="Enlèvement en magasin" />
      <ProductDetailsDeliveryTypes icon-name="truck" text="Livraison standard à domicile" />
    </ProductDetailsDeliveryType>

    <!-- Modals -->
    <ModalsSizeGuide :product="product" :show-modal="showSizeGuideDrawer" />
  </div>
</template>

<script lang="ts" setup>
import { useSessionStorage, useLocalStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { CartUpdateAPIResponse, Product } from '~/types';

const { showAddedProductDrawer } = storeToRefs(useCart())

const { translatePrice, isLiked, handleLike } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
const { showSizeSelectionWarning, addToCart, userSelection } = useCartComposable()

const cart = useLocalStorage<CartUpdateAPIResponse>('cart', null)
const sessionId = useSessionStorage<string | null>('session_id', null)

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  product: {
    type: Object as PropType<Product | null>,
    required: true
  }
})

provide('userSelection', userSelection)

const showSizeGuideDrawer = ref(false)

/**
 * Indicates if the product has other color variants     * 
 */
const hasColorVariants = computed(() => {
  return props.product.variants.length > 0
})

/**
 * Actions where the user selects a given size
 * for a given product 
 */
function handleSizeSelection (size: string | number | undefined) {
  userSelection.value.size = size
}

/**
 * Handles the action of adding a product
 * to the current user's cart. Products that
 * require a size will force the user to
 * select a size before handling the action
 */
async function handleAddToCart () {
  if (props.product) {
    addToCart(props.product, null, (data) => {
      showAddedProductDrawer.value = true
      cart.value = data
      sessionId.value = data.session_id
      
      // if (!sessionId.value) {
      // }
    })
  }
}
</script>

<style lang="scss" scoped>
#product-variant.router-link-exact-active {
  opacity: 0.5;
}
</style>
