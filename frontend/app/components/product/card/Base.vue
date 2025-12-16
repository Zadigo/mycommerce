<template>
  <article class="relative" @mouseover="isHovered=true" @mouseleave="isHovered=false">
    <div v-if="product.node.displayNew" class="absolute right-1/16 top-1/30 z-10">
      <volt-badge>
        {{ $t('Nouveau') }}
      </volt-badge>
    </div>
    
    <!-- Carousel -->
    <product-card-carousel :product="product" :index="index" :is-hovered="isHovered" :show-carousel="showCarousel" @has-navigated="emit('has-navigated', [index, product])" />
    
    <!-- Cart -->
    <product-card-cart :product="product" :is-hovered="isHovered" :show-cart="showCart" />

    <!-- Price -->
    <div v-if="showPrices" class="mt-4 flex justify-between align-top gap-5">
      <div id="price">
        <h3 class="text-sm text-gray-700">
          <nuxt-link-locale  id="link-product-card-info" :to="`/shop/${product.node.id}`" @click="emit('has-navigated', [index, product])">
            <span aria-hidden="true" class="absolute inset-0" />
            {{ product.node.name }}
          </nuxt-link-locale >
        </h3>
        
        <p v-if="typeof product.node.price === 'number'" class="font-semibold text-sm">
          {{ $n(product.node.price, 'currency') }}
        </p>

        <p v-else class="font-semibold text-sm">
          {{ $n(parseFloat(product.node.price), 'currency') }}
        </p>
      </div>
      
      <div class="flex align-center">
        <button type="button" class="bg-white rounded-full p-2" @click="like">
          <icon :name="icon" size="13" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { useAnalyticsCallback } from '~/composables/use/analytics'
import type { ProductNode } from '~/types'

const props = defineProps<{
  index: number
  product: ProductNode
  showLikeButton?: boolean
  showCarousel?: boolean
  showCart?: boolean
  showPrices?: boolean
}>()

console.log('props.product', props.product)

/** 
 * This emit is used to indicate to parents
 * hosting this component that a navigation occured. This
 * is useful for Google Analytics for example or for passing
 * information on a product on which the link was clicked
 */
const emit = defineEmits<{ 'has-navigated': [data: (number | ProductNode)[]] }>()

// const { gtag } = useGtag()
const { triggerEvent } = useAnalyticsCallback(props.product, props.index)

/**
 * Like/Wishlist
 */

const { like, isLiked, icon } = await useLikeComposable(props.product, triggerEvent)

const isHovered = ref<boolean>(false)
const productEl = useTemplateRef<HTMLDivElement>('productEl')

// if (import.meta.client) {
//   const { isOutside } = useMouseInElement(productEl)
//   isHovered.value = !isOutside.value
// }
</script>
