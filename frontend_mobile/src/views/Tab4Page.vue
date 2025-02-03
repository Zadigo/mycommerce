<template>
  <ion-page>
    <ion-content class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Compte</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row>
        <ion-col size="12">
          <ion-list>
            <ion-item button lines="none">
              Mes achats
            </ion-item>

            <ion-item button lines="none">
              Factures en ligne
            </ion-item>

            <ion-item button lines="none">
              Données personnelles
            </ion-item>

            <ion-item button lines="none">
              Adresses enregistrées
            </ion-item>

            <ion-item button lines="none">
              Se déconnecter
            </ion-item>
          </ion-list>
        </ion-col>
      </ion-row>

      <LoginModal />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuthentication } from '@/stores/authentication';
import { IonCol, IonContent, IonHeader, IonList, IonItem, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/vue';

import LoginModal from '@/components/modals/LoginModal.vue';
import { useRouter } from 'vue-router';
import { onBeforeMount } from 'vue';

const router = useRouter()
const authStore = useAuthentication()


onBeforeMount(() => {
  if (!authStore.isAuthenticated) {
    router.push('/tabs/tab1')
    authStore.showLoginDrawer = true
  }
})
</script>

<style scoped>
h1 {
  font-size: 1.2rem;
}

.legal {
  font-size: .7rem;
  font-weight: 400;
}
</style>
