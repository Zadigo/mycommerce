<template>
  <ion-modal :is-open="show" :initial-breakpoint="0.5" :backdrop-breakpoint="0" handle-behavior="cycle" @did-dismiss="emit('close')">
    <ion-content class="ion-padding">
      <div class="infos">
        <ion-button fill="clear" color="dark">
          <ion-icon :icon="calculatorOutline" class="ion-margin-end" />
          <span>Guide des tailles</span>
        </ion-button>
      </div>

      <ion-list>
        <template v-if="product.sizes.length > 0">
          <ion-item button v-for="size in product.sizes" :key="size.id" @click="proxyAddToCart(size.name)">
            {{ size.name }}
          </ion-item>
        </template>

        <template v-else>
          <ion-item button @click="proxyAddToCart('Unique')">
            Taille unique
          </ion-item>
        </template>
      </ion-list>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { useCartComposable } from '@/composables/cart';
import { useCart } from '@/stores/cart';
import { Product } from '@/types';
import { IonButton, IonContent, IonIcon, IonItem, IonList, IonModal } from '@ionic/vue';
import { calculatorOutline } from 'ionicons/icons';
import { PropType } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object as PropType<Product>,
      required: true
  }
})

const emit = defineEmits({
  close() {
    return true
  },
  'size-selected' () {
    return true
  }
})

const cartStore = useCart()
const { addToCart } = useCartComposable()

function proxyAddToCart(size: number | string) {
  addToCart(props.product, size, (data) => {
    if (cartStore.sessionCache) {
      cartStore.sessionCache.cart = data
      emit('size-selected')
    }
  })
}
</script>
