<template>
  <ion-row class="ion-padding">
    <ion-col v-for="item in cartItems" :key="item.product__id" size="12">
      <ion-card>
        <div class="cart-item">
          <ion-img :src="mediaPath(item.product_info?.product.get_main_image.original)" @click="handleGoToProduct(item.product_info?.product)" />
          <div class="infos">
            <div class="price">
              <span>{{ item.product_info?.price }}€</span>
              <div class="actions">
                <ion-button fill="clear" size="small" color="dark" @click="handleProductModification">
                  <ion-icon :icon="pencil" />
                </ion-button>
                
                <ion-button fill="clear" size="small" color="dark">
                  <ion-icon :icon="trash" />
                </ion-button>
              </div>
            </div>
            
            <p class="ion-no-margin">{{ item.product__name }}</p>

            <div class="product-info">
              <span>{{ item.product_info?.size }}</span>
              <span>x{{ item.quantity }}</span>
              <span>{{ item.total }}€</span>
            </div>
          </div>
        </div>
      </ion-card>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { useDjangoUtilies } from '@/composables/utils';
import { useCart } from '@/stores/cart';
import { ProductToEdit } from '@/types';
import { IonButton, IonCard, IonCol, IonIcon, IonImg, IonRow, useIonRouter } from '@ionic/vue';
import { pencil, trash } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const { handleGoToProduct } = useShopComposable()

const router = useIonRouter()
const cartStore = useCart()
const { sessionCache } = storeToRefs(cartStore)
const { mediaPath } = useDjangoUtilies()

// Computed property that get the items from the session
// and iterates on each statistic object to be displayed 
const cartItems = computed((): ProductToEdit[] => {
  if (sessionCache.value) {
    if (sessionCache.value.cart) {
      return sessionCache.value.cart.statistics.map((item) => {
        const productInfo = sessionCache.value.cart.results.find((cartItem) => {
          return cartItem.product.id === item.product__id
        })
        return { ...item, product_info: productInfo }
      })
    }
  }
  return []
})

async function handleProductModification () {
  router.push('tab3/product/modify')
}
</script>

<style scoped>
.product-info {
  display: flex;
  justify-content: start;
  gap: 3%;
}

ion-card {
  box-shadow: none;
  border-radius: 0;
  padding: 0;
}

ion-img {
  width: 200px;
  height: auto;
  margin-right: 5%;
}

.cart-item {
  display: flex;
  justify-content: start;
}

.infos .price {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
