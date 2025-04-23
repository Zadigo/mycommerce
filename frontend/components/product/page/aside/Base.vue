<template>
  <aside v-if="product" id="product-details" class="col-span-4 px-10">
    <h1 id="product-name" :aria-label="product.color_variant_name" class="text-lg mt-5 font-normal">
      {{ product.name }}
    </h1>
    
    <template v-if="product">
      <div v-if="product.on_sale" class="font-bold text-lg inline-flex gap-2 mt-1">
        <span class="text-red-400">{{ translatePrice(product.get_price) }}</span>
        <span class="text-black"><s>{{ translatePrice(product.unit_price) }}</s></span>
      </div>

      <p v-else class="font-bold text-xl mt-1">
        {{ translatePrice(product.get_price) }}
      </p>
    </template>

    <div v-if="product.variants" id="variants" class="my-5 flex gap-2 h-auto w-full">
      <NuxtLink id="link-product-variant" v-for="variant in product.variants" :key="variant.id" :to="`/shop/${variant.id}`" aria-current="true">
        <NuxtImg :src="mediaPath(variant.get_main_image?.original, '/placeholder.svg')" alt="variant.name" width="50" class="cursor-pointer hover:opacity-80" />
      </NuxtLink>
    </div>

    <p id="product-reference" class="font-light text-sm my-5">
      {{ $t(product.color) }} · Réf. {{ product.sku }}
    </p>
    
    <div class="border-t-2 border-gray-100 my-5 me-10" />

    <!-- Actions -->
    <ProductPageAsideActions :product="product" />

    <TailList class="shadow-none border border-gray-100 mt-10">
      <TailListItem class="border-b-2 border-gray-100 flex justify-between items-center text-sm" @click="emit('show-composition-guide')">
        <div class="flex justify-start gap-2">
          <span>{{ $t('Composition, soin et traçabilité') }}</span>
        </div>
        <Icon name="fa:chevron-right" size="10" />
      </TailListItem>

      <TailListItem class="flex justify-between text-sm" @click="emit('show-delivery-guide')">
        {{ $t('Livraison et retours') }}
        <Icon name="fa:chevron-right" size="10" />
      </TailListItem>
    </TailList>
  </aside>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { Product } from '~/types'

const props = defineProps({
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

const { translatePrice } = useShopComposable()
const { mediaPath } = useDjangoUtilies()
// const { gtag } = useGtag()

/**
 * Indicates if the product has other color variants
 */
const hasColorVariants = computed(() => {
  if (props.product) {
    return props.product.variants.length > 0
  } else {
    return false
  }
})
</script>

<style lang="scss" scoped>
#product-variant.router-link-exact-active {
  opacity: 0.5;
}

.fixed-aside {
  position: sticky;
  top: 0;
}
</style>
