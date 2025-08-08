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
    <ProductPageAsideActions :product="product" @show-size-guide="emit('show-size-guide')" />

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
import type { Product } from '~/types'

const props = defineProps<{ product: Product | null | undefined }>()
const emit = defineEmits<{ 'show-size-guide': [], 'show-delivery-guide': [], 'show-composition-guide': [] }>()

const { mediaPath } = useDjangoUtilies()
const { hasColorVariants } = useProductComposable(props.product)

// const { gtag } = useGtag()
</script>
