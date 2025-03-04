<template>
  <aside v-if="product" id="product-details" class="col-span-4 px-10">
    <DevOnly>
      <div class="fixed top-2 left-0 w-2/4 z-50 bg-yellow-200 rounded-md shadow-md p-10">
        {{ product }}
      </div>
    </DevOnly>

    <h1 id="product-name" :aria-label="product.color_variant_name" class="text-xl mt-5 font-semibold">
      {{ product.name }}
    </h1>
    
    <template v-if="product">
      <div v-if="product.on_sale" class="font-bold text-xl inline-flex gap-2">
        <span class="text-red-400">{{ translatePrice(product.get_price) }}</span>
        <span class="text-red-400">{{ translatePrice(product.sale_value) }}</span>
        <span class="text-black"><s>{{ translatePrice(product.unit_price) }}</s></span>
      </div>

      <p v-else class="font-bold text-xl">
        {{ translatePrice(product?.unit_price) }}
      </p>
    </template>

    <div v-if="product.variants" id="variants" class="my-5 flex gap-2 h-auto w-full">
      <NuxtLink id="variant" v-for="variant in product.variants" :key="variant.id" :to="`/shop/${variant.id}`" aria-current="true">
        <!-- TODO: Missing variant name or color variant name -->
        <NuxtImg :src="mediaPath(variant.get_main_image?.original, '/placeholder.svg')" alt="variant.name" width="50" class="cursor-pointer hover:opacity-80" />
      </NuxtLink>
    </div>

    <p id="product-reference" class="font-light text-sm my-5">
      {{ $t(product.color) }} · Réf.. 0544/360/400
    </p>
    
    <div class="border-t-2 border-gray-100 my-5 me-10" />

    <div v-if="product" id="sizes" class="inline-flex gap-2 mb-4">
      <button v-for="size in product.sizes" :key="size.id" type="button" :class="{'bg-gray-200': userSelection.size === size.name, 'bg-gray-50': userSelection.size !== size.name }" class="rounded-full w-10 h-10 text-sm font-normal place-content-center hover:bg-gray-100 hover:border-2 hover:border-gray-100" @click="handleSizeSelection(size.name)">
        <Icon v-if="!size.availability" name="fa-regular:clock" size="12" class="text-orange-400" />
        {{ size.name }}
      </button>
    </div>
    <BaseSkeleton v-else :loading="true" />

    <p class="font-light">
      {{ $t('Taille et hauteur du mannequin') }} : 
      <span v-if="product.model_height">{{ product.model_size }} · {{ product.model_height }} cm</span> 
      <span v-else>N.D.</span>
    </p>
    <NuxtLink to="#" class="text-sm font-semibold underline underline-offset-2 block mt-2" @click="emit('show-size-guide')">
      {{ $t('Guide des tailles') }}
    </NuxtLink>
    
    <Transition mode="out-in" class="transition-all duration-300">
      <BaseButton v-if="userSelection.size !== '' && sizeObject && !sizeObject.availability" class="mt-10 place-content-center" color="dark" tonal @click="showAvailabilityModal=true">
        <Icon name="fa:envelope" size="12" class="me-1" />
        {{ $t('Me tenir informer') }}
      </BaseButton>

      <BaseButton v-else class="mt-10" color="primary" tonal :disabled="false" @click="handleAddToCart">
        <font-awesome v-if="stockState && stockState.almost_sold_out" icon="clock" class="me-1" />
        {{ $t('Ajouter au panier') }}
      </BaseButton>
    </Transition>

    <BaseButton aria-label="Ajouter au favori" @click="proxyHandleLike">
      <font-awesome v-if="isLiked" icon="heart" />
      <font-awesome v-else :icon="['far', 'heart']" />
    </BaseButton>

    <BaseList class="shadow-none border border-gray-100 mt-5">
      <BaseListitem class="border-b-2 border-gray-100 flex justify-between items-center text-sm" @click="emit('show-composition-guide')">
        <div class="flex justify-start gap-2">
          <span>{{ $t('Composition, soin et traçabilité') }}</span>
        </div>
        <Icon name="fa:chevron-right" size="10" />
      </BaseListitem>

      <BaseListitem class="flex justify-between text-sm" @click="emit('show-delivery-guide')">
        {{ $t('Livraison et retours') }}
        <Icon name="fa:chevron-right" size="10" />
      </BaseListitem>
    </BaseList>
  </aside>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { Product, ProductStock } from '~/types';

const props = defineProps({
  isLoading: {
    type: Boolean,
    default: true
  },
  product: {
    type: Object as PropType<Product>,
    required: true
  }
})

const emit = defineEmits({
  'show-size-guide' () {
    return true
  },
  'show-delivery-guide'() {
    return true
  },
  'show-composition-guide'() {
    return true
  }
})

const { showAddedProductDrawer } = storeToRefs(useCart())

const { translatePrice, isLiked, handleLike } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
const { showSizeSelectionWarning, addToCart, userSelection, addingToCartState } = useCartComposable()
// const { gtag } = useGtag()

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

const showAvailabilityModal = ref(false)
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

const sizeObject = computed(() => {
  if (props.product) {
    return props.product.sizes.find(x => x.name === userSelection.value.size) || null
  } else {
    return null
  }
})

// Actions where the user selects a given size
// for a given product 
function handleSizeSelection (size: string | number | null | undefined) {
  userSelection.value.size = size
}

function proxyHandleLike () {
  const result = handleLike(likedProducts.value, props.product)
  likedProducts.value = result
  isLiked.value = !isLiked.value

  // gtag('event', 'add_to_wishlist', {
  //   items: {
  //     item_id: props.product?.id,
  //     item_name: props.product?.name,
  //     price: props.product?.get_price,
  //     quantity: 1,
  //     item_brand: null,
  //     item_category: props.product?.category,
  //     item_category2: props.product?.sub_category,
  //     item_variant: props.product?.color,
  //     index: 0,
  //     item_reference: null
  //   }
  // })
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

      // gtag('event', 'add_to_cart',  {
      //   currency: 'EUR',
      //   value: props.product?.get_price,
      //   items: [
      //     {
      //       item_id: props.product?.id,
      //       item_name: props.product?.name,
      //       price: props.product?.get_price,
      //       quantity: 1,
      //       item_brand: null,
      //       item_category: props.product?.category,
      //       item_category2: props.product?.sub_category,
      //       item_variant: props.product?.color,
      //       index: 0,
      //       item_reference: null,
      //       size: userSelection.value.size
      //     }
      //   ]
      // })

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
