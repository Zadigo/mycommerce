<template>
  <article v-if="product" :data-id="product.id" :aria-label="product.name" class="card shadow-none rounded-0" @mouseenter="isHovered=true" @mouseleave="isHovered=false">
    <NuxtLink :to="`/shop/${product.id}`" @click="emit('has-navigated', [index, product])">
      <NuxtImg :src="mediaPath(product.get_main_image?.original, '/placeholder.svg')" format="webp" class="card-img rounded-0" />
    </NuxtLink>

    <!-- Cart -->
    <div v-if="isHovered && showCart" ref="cardCoverEl" class="card-cover p-4">
      <div class="row text-center">
        <div class="col-12">
          <div v-if="requiresSizeItems" class="size-items">
            <p id="size-text">
              {{ $t("Sélectionne la taille") }}
            </p>
            
            <div class="d-flex justify-content-center flex-wrap gap-1">
              <ProductSizeButton v-for="size in product.sizes" :key="size.id" :size="size" custom-class="border-none" @update:selected-size="handleAddToCart" />
            </div>
          </div>

          <v-btn v-else variant="plain" color="dark" block rounded @click="handleAddToCart('Unique')">
            {{ $t('Ajouter au panier') }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Heart -->
    <button v-if="showLikeButton" id="btn-like-product" type="button" class="btn btn-light btn-floating" aria-label="Like product" @click="proxyHandleLike">
      <font-awesome v-if="isLiked" icon="heart" />
      <font-awesome v-else :icon="['far', 'heart']" />
    </button>

    <!-- Infos -->
    <NuxtLink v-show="showPrices" :to="`/shop/${product.id}`" class="link-dark" @click="emit('has-navigated', [index, product])">
      <div class="card-body pt-0 px-2 pb-0">
        <p id="product-name" class="mb-0 mt-1 fw-light" :aria-label="product.name">
          {{ product.name }}
        </p>
        
        <p class="pricing fw-bold">
          <template v-if="typeof product.get_price === 'number'">
            {{ $n(product.get_price, 'currency') }}
          </template>

          <template v-else>
            {{ $n(parseFloat(product.get_price), 'currency') }}
          </template>
        </p>
      </div>
    </NuxtLink>
  </article>

  <article v-else>
    <BaseSkeleton :loading="true" height="427px" />
    <BaseSkeleton :loading="true" height="10px" />
    <BaseSkeleton :loading="true" height="10px" width="50px" />
  </article>
</template>

<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { Product } from '~/types';

const props = defineProps({
  index: {
    type: Number,
    required: false,
    default: null
  },
  product: {
    type: Object as PropType<Product | undefined>,
    required: true
  },
  showLikeButton: {
    type: Boolean,
    default: true
  },
  showCart: {
    type: Boolean,
    default: true
  },
  showPrices: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits({
  /** 
   * This emit is used to indicate to parent components
   * hosting this component that a navigation occured. This
   * is useful for Google Analytics for example
   */
  'has-navigated'(_data: (number | Product)[]) {
    return true
  }
})

const cartStore = useCart()
// const { gtag } = useGtag()
const { showAddedProductDrawer } = storeToRefs(cartStore)
const { handleLike, isLiked } = useShopComposable()
const { addToCart } = useCartComposable()
const { mediaPath } = useDjangoUtilies()

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

const isHovered = ref(false)
const cardCoverEl = ref<HTMLElement>()

const requiresSizeItems = computed(() => {
  if (props.product) {
    return props.product.sizes.length > 0
  } else {
    return false
  }
})

async function handleAddToCart (size?: string | number) {
  if (props.product) {
    await addToCart(props.product,  size, (data) => {
      showAddedProductDrawer.value = true

      if (cartStore.sessionCache) {
        cartStore.sessionCache.cart = data
      }
    })
  } else {
    console.error('Card', 'Props does not have a product')
  }
}

function proxyHandleLike () {
  const result = handleLike(likedProducts.value, props.product)
  const state = result[0]

  likedProducts.value = result[1]
  isLiked.value = !isLiked.value

  if (state) {
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
}

onMounted(() => {
  if (props.product) {
    isLiked.value = likedProducts.value.includes(props.product.id)
  }
})
</script>

<style lang="scss" scoped>
$base_cover_bottom_position: 13%;

#btn-like-product {
  position: absolute;
  top: 5%;
  right: 5%;
}

#size-text {
  font-size: 0.8rem;
}

.card-cover {
  position: absolute;
  bottom: $base_cover_bottom_position;
  height: auto;
  width: 99%;
  background-color: white;
  left: 50%;
  transform: translateX(-50%);

  &-enter-active,
  &-leave-active {
    transition: all .3s ease-in;
  }
  
  &-enter-to,
  &-enter-from {
    opacity: 0;
  }
  
  &-enter-from,
  &-enter-to {
    opacity: 1;
  }
}

@function adjust_bottom($value, $add) {
  @return calc($value - $add);
}

@media screen and (min-width: 1440px) and (max-width: 1920px) {
  .card-cover {
    bottom: adjust_bottom($base_cover_bottom_position, 3%);
  }
}

@media screen and (min-width: 1921px) {
  .card-cover {
    bottom: adjust_bottom($base_cover_bottom_position, 3%);
  }
}

p#product-name {
  font-size: .85rem;
}

.pricing {
  font-size: 0.90rem;
}
</style>
