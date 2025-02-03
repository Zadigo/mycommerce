<template>
  <ion-modal :is-open="show" :initial-breakpoint="0.35" :breakpoints="[0.35, 1]" :backdrop-dismiss="false" :backdrop-breakpoint="0.5" handle-behavior="cycle">
    <ion-content class="ion-padding">
      <ion-col size="12">
        <div class="product-price">
          <p v-if="currentProduct" class="fw-light">
            {{ currentProduct.name }}
          </p>

          <p v-if="currentProduct" class="fw-bold">
            {{ currentProduct.get_price }}€  
          </p>
        </div>

        <!-- Cart -->
        <ion-button color="dark" expand="block">
          Sélectionner une taille
        </ion-button>

        <p v-if="currentProduct" class="fw-light">{{ currentProduct.color }} - Réf: {{ currentProduct.slug }}</p>
      </ion-col>

      <ion-col size="12">
        <h3>A propos du produit</h3>

        <ion-list>
          <ion-item button lines="full" @click="emit('composition-modal')">
            Composition, soin et traçabilité
          </ion-item>

          <ion-item button lines="full" @click="emit('delivery-modal')">
            Livraison et retours
          </ion-item>
        </ion-list>
      </ion-col>

      <ion-col size="12">
        <h3>Cela peut t'intéresser</h3>

        <grid-display :products="recommendations" :columns="2" />
      </ion-col>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { useShop } from '@/stores/shop';
import { Product } from '@/types';
import { IonModal, IonContent, IonCol, IonItem, IonList } from '@ionic/vue'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useAxiosClient } from '@/plugins/client'

import GridDisplay from '@/components/products/GridDisplay.vue';

defineProps({
  show: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits({
  'composition-modal'() {
    return true
  },
  'delivery-modal'() {
    return true
  }
})

const shopStore = useShop()
const { currentProduct } = storeToRefs(shopStore)

const recommendations = ref<Product[]>([])

async function requestRecommendations () {
  try {
    if (currentProduct.value) {
      const { client } = useAxiosClient()
      const response = await client.get('shop/products/recommendations', {
        params: {
          q: 30,
          p: currentProduct.value.id
        }
      })
      recommendations.value = response.data
      console.info('requestRecommendations', response.data)
    }
  } catch (e) {
    console.log(e)
  }
}

requestRecommendations()
</script>

<style lang="scss" scoped>
.product {
  &-price {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
