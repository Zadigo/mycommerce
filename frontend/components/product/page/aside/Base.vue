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

    <div v-if="product" id="sizes" class="inline-flex gap-2 mb-4">
      <button v-for="size in product.sizes" :key="size.id" type="button" :class="{'bg-gray-200': userSelection.size === size.name, 'bg-gray-50': userSelection.size !== size.name }" class="rounded-full w-10 h-10 text-sm font-normal place-content-center hover:bg-gray-100 hover:border-2 hover:border-gray-100" @click="handleSizeSelection(size.name)">
        <Icon v-if="!size.availability" name="fa-regular:clock" size="12" class="text-orange-400" />
        {{ size.name }}
      </button>
    </div>
    <BaseSkeleton v-else :loading="true" />

    <p class="font-light">
      {{ $t('Taille et hauteur du mannequin') }} : 
      <span v-if="product.model_height">{{ product.model_size }} · {{ product.model_height }} cm</span> 
      <span v-else>N.D.</span>
    </p>
    <NuxtLink id="link-product-size-guide" to="#" class="text-sm font-semibold underline underline-offset-2 block mt-2" @click="emit('show-size-guide')">
      {{ $t('Guide des tailles') }}
    </NuxtLink>

    <p v-if="showSizeSelectionWarning" class="text-red-400 mt-4">
      {{ $t("Choissis une taille") }}
    </p>
    
    <TailButton v-if="userSelection.size !== '' && sizeObject && !sizeObject.availability" class="mt-5 place-content-center" variant="secondary" tonal @click="showAvailabilityModal=true">
      <Icon name="fa:envelope" size="12" class="me-1" />
      {{ $t('Me tenir informer') }}
    </TailButton>
    <TailButton v-else class="mt-5 me-2 place-content-cetner" :disabled="false" @click="handleAddToCart">
      <font-awesome v-if="stockState && stockState.almost_sold_out" icon="clock" class="me-1" />
      {{ $t('Ajouter au panier') }}
    </TailButton>

    <TailButton :aria-label="$t('Ajouter au favori')" class="mt-5" variant="outline" @click="proxyHandleLike">
      <font-awesome v-if="isLiked" icon="heart" />
      <font-awesome v-else :icon="['far', 'heart']" />
    </TailButton>

    <BaseList class="shadow-none border border-gray-100 mt-10">
      <BaseListitem class="border-b-2 border-gray-100 flex justify-between items-center text-sm" @click="emit('show-composition-guide')">
        <div class="flex justify-start gap-2">
          <span>{{ $t('Composition, soin et traçabilité') }}</span>
        </div>
        <Icon name="fa:chevron-right" size="10" />
      </BaseListitem>

      <BaseListitem class="flex justify-between text-sm" @click="emit('show-delivery-guide')">
        {{ $t('Livraison et retours') }}
        <Icon name="fa:chevron-right" size="10" />
      </BaseListitem>
    </BaseList>
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
