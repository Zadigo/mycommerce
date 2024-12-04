<template>
  <div id="product-aside" ref="productAside" class="position-relative">
    <!-- Information -->
    <h1 class="h3" aria-label="Product name">
      {{ product?.name }}
    </h1>

    <!-- Reference -->
    <p class="fw-light text-body-secondary mb-2" aria-label="Product color and reference">
      {{ product?.color }} · Ref. 0623/152/505
    </p>

    <!-- Price -->
    <BaseSkeleton :loading="isLoading" class="mb-3" width="50px">
      <p v-if="product?.on_sale" class="h5 fw-bold mb-3 d-flex gap-2">
        <span class="text-danger">
          {{ translatePrice(product?.sale_price) }}
        </span>

        <span class="text-danger">
          {{ translatePrice(product?.sale_value) }}
        </span>

        <span>
          <strike>
            {{ translatePrice(product?.unit_price) }}
          </strike>
        </span>
      </p>

      <p v-else class="h5 fw-bold mb-3" aria-label="Product price">
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

    <hr class="my-4 text-body-tertiary">

    <!-- Sizes -->
    <ProductSizeBlock v-if="product" :sizes="product.sizes" @update-size="handleSizeSelection" />

    <!-- Size Guide -->
    <p class="text-small mt-3 mb-1 fw-light">Taille et hauteur du mannequin : S · 172 cm</p>
    <div class="d-flex justify-content-start gap-3 mb-2">
      <a href="#" class="text-small fw-bold shadow-none btn-link" @click.prevent="showSizeGuideDrawer=true">
        <font-awesome icon="ruler" class="me-1" /> {{ $t('Guide des tailles') }}
      </a>
    </div>

    <transition id="choose-size" tag="div" name="opacity">
      <p v-if="showSizeSelectionWarning" class="text-danger fs-6 fw-light mb-1">
        {{ $t("Tu dois sélectionner une taille") }}
      </p>
    </transition>

    <div class="actions d-flex justify-content-start gap-1 my-4">
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
    <ProductDetailsDeliveryType class="mt-3">
      <ProductDetailsDeliveryTypes class="text-small" icon-name="shop" text="Enlèvement en magasin" />
      <ProductDetailsDeliveryTypes class="text-small" icon-name="truck" text="Livraison standard à domicile" />
    </ProductDetailsDeliveryType>

    <!-- Modals -->
    <ModalsSizeGuide :product="product" :show-modal="showSizeGuideDrawer" @close="showSizeGuideDrawer=false" />
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage, useSessionStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { CartUpdateAPIResponse, Product } from '~/types';

const { showAddedProductDrawer } = storeToRefs(useCart())

const { translatePrice, isLiked, handleLike } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
const { showSizeSelectionWarning, addToCart, userSelection } = useCartComposable()

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  product: {
    type: Object as PropType<Product | null>,
    required: true
  },
  sticky: {
    type: Boolean,
    default: false
  }
})

const cart = useSessionStorage<CartUpdateAPIResponse>('cart', null, {
  deep: true,
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    },
  }
})

const likedProducts = useLocalStorage<number[]>('likedProducts', [], {
  deep: true,
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const showSizeGuideDrawer = ref(false)
const productAside = ref<HTMLElement>()

provide('userSelection', userSelection)

/**
 * Indicates if the product has other color variants     * 
 */
const hasColorVariants = computed(() => {
  if (props.product) {
    return props.product.variants.length > 0
  } else {
    return false
  }
})

// onMounted(() => {
//   if (props.sticky) {
//     productAside.value?.classList.add('fixed-aside')
//   }
// })

/**
 * Actions where the user selects a given size
 * for a given product 
 */
function handleSizeSelection (size: string | number | null | undefined) {
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
    }, (data) => {
      const accessToken = useCookie('access')
      const refreshToken = useCookie('refresh')

      accessToken.value = data.access
      refreshToken.value = data.refresh

      addToCart(props.product, null, (cartData) => {
        showAddedProductDrawer.value = true
        cart.value = cartData
      })
    })
  }
}
</script>

<style lang="scss" scoped>
h1.h3 {
  font-size: 1.3rem;
}

#product-variant.router-link-exact-active {
  opacity: 0.5;
}

.fixed-aside {
  position: sticky;
  top: 0;
}
</style>
