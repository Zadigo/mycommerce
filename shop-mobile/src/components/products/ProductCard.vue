<template>
  <ion-card>
    <ion-img src="/img5.jpg" @click="handleGoToProduct"></ion-img>
    
    <ion-card-content v-if="showProductInfo" class="ion-padding-left-none">
      <div class="product-info">
        <div class="info">
          <h5>{{ product.name }}</h5>
          <p>56.4€</p>
        </div>

        <ion-button v-if="showAddToFavorite" shape="round" size="small">
          <font-awesome-icon :icon="['fas', 'heart']"></font-awesome-icon>
        </ion-button>
             
        <ion-button v-else shape="round" size="small" @click="emit('show-product-sizes', product)">
          <font-awesome-icon :icon="['fas', 'shopping-cart']"></font-awesome-icon>
        </ion-button> 
      </div>
    </ion-card-content>
  </ion-card>
</template>


<script setup lang="ts">
import { useProducts } from '@/composables/shop';
import { IonButton, IonCard, IonCardContent, IonImg } from '@ionic/vue';
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(["show-product-sizes"]);
defineProps({
  showProductInfo: {
    type: Boolean,
    default: true
  },
  showAddToFavorite: {
    type: Boolean,
    default: false
  },
  product: {
    type: Object,
    required: true,
    default: () => {}
  },
});

const { handleGoToProduct } = useProducts()
</script>

<style scoped>
.product-info {
  display: flex;
  justify-content: space-between;
}

.product-info h5 {
  font-weight: bold;
}

.product-info p {
  font-weight: lighter
}

ion-card {
  border-radius: 0;
  box-shadow: none;
  margin: 0;
}
</style>
