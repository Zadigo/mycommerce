<template>
  <v-navigation-drawer v-model="show" width="400" location="right" temporary>
    <v-toolbar class="border-bottom" color="white">
      <v-toolbar-title class="font-bold">
        {{ $t("Guide des tailles") }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-close" @click="show=false" />
    </v-toolbar>

    <div class="container mx-auto px-10 mb-10">
      <div class="col">
        <p class="text-1xl font-semibold mb-1">
          {{ $t("Sélectionne une taille") }}
        </p>
        
        <ProductSizeBlock v-if="product" :sizes="product.sizes" @update-size="handleSizeSelection" @show-size-guide-drawer="show=false" />
        <TailSkeleton v-else class="w-[60px] h-[20px]" />

        <p class="text-1xl font-semibold mt-4 mb-1">
          {{ $t("Mensurations") }}
        </p>

        <p class="font-light">
          {{ $t("Corps") }}
        </p>

        <div class="sizes">
          <div class="flex justify-between items-center">
            <div class="col">
              {{ $t("Tour de Poitrine") }}
            </div>
            
            <div class="col">
              82
            </div>
          </div>
        </div>
      </div>

      <div class="col mt-4 mb-10">
        <TailButton class="w-full" @click="cartStore.addToCart(product)">
          {{ $t('Ajouter au panier') }}
        </TailButton>
      </div>

      <div class="col">
        <p class="text-1xl font-bold">
          {{ $t("Comprendre tes mesures ?") }}
        </p>

        <NuxtImg src="img1.jpeg" class="mt-3 rounded-md aspect-square object-cover object-center" />
      </div>

      <!-- Steps -->
      <div class="col mt-4">
        <p class="text-1xl font-semibold mb-1">
          {{ $t("Tour de Poitrine") }}
        </p>
        <p class="font-light text-slate-700 mb-4">
          {{ $t('Step: Measure bust size') }}
        </p>

        <p class="fs-6 fw-bold mb-1">
          {{ $t("Tour de Taille") }}
        </p>
        <p class="font-light text-slate-700 mb-4">
          {{ $t('Step: Measure waistline') }}
        </p>

        <p class="fs-6 fw-bold mb-1">
          {{ $t("Tour de Hanches") }}
        </p>
        <p class="font-light text-slate-700 mb-4">
          {{ $t('Step: Measure hip-size') }}
        </p>  
      </div>

      <TailButton variant="link">
        <NuxtLinkLocale to="/">
          <Icon name="fa-solid:link" />
          {{ $t('Notre guide complet') }}
        </NuxtLinkLocale>
      </TailButton>
    </div>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { DefaultClotheSize } from '~/data'
import type { Product } from '~/types'

const props = defineProps({
  modelValue: {
    type: Boolean
  },
  product: {
    type: Object as PropType<Product | null | undefined>,
    required: true
  }
})

const emit = defineEmits({
  'update:modelValue' (_value: boolean) {
    return true
  }
})

const cartStore = useCart()
// const { mediaPath } = useDjangoUtilies()

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  }
})

/**
 * TODO: Write documentation
 */
function handleSizeSelection(value: DefaultClotheSize) {
  if (props.product) {
    cartStore.handleSizeSelection(props.product, value)
  }
}
</script>
