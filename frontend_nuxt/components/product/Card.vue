<template>
  <article :data-id="product.id" :aria-label="product.name" class="card shadow-none rounded-0" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <NuxtLink :to="`/shop/${product.id}`">
      <NuxtImg :src="mediaPath(product.get_main_image?.original, '/placeholder.svg')" class="card-img rounded-0" />
    </NuxtLink>

    <!-- Cart -->
    <div v-if="isHovered && showCart" class="card-cover p-4">
      <div class="row text-center">
        <div class="col-12">
          <div v-if="requiresSizeItems" class="size-items">
            <p class="fw-light">
              {{ $t("Sélectionne la taille") }}
            </p>
            
            <div class="d-flex justify-content-around flex-wrap gap-1">
              <ProductSizeButton v-for="size in product.sizes" :key="size.id" :size="size" @update:selected-size="handleAddToCart" />
            </div>
          </div>

          <v-btn v-else variant="outlined" color="primary" block rounded @click="handleAddToCart">
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
</template>

<script lang="ts" setup>
import type { PropType } from 'vue';
import type { Product } from '~/types';

const props = defineProps({
  product: {
    type: Object as PropType<Product>,
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

const { isLiked } = useShopComposable()
const { addToCart } = useCartComposable()
const { mediaPath } = useDjangoUtilies()
const isHovered = ref(false)

const requiresSizeItems = computed(() => {
  return props.product.sizes.length > 0
})

async function handleAddToCart (size?: string | number) {
  await addToCart(props.product,  size, (_data) => {
  
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

.card-cover {
  position: absolute;
  bottom: 16%;
  left: 2%;
  right: 2%;
  height: auto;
  width: 96%;
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
