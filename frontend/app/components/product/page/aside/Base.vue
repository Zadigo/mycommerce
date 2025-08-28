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
    
    <div class="border-t-2 border-gray-100 my-5 me-10" />

    <!-- Actions -->
    <ProductPageAsideActions :product="product" @size-guide="emit('size-guide')" @availability-modal="emit('availability-modal')" />

    <!-- Info. More -->
    <ProductPageAsideAdditional :product="product" @delivery-guide="emit('delivery-guide')" @composition-guide="emit('composition-guide')" />
  </aside>
</template>

<script setup lang="ts">
import type { Product } from '~/types'

const props = defineProps<{ product: Product | null | undefined }>()
const emit = defineEmits<{ 
  'size-guide': [], 
  'delivery-guide': [], 
  'composition-guide': [], 
  'availability-modal': [] 
}>()

const { mediaPath } = useDjangoUtilies()
const { hasColorVariants } = useProductComposable(props.product)

// const { gtag } = useGtag()
</script>
