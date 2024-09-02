<template>
  <ion-card id="product">
    <ion-img src="/img5.jpg" @click="handleGoToProduct"></ion-img>
    
    <ion-card-content v-if="showProductInfo">
      <div class="product-info">
        <div class="info">
          <h5>{{ product.name }}</h5>

          <ion-button v-if="showAddToFavorite" shape="round" fill="clear" color="dark" size="small">
            <font-awesome-icon :icon="['far', 'heart']"></font-awesome-icon>
          </ion-button>
          <ion-button v-else shape="round" size="small" fill="clear" color="dark" @click="emit('show-product-sizes', product)">
            <font-awesome-icon :icon="['fas', 'shopping-cart']"></font-awesome-icon>
          </ion-button> 
        </div>

        <p class="price">56.4€</p>
      </div>
    </ion-card-content>
  </ion-card>
</template>


<script setup lang="ts">
import { useProducts } from '@/composables/shop';
import { Product } from '@/types/collections';
import { IonButton, IonCard, IonCardContent, IonImg } from '@ionic/vue';
import { defineEmits, defineProps, PropType } from 'vue';

const emit = defineEmits(['show-product-sizes']);
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
    type: Object as PropType<Product>,
    required: true,
    default: () => {}
  },
});

const { handleGoToProduct } = useProducts()
</script>

<style scoped>
#product h5 {
  font-weight: 400;
}

#product .price {
  font-weight: 700;
}

.product-info .info {
  display: flex;
  justify-content: space-between;
  align-items: center;
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

ion-card-content {
  padding-top: 5px;
  padding-left: 7px;
  padding-right: 7px;
}
</style>
