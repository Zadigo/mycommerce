<template>
  <ion-row>
    <ion-col id="empty-cart" size="10">
      <p>Panier vide</p>
      <p>Ton panier est encore vide, découvres tout ce que nous avons pour toi</p>

      <ion-button class="ion-margin-top" color="dark" @click="emit('show-login-modal')">
        Découvrir
      </ion-button>
    </ion-col>
  </ion-row>
</template>

<script setup lang="ts">
import { IonButton, IonCol, IonRow } from '@ionic/vue';

const emit = defineEmits(['show-login-modal'])
</script>

<style scoped>
#empty-cart {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
  text-align: center;
  margin-left: 10%;
  margin-right: auto;
  margin-top: 50%;
}
</style>
