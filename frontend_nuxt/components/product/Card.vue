<template>
  <article v-if="product" :data-id="product.id" :aria-label="product.name" class="card shadow-none rounded-0" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <NuxtLink :to="`/shop/${product.id}`">
      <NuxtImg :src="mediaPath(product.get_main_image?.original, '/placeholder.svg')" class="card-img rounded-0" />
    </NuxtLink>

    <!-- Cart -->
    <div v-if="isHovered && showCart" class="card-cover p-4">
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

          <v-btn v-else variant="outlined" color="dark" block rounded @click="handleAddToCart">
            {{ $t('Ajouter au panier') }}
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Heart -->
    <button v-if="showLikeButton" id="btn-like-product" type="button" class="btn btn-light btn-floating" aria-label="Like product" @click="handleLike(product)">
      <font-awesome v-if="isLiked" icon="heart" />
      <font-awesome v-else :icon="['far', 'heart']" />
    </button>

    <!-- Infos -->
    <NuxtLink v-show="showPrices" :to="`/shop/${product.id}`" class="link-dark">
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
  <BaseSkeleton v-else :loading="true" />
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core';
import type { PropType } from 'vue';
import type { Product } from '~/types';

const props = defineProps({
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

const cartStore = useCart()
const { showAddedProductDrawer } = storeToRefs(cartStore)
const { isLiked } = useShopComposable()
const { addToCart } = useCartComposable()
const { mediaPath } = useDjangoUtilies()

const cachedCart = useSessionStorage('cart', null, {
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

const requiresSizeItems = computed(() => {
  if (props.product) {
    return props.product.sizes.length > 0
  } else {
    return false
  }
})

async function handleAddToCart (size?: string | number) {
  await addToCart(props.product,  size, (data) => {
    showAddedProductDrawer.value = true
    cachedCart.value = data
    cartStore.cache = cachedCart.value
  })
}

async function handleLike (product: Product) {
  console.log(product)
}
</script>

<style lang="scss" scoped>
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
  bottom: 13%;
  // left: 1%;
  // right: 1%;
  height: auto;
  width: 100%;
  background-color: white;
}

.card-cover {
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

p#product-name {
  font-size: .85rem;
}

.pricing {
  font-size: 0.90rem;
}
</style>
