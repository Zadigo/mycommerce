<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button :icon="arrowBackOutline" :text="''" default-href="/" />
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Simple Hero -->
      <simple-hero id="hero1" :image-src="currentProduct?.get_main_image?.original" :action="false" />

      <!-- Modal -->
      <ion-modal :is-open="showModal" :can-dismiss="true" :show-backdrop="false" breakpoints="[0.15, 0.15, 1]" initial-breakpoint="0.15" handle>
        <ion-content>
          <div v-if="currentProduct" class="px-5 my-10">
            <h1>{{ currentProduct.name }}</h1>
            <p class="font-bold">{{ currentProduct.get_price }}€</p>
            <ion-button fill="solid" expand="block" @click="showSelectPrice = true">Choisir une taille</ion-button>
          </div>
        </ion-content>
      </ion-modal>

      <ion-modal :is-open="showSelectPrice" breakpoints="[0.0, 0.5, 1]" initial-breakpoint="0.5" handle @did-dismiss="() => showSelectPrice = false">
        <ion-content>
          Select size
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script lang="ts" setup>
import { arrowBackOutline } from 'ionicons/icons'

definePageMeta({
  layout: 'product'
})

const showModal = ref<boolean>(true)
const showSelectPrice = ref<boolean>(false)

const { products } = useProductsFeed()
provide('products', products)

const { currentProduct } = storeToRefs(useProductStore())
console.log(currentProduct)

onBeforeRouteLeave(() => {
  showModal.value = false
  currentProduct.value = null
})
</script>

<style scoped>
ion-toolbar {
  --background: transparent;
  --ion-color-base: white;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
}
</style>
