<template>
  <aside v-if="product" id="product-details" class="col-span-4 px-10">
    <ProductPageAsideInfo :product="product" />

    <div v-if="hasColorVariants" id="variants" class="my-5 flex gap-2 h-auto w-full">
      <NuxtLinkLocale  id="link-product-variant" v-for="variant in product.variants" :key="variant.id" :to="`/shop/${variant.id}`" aria-current="true">
        <NuxtImg :src="mediaPath(variant.get_main_image?.original, '/placeholder.svg')" alt="variant.name" width="50" class="cursor-pointer hover:opacity-80" />
      </NuxtLinkLocale >
    </div>

    <p v-if="product" id="product-reference" class="font-light text-sm my-5">
      {{ $t(product.color) }} · {{ $t('Product: Sku', { sku: product.sku }) }}
    </p>
    
    <volt-divider />

    <!-- Actions -->
    <ProductPageAsideActions :product="product" @size-guide="emit('size-guide')" @availability-modal="emit('availability-modal')" />

    <!-- Info. More -->
    <volt-list-group :items="items" class="my-5" />
  </aside>
</template>

<script setup lang="ts">
import type { Product, Undefineable } from '~/types'

const props = defineProps<{ product: Undefineable<Product>}>()
const emit = defineEmits<{ 
  'size-guide': [], 
  'delivery-guide': [], 
  'composition-guide': [], 
  'availability-modal': [] 
}>()

const { mediaPath } = useDjangoUtilies()
const { hasColorVariants } = useProductComposable(props.product)

// const { gtag } = useGtag()

/**
 * 
 */

/**
 * List group items
 */

const items = [
  {
    label: 'Composition, soin et traçabilité',
    icon: 'i-lucide:info',
    action: () => emit('composition-guide')
  },
  {
    label: 'Livraison et retours',
    icon: 'i-lucide:truck',
    action: () => emit('delivery-guide')
  }
]
</script>

<style scoped>
.router-link-exact-active img {
  opacity: .5;
}
</style>
