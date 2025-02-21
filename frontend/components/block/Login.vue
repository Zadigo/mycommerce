<template>
  <v-container>
    <div class="row">
      <div class="col-12">
        <div class="d-flex flex-column justify-content-center" style="height: 100vh;">
          <h3 class="h5 flew-grow">
            {{ $t('Connecte-toi ou crée un compte') }}
          </h3>

          <v-btn id="signin-google" variant="outlined" color="dark" size="x-large" class="mt-3 mb-5" rounded @click="handleGoogle">
            <font-awesome :icon="[ 'fab', 'google' ]" /> Google
          </v-btn>

          <p class="fw-light">
            En me connectant avec mon identifiant social, j'accepte de lier mon 
            compte conformément à la Politique de confidentialité
          </p>

          <v-form id="form-login" @submit.prevent>
            <v-text-field v-model="email" :placeholder="$t(`Nom d'utilisateur ou email`)" variant="outlined" type="text" autocomplete="email" />
            <v-text-field v-model="password" :placeholder="$t('Mot de passe')" variant="outlined" type="password" autocomplete="current-password" />

            <v-btn id="signin-email" class="text-light" color="dark" size="x-large" block flat rounded @click="handleLogin">
              {{ $t('Se connecter') }}
            </v-btn>
          </v-form>

          <p class="flex-grow text-center fw-light mt-3">
            {{ $t('No account signup text') }} 
            <a href="#" @click.prevent="emit('show-signup')">
              {{ $t("Inscris-toi") }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { useSessionStorage } from '@vueuse/core'

const emit = defineEmits({
  'show-signup' () {
    return true
  },
  authenticate () {
    return true
  }
})

const { $fireApp } = useNuxtApp()
const authenticationStore = useAuthentication()
const authenticatedCart = useSessionStorage('authenticated_cart', false)

// const { signInWithGoogle } = useGoogleAuth()
const { login, email, password } = useAuthencationComposable()

const auth = getAuth($fireApp)
const provider = new GoogleAuthProvider()

provider.addScope('email')

/**
 * 
 */
async function handleGoogle () {
  try {
    const result = await signInWithPopup(auth, provider)
    const user = result.user
    console.log(user)
    const credential = GoogleAuthProvider.credentialFromResult(result)
    if (credential) {
      const token = credential.accessToken
      console.log(token)

      // useTrackEvent('login', {
      //   method: 'Google'
      // })
    }
  } catch (e) {
    console.log(e)
  }
}

/**
 * Proxy that handles the main login process
 * to the backend
 */
async function handleLogin () {
  login((data) => {
    // const accessToken = useCookie('access')
    // const refreshToken = useCookie('refresh')
    
    // accessToken.value = data.access
    // refreshToken.value = data.refresh

    console.info('handleLogin', data)

    authenticationStore.accessToken = data.access
    authenticationStore.refreshToken = data.refresh
    authenticationStore.showLoginDrawer = false
    
    if (!authenticatedCart.value) {
      // When the user logs, we know from the start that the
      // items in the cart were not authenticated
      authenticatedCart.value = true
    }

    // useTrackEvent('login', {
    //   method: 'Email'
    // })

    emit('authenticate')
  })
}

// function handleGoogleAuthCallback () {
//   useTrackEvent('login', {
//     method: 'Google'
//   })
// }
</script>
