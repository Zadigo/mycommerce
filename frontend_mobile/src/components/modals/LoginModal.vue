<template>
  <ion-modal :is-open="authStore.showLoginDrawer">
    <ion-content>
      <ion-header>
        <ion-buttons>
          <ion-button @click="authStore.showLoginDrawer=false">
            <ion-icon :icon="close" />
          </ion-button>
        </ion-buttons>
      </ion-header>

      <ion-row class="ion-padding">
        <ion-col size="12">
          <ion-input v-model="email" type="email" class="ion-margin-bottom" fill="outline" placeholder="Email" />
          <ion-input v-model="password" type="password" fill="outline" placeholder="Password" />
          
          <p>Tu as oublié ton mot de passe ?</p>
          
          <ion-button color="dark" expand="block" @click="handleLogin">
            Se connecter
          </ion-button>

          <p>Tu n'as pas de compte ? Inscris-toi</p>
        </ion-col>

        <ion-col size="12">
          <ion-button color="dark" expand="block" @click="handleGoogle">
            Google
          </ion-button>
        </ion-col>
      </ion-row>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonModal,
  IonRow
} from '@ionic/vue';

import { useAuthencationComposable } from '@/composables/authentication';
import { useAuthentication } from '@/stores/authentication';
import { useShop } from '@/stores/shop';
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
// import { useCookies } from '@vueuse/integrations/useCookies';
import { close } from 'ionicons/icons';
import { useFirebase } from '@/plugins/firedb'

const { app } = useFirebase()
const { login, email, password } = useAuthencationComposable()
const shopStore = useShop()
const authStore = useAuthentication()

const emit = defineEmits({
  close() {
    return true
  },
  authenticate() {
    return true
  }
})

const auth = getAuth(app)
const provider = new GoogleAuthProvider()
provider.addScope('email')

/**
 * Proxy that handles the main login process
 * to the backend
 */
async function handleLogin () {
  login((data) => {
    // const cookies = useCookies()
    
    // cookies.set('access', data.access)
    // cookies.set('refresh', data.refresh)

    authStore.accessToken = data.access
    authStore.refreshToken = data.refresh
    authStore.showLoginDrawer = false
    
    if (shopStore.sessionCache) {
      if (!shopStore.sessionCache.authenticatedCart) {
        // When the user logs, we know from the start that the
        // items in the cart were not authenticated
        shopStore.sessionCache.authenticatedCart = true
      }
    }

    emit('authenticate')
  })
}

async function handleGoogle () {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log(user)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (credential) {
      const token = credential.accessToken
      console.log(token)
      authStore.showLoginDrawer = false
    }
  } catch (e) {
    console.log(e)
  }
}
</script>
