<template>
  <div id="product-aside" ref="productAside" class="position-relative ps-5">
    <!-- Information -->
    <template v-if="product">
      <h1 :aria-label="product?.name" class="h3">
        {{ product.name }}
      </h1>
    </template>

    <template v-else>
      <BaseSkeleton :loading="isLoading" height="20px" width="200px" class="mb-2" />
    </template>

    <!-- Price -->
    <template v-if="product">
      <p v-if="product?.on_sale" class="h5 fw-bold mb-3 d-flex gap-2">
        <span class="text-danger">
          {{ translatePrice(product?.sale_price) }}
        </span>

        <span class="text-danger">
          {{ translatePrice(product?.sale_value) }}
        </span>

        <span>
          <s>
            {{ translatePrice(product?.unit_price) }}
          </s>
        </span>
      </p>

      <p v-else class="h5 fw-bold mb-3" aria-label="Product price">
        {{ translatePrice(product?.get_price) }}
      </p>
    </template>

    <template v-else>
      <BaseSkeleton :loading="isLoading" height="20px" width="100px" class="mb-3" />
    </template>

    <!-- Variants -->
    <div v-if="hasColorVariants" id="variants" class="d-flex justify-content-start align-items-center gap-1 my-4">
      <div v-for="variant in product?.variants" :key="variant.id" class="variant">
        <NuxtLink id="product-variant" :to="`/shop/${variant.id}`" :aria-label="`${variant.id} ${variant.color}`">
          <v-img :src="mediaPath(variant.get_main_image?.original)" :alt="variant.color" width="50" />
        </NuxtLink>
      </div>
    </div>

    <!-- Reference -->
    <p id="product-reference" class="text-small mb-2" aria-label="Product color and reference">
      {{ product?.color }} · Ref. 0623/152/505
    </p>

    <hr class="my-4 text-body-tertiary">

    <!-- Sizes -->
    <ProductSizeBlock v-if="product" ref="sizeEl" :sizes="product.sizes" @update-size="handleSizeSelection" />

    <!-- Size Guide -->
    <p class="text-small mt-3 mb-1">
      Taille et hauteur du mannequin : S · 172 cm
    </p>

    <div class="d-flex justify-content-start gap-3 mb-2">
      <a href="#" class="text-small fw-bold shadow-none btn-link link-dark text-decoration-underline" @click.prevent="emit('show-size-guide')">
        {{ $t('Guide des tailles') }}
      </a>
    </div>

    <Transition id="choose-size" tag="div" name="opacity">
      <p v-if="showSizeSelectionWarning" class="text-danger fs-6 fw-light mb-1">
        {{ $t("Tu dois sélectionner une taille") }}
      </p>
    </Transition>

    <div class="actions d-flex justify-content-start gap-1 my-4">
      <button id="btn-add-to-cart" type="button" class="btn btn-success btn-lg shadow-none btn-rounded" aria-label="Add to cart" @click="handleAddToCart">
        <font-awesome v-if="stockState && stockState.almost_sold_out" icon="clock-rotate-left" class="text-warning me-2" />
        <v-progress-circular v-if="addingToCartState" color="light" indeterminate />
        <span v-else>{{ $t('Ajouter au panier') }}</span>
      </button>

      <button type="button" class="btn btn-lg shadow-none btn-rounded btn-light" aria-label="Like product" @click="proxyHandleLike">
        <font-awesome v-if="isLiked" :icon="['fas', 'heart']" />
        <font-awesome v-else :icon="['far', 'heart']" />
      </button>
    </div>

    <!-- Additional Information -->
    <ProductDetailsAdditionalInfo />

    <!-- Delivery Types -->
    <ProductDetailsDeliveryType class="mt-3">
      <ProductDetailsDeliveryTypes class="text-small" icon-name="shop" text="Enlèvement en magasin" />
      <ProductDetailsDeliveryTypes class="text-small" icon-name="truck" text="Livraison standard à domicile" sub-text="Pour toute commande supérieure à 45,00 €" />
    </ProductDetailsDeliveryType>
  </div>
</template>

<script lang="ts" setup>
import { useLocalStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { Product, ProductStock } from '~/types';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  product: {
    type: Object as PropType<Product | null>,
    required: true,
    default: null
  }
})

const emit = defineEmits({
  'show-size-guide' () {
    return true
  }
})

const { showAddedProductDrawer } = storeToRefs(useCart())

const { translatePrice, isLiked, handleLike } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
const { showSizeSelectionWarning, addToCart, userSelection, addingToCartState } = useCartComposable()
const { gtag } = useGtag()

const likedProducts = useLocalStorage<number[]>('likedProducts', [], {
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const cartStore = useCart()

const sizeEl = ref<HTMLElement>()
const productAside = ref<HTMLElement>()

provide('userSelection', userSelection)

const stockState = inject<ProductStock>('stockState')

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

// Actions where the user selects a given size
// for a given product 
function handleSizeSelection (size: string | number | null | undefined) {
  userSelection.value.size = size
}

function proxyHandleLike () {
  const result = handleLike(likedProducts.value, props.product)
  const state = result[0]

  likedProducts.value = result[1]
  isLiked.value = !isLiked.value

  if (state) {
    gtag('event', 'add_to_wishlist', {
      items: {
        item_id: props.product?.id,
        item_name: props.product?.name,
        price: props.product?.get_price,
        quantity: 1,
        item_brand: null,
        item_category: props.product?.category,
        item_category2: props.product?.sub_category,
        item_variant: props.product?.color,
        index: 0,
        item_reference: null
      }
    })
  }
}

// Handles the action of adding a product
// to the current user's cart. Products that
// require a size will force the user to
// select a size before handling the action
async function handleAddToCart () {
  if (props.product) {
    addToCart(props.product, null, (data) => {
      if (cartStore.sessionCache) {
        cartStore.sessionCache.cart = data
      }
      
      showAddedProductDrawer.value = true

      gtag('event', 'add_to_cart',  {
        currency: 'EUR',
        value: props.product?.get_price,
        items: [
          {
            item_id: props.product?.id,
            item_name: props.product?.name,
            price: props.product?.get_price,
            quantity: 1,
            item_brand: null,
            item_category: props.product?.category,
            item_category2: props.product?.sub_category,
            item_variant: props.product?.color,
            index: 0,
            item_reference: null,
            size: userSelection.value.size
          }
        ]
      })

      if (sizeEl.value) {
        sizeEl.value.resetSize()
      }
    }, (error) => {
      // FIXME: Error is not LoginAPIResponse so change
      // the ts to fit the correct error response
      console.error('handleAddToCart', error)
    })
  }
}

onMounted(() => {
  if (props.product) {
    isLiked.value = likedProducts.value.includes(props.product.id)
  }
})
</script>

<style lang="scss" scoped>
$font_size: 0.8rem;

h1.h3 {
  font-size: 1.3rem;
  font-weight: 400;
}

#product-variant.router-link-exact-active {
  opacity: 0.5;
}

.fixed-aside {
  position: sticky;
  top: 0;
}
</style>
