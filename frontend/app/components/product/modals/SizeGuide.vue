<template>
  <volt-drawer v-model:visible="show" :header="$t('Guide des tailles')" position="right" style="width: 500px;">
    <div class="px-5 my-10">
      <div class="col">
        <p class="text-1xl font-semibold mb-1">
          {{ $t("Sélectionne une taille") }}
        </p>

        <ProductSizeBlock v-if="product" :product="product" @show-size-guide-drawer="show=false" />
        <volt-skeleton v-else height="20px" width="60px" />

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
        <volt-button class="w-full" @click="cartStore.addToCart(product)">
          {{ $t('Ajouter au panier') }}
        </volt-button>
      </div>

      <div class="col">
        <p class="text-1xl font-bold">
          {{ $t("Comprendre tes mesures ?") }}
        </p>

        <NuxtImg src="img1.jpeg" class="mt-3 rounded-md aspect-square object-cover object-center" />
      </div>

      <!-- Steps -->
      <div class="mt-4">
        <p class="font-semibold mb-1">
          {{ $t("Tour de Poitrine") }}
        </p>
        <p class="font-light mb-4">
          {{ $t('Step: Measure bust size') }}
        </p>

        <p class="font-semibold mb-1">
          {{ $t("Tour de Taille") }}
        </p>
        <p class="font-light mb-4">
          {{ $t('Step: Measure waistline') }}
        </p>

        <p class="font-semibold mb-1">
          {{ $t("Tour de Hanches") }}
        </p>
        <p class="font-light mb-4">
          {{ $t('Step: Measure hip-size') }}
        </p>
      </div>

      <volt-button variant="link">
        <NuxtLinkLocale id="link-size-guide" to="/">
          <Icon name="i-fa7-solid:link" />
          {{ $t('Notre guide complet') }}
        </NuxtLinkLocale>
      </volt-button>
    </div>
  </volt-drawer>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

const props = defineProps<{
  modelValue: boolean,
  product: Product | null | undefined
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const cartStore = useCart()

const show = useVModel(props, 'modelValue', emit, {
  passive: true,
  defaultValue: false
})

</script>
