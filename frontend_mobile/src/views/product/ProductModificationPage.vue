<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button>
            <ion-icon :icon="caretBack" @click="router.back()"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-title>Modifier</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-row id="main-body">
        <ion-col size="12">
          <div class="carousel">
            <ion-img v-for="i in 3" :key="i" src="/img1.jpg"></ion-img>
          </div>

          <h3 style="margin-top:0.5rem;font-weight: 700;">56.88€</h3>
          <p>Pantalon de commerce adapté</p>
          
          <hr>
          
          <p>Taille</p>
          <ion-button v-for="i in 3" :key="i" shape="round" fill="outline" color="dark">XS {{ i }}</ion-button>

          <p>Quantité</p>
          <ion-input type="number"></ion-input>
        </ion-col>

        <ion-col size="12">
          <ion-button expand="block" color="dark" @click="handleGoToCart">
            Sauvegarder
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonImg, IonInput, IonPage, IonRow, IonTitle, IonToolbar, useIonRouter } from '@ionic/vue';
import { caretBack } from 'ionicons/icons';

const router = useIonRouter()

/**
 * 
 */
const handleGoToCart = async () => {
  router.push('/tabs/tab3')
}
</script>

<style scoped>
.carousel {
  width: 100%;
  max-width: 100%;
  /* overflow-y: scroll; */
  display: flex;
}

.carousel ion-img {
  height: auto;
}

.carousel ion-img:not(:last-child) {
  margin: 2%;
}

#main-body {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
