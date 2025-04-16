<template>
  <v-container>
    <div class="flex flex-column justify-content-center h-full">
      <h3 class="font-semibold text-1xl grow text-center">
        {{ $t('Connecte-toi ou crée un compte') }}
      </h3>

      <TailButton id="signin-google" variant="outline" size="lg" class="mt-3 mb-5 rounded-full" @click="handleGoogle">
        <Icon name="fa-brands:google" />
      </TailButton>

      <p class="font-light mt-1 mb-8 text-center">
        En me connectant avec mon identifiant social, j'accepte de lier mon 
        compte conformément à la <NuxtLink id="link-legal-login-modal" to="/confidentialite" class="text-blue-600 underline">politique de confidentialité</NuxtLink>
      </p>

      <form id="form-login" @submit.prevent>
        <v-text-field v-model="email" :placeholder="$t(`Nom d'utilisateur ou email`)" variant="outlined" type="text" autocomplete="email" />
        <v-text-field v-model="password" :placeholder="$t('Mot de passe')" variant="outlined" type="password" autocomplete="current-password" />

        <TailButton id="signin-email" class="rounded-full w-full" size="lg" @click="handleLogin">
          {{ $t('Se connecter') }}
        </TailButton>
      </form>

      <p class="flex-grow font-light text-center fw-light mt-3">
        {{ $t('No account signup text') }} 
        <a link="action-sigup" href="#" class="text-blue-600 underline" @click.prevent="emit('show-signup')">
          {{ $t("Inscris-toi") }}
        </a>
      </p>
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
const { handleError } = useErrorHandler()
const { login, email, password } = useAuthencationComposable()
const authenticationStore = useAuthentication()
const authenticatedCart = useSessionStorage('authenticated_cart', false)


/**
 * 
 */
async function handleGoogle () {
  try {
    const auth = getAuth($fireApp)
    const provider = new GoogleAuthProvider()
    
    provider.addScope('email')

    const result = await signInWithPopup(auth, provider)
    const { user } = result

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
    handleError(e)
  }
}

/**
 * Proxy that handles the main login process
 * to the backend
 */
async function handleLogin () {
  login((data) => {
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
