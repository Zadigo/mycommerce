<template>
  <article :data-id="product.id" :aria-label="product.name" class="relative" @mouseover="isHovered=true" @mouseleave="isHovered=false">
    <div v-if="product.display_new" class="absolute right-1/16 top-1/30 z-10">
      <TailBadge>
        {{ $t('Nouveau') }}
      </TailBadge>
    </div>
    
    <!-- Carousel -->
    <ProductCardCarousel :product="product" :is-hovered="isHovered" :show-carousel="showCarousel" @has-navigated="emit('has-navigated', [index, product])" />
    
    <!-- Cart -->
    <ProductCardCart :product="product" :is-hovered="isHovered" :show-cart="showCart" />

    <!-- Price -->
    <div v-if="showPrices" class="mt-4 flex justify-between align-top gap-5">
      <div id="price">
        <h3 class="text-sm text-gray-700">
          <NuxtLink id="link-product-card-info" :to="`/shop/${product.id}`" @click="emit('has-navigated', [index, product])">
            <span aria-hidden="true" class="absolute inset-0" />
            {{ product.name }}
          </NuxtLink>
        </h3>
        
        <p v-if="typeof product.get_price === 'number'" class="font-semibold text-sm">
          {{ $n(product.get_price, 'currency') }}
        </p>

        <p v-else class="font-semibold text-sm">
          {{ $n(parseFloat(product.get_price), 'currency') }}
        </p>
      </div>
      
      <div class="flex align-center">
        <button type="button" class="bg-white rounded-full p-2" @click="proxyHandleLike">
          <Icon v-if="isLiked" name="fa:heart" size="13" />
          <Icon v-else name="fa-regular:heart" size="13" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Product } from '~/types'

const props = defineProps({
  index: {
    type: Number,
    required: false,
    default: null
  },
  product: {
    type: Object as PropType<Product>,
    required: true
  },
  showLikeButton: {
    type: Boolean,
    default: true
  },
  showCarousel: {
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
   * This emit is used to indicate to parents
   * hosting this component that a navigation occured. This
   * is useful for Google Analytics for example or for passing
   * information on a product on which the link was clicked
   */
  'has-navigated'(_data: (number | Product)[]) {
    return true
  }
})

// const { gtag } = useGtag()
const { handleLike, isLiked } = useLikeComposable(props.product)

function proxyHandleLike () {
  handleLike()

  // TODO: G-Analytics
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

const isHovered = ref(false)
</script>
