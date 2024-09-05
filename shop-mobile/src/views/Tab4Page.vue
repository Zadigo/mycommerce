<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 4</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-row>
        <ion-col class="text-center" size="10" style="margin: 0 10% auto;margin-top: 30%;text-align: center;">
          <h1>Connecte-toi et créé ton compte</h1>

          <ion-button fill="outline" color="dark" expand="block" @click="showLoginModal=true">
            <ion-icon :icon="mail" class="ion-margin-end"></ion-icon>
            Continuer avec un email
          </ion-button>
          <ion-button fill="outline" color="dark" class="ion-margin-top" expand="block">
            <ion-icon :icon="logoGoogle" class="ion-margin-end"></ion-icon>
            Continuer avec Google
          </ion-button>

          <p class="legal ion-margin-top">En me connectant avec mon identifiant social, j'acccept de lier mon compte conformément à la politique de confidentialité</p>
          
          <hr>

          <div class="socials" style="display: flex; justify-content: center;">
            <ion-button color="secondary" shape="round">
              <ion-icon :icon="logoFacebook"></ion-icon>
            </ion-button>
            <ion-button color="secondary" shape="round">
              <ion-icon :icon="logoTiktok"></ion-icon>
            </ion-button>
            <ion-button color="secondary" shape="round">
              <ion-icon :icon="logoInstagram"></ion-icon>
            </ion-button>
          </div>
        </ion-col>
      </ion-row>
      
      <!-- Modal -->
      <ion-modal :is-open="showLoginModal">
        <ion-header :translucent="true">
          <ion-toolbar>
            <ion-buttons slot="end">
              <ion-button @click="showLoginModal=false">
                <ion-icon :icon="close"></ion-icon>
              </ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>

        <ion-content>
          <ion-row class="ion-padding">
            <ion-col size="12">
              <ion-input v-model="requestData.email" type="email" class="ion-margin-bottom" fill="outline" placeholder="Email"></ion-input>
              <ion-input v-model="requestData.password" type="password" fill="outline" placeholder="Password"></ion-input>
              
              <p>Tu as oublié ton mot de passe ?</p>
              
              <ion-button color="dark" expand="block" @click="requestLogin">
                Se connecter
              </ion-button>
              
              <p>Tu n'as pas de compte ? Inscris-toi</p>
            </ion-col>
          </ion-row>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { client } from '@/plugins/axios';
import { useVueSession } from '@/plugins/vue-storages';
import { useAuthentication } from '@/stores/authentication';
import { AuthenticationAPIResponse } from '@/types/authentication';
import { IonButton, IonButtons, IonCol, IonContent, IonHeader, IonIcon, IonInput, IonModal, IonPage, IonRow, IonTitle, IonToolbar } from '@ionic/vue';
import { close, logoFacebook, logoGoogle, logoInstagram, logoTiktok, mail } from 'ionicons/icons';
import { storeToRefs } from 'pinia';
import { ref } from 'vue';

const showLoginModal = ref<boolean>(false)
const requestData = ref<{ email: string, password: string}>({
  email: '',
  password: ''
})
const { instance } = useVueSession()
const authenticationStore = useAuthentication()
const { token, profile } = storeToRefs(authenticationStore)

const requestLogin = async () => {
  try {
    const response = await client.post<AuthenticationAPIResponse>('accounts/login', requestData.value)
    token.value = response.data.token
    profile.value = response.data.user.userprofile
    showLoginModal.value = false

    requestData.value.email = ''
    requestData.value.password = ''
    
    instance.create('authentication', response.data)
  } catch (e) {
    console.log(e)
  }
}
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
