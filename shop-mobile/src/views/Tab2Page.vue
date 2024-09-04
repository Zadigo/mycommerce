<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-row>
        <transition name="slide" mode="out-in">
          <SimpleSearch v-if="showHeader" @search-focused="showHeader=false" />
          <FocusedSearch v-else @update-search="handleSearchedProducts" @search-unfocused="showHeader=true" />
        </transition>
        
        <ion-col size="12">
          <div v-if="hasSearch" class="search">
            <div class="product-types">
              <ion-button>Tous</ion-button>
            </div>
            <hr style="color: black;">
            <div class="infos">
              <p>{{ searchedProducts.length }} résultats</p>
            </div>
            <ProductIterator :products="searchedProducts" :show-add-to-favorite="true" />
          </div>
          
          <div v-else class="recommendations">
            <p>Cela peut t'intéresser</p>
            <ProductIterator :products="recommendedProducts" :show-add-to-favorite="true" />
          </div>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useShopComposable } from '@/composables/shop';
import { Product } from '@/types/shop';
import { IonCol, IonContent, IonPage, IonRow, IonButton } from '@ionic/vue';
import { computed, onBeforeMount, ref } from 'vue';

import ProductIterator from '@/components/ProductIterator.vue';
import FocusedSearch from '@/components/search/FocusedSearch.vue';
import SimpleSearch from '@/components/search/SimpleSearch.vue';

const showHeader = ref<boolean>(true)
const searchedProducts = ref<Product>([])
const { recommendedProducts, handleGetRecommendations } = useShopComposable()

onBeforeMount(() => {
  handleGetRecommendations(20)
})

const hasSearch = computed(() => {
  return searchedProducts.value.length > 0
})

const handleSearchedProducts = (products: Product[]) => {
  searchedProducts.value = products
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all .15s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 1;
  transform: translateY(0px)
}

.slide-enter-to,
.slide-leave-from {
  opacity: 0;
  transform: translateY(-25px)
}
</style>
