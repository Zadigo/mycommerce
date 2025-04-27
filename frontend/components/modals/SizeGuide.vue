<template>
  <v-navigation-drawer v-model="show" width="400" location="right" temporary>
    <v-toolbar class="border-bottom" color="white">
      <v-toolbar-title class="fw-bold">
        {{ $t("Guide des tailles") }}
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-close" @click="show=false" />
    </v-toolbar>

    <div v-if="product" class="container my-4">
      <div class="row g-1">
        <div class="col-12">
          <p class="fs-6 fw-bold mb-1">
            {{ $t("Sélectionne une taille") }}
          </p>
          
          <ProductSizeBlock :sizes="product.sizes" @update-size="handleSizeSelection" @show-size-guide-drawer="show=false" />

          <p class="fs-6 fw-bold mt-4 mb-1">
            {{ $t("Mensurations") }}
          </p>

          <p class="fw-light text-body-secondary text-uppercase">
            {{ $t("Corps") }}
          </p>

          <div class="sizes">
            <div class="d-flex justify-content-between align-items-center">
              <div class="col-auto">
                {{ $t("Tour de Poitrine") }}
              </div>
              
              <div class="col-auto">
                82
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 mt-4">
          <v-btn color="primary" block @click="cartStore.addToCart(product)">
            {{ $t('Ajouter au panier') }}
          </v-btn>
        </div>

        <div class="col-12 mt-4">
          <p class="fs-6 fw-bold">
            {{ $t("Comprendre tes mesures ?") }}
          </p>

          <!-- <v-img src="/size-guide.jpg" :width="300" /> -->
        </div>

        <div class="col-12 mt-4">
          <p class="fs-6 fw-bold mb-1">
            {{ $t("Tour de Poitrine") }}
          </p>
          <p class="fw-light text-body-secondary mb-4">
            Pour mesurer la circonférence de ta poitrine, utilise un mètre
            ruban et place-le autour de la partie la plus large de ta poitrine.
          </p>

          <p class="fs-6 fw-bold mb-1">
            {{ $t("Tour de Taille") }}
          </p>
          <p class="fw-light text-body-secondary mb-4">
            Place le mètre ruban autour de la partie la plus
            étroite de ta taille.
          </p>

          <p class="fs-6 fw-bold mb-1">
            {{ $t("Tour de Hanches") }}
          </p>
          <p class="fw-light text-body-secondary mb-4">
            Mets tes pieds l'un contre l'autre et place le mètre ruban
            autour de la partie la plus large de ton tour de hanche.
          </p>
        </div>
      </div>
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
    type: Object as PropType<Product>,
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

function handleSizeSelection(value: DefaultClotheSize) {
  cartStore.handleSizeSelection(props.product, value)
}
</script>
