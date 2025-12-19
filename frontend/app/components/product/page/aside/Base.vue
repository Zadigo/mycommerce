<template>
  <aside v-if="product" id="product-details" class="col-span-4 px-10">
    <product-page-aside-info :product="product" />

    <div v-if="hasColorVariants" id="variants" class="my-5 flex gap-2 h-auto w-full">
      <nuxt-link-locale  id="link-product-variant" v-for="variant in product.node.colorVariants" :key="variant.id" :to="`/shop/${variant.id}`" aria-current="true">
        <nuxt-img :src="variant.mainImage.thumbnail" alt="variant.name" width="50" class="cursor-pointer hover:opacity-80" />
      </nuxt-link-locale >
    </div>

    <p v-if="product" id="product-reference" class="font-light text-sm my-5">
      {{ $t(product.node.color) }} · {{ $t('Product: Sku', { sku: product.node.sku }) }}
    </p>
    
    <volt-divider />

    <!-- Actions -->
    <product-page-aside-actions :product="product" @size-guide="emit('size-guide')" @availability-modal="emit('availability-modal')" />

    <!-- Info. More -->
    <volt-list-group :items="items" class="my-5" />
  </aside>
</template>

<script setup lang="ts">
import type { ProductNode, Undefineable } from '~/types'

const props = defineProps<{ product: Undefineable<ProductNode>}>()
const emit = defineEmits<{ 
  'size-guide': [], 
  'delivery-guide': [], 
  'composition-guide': [], 
  'availability-modal': [] 
}>()

const { hasColorVariants } = useProductComposable(props.product)

// const { gtag } = useGtag()

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
