<template>
  <v-container>
    <div class="row">
      <div class="col-12">
        <div class="d-flex flex-column justify-content-center" style="height: 100vh;">
          <h3 class="h5 flew-grow">
            {{ $t('Connecte-toi ou crée un compte') }}
          </h3>

          <v-btn id="signin-google" variant="outlined" color="dark" size="x-large" class="mt-3 mb-5" rounded @click="signInWithGoogle">
            <font-awesome :icon="[ 'fab', 'google' ]" />
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
            <a :href="signupUrl" target="_blank" rel="noopener noreferrer">
              {{ $t("Inscris-toi") }}
            </a>
          </p>
        </div>
      </div>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useSessionStorage } from '@vueuse/core'

const route = useRoute()
const authenticationStore = useAuthentication()
const authenticatedCart = useSessionStorage('authenticated_cart', false)

const { signInWithGoogle } = useGoogleAuth()
const { login, email, password } = useAuthencationComposable()

const emit = defineEmits({
  authenticate () {
    return true
  }
})

/**
 * TODO: Returns the Django signup url that will be
 * used to create a new user
 */
const signupUrl = computed((): string => {
  const url = import.meta.env.VITE_DEVELOPMENT_SIGNUP_URL
  const query = new URLSearchParams()

  query.append('c', route.path)
  return url + `?${query}`
})

/**
 * Proxy that handles the main login process
 * to the backend
 */
async function handleLogin () {
  login((data) => {
    const accessToken = useCookie('access')
    const refreshToken = useCookie('refresh')
    
    accessToken.value = data.access
    refreshToken.value = data.refresh

    authenticationStore.accessToken = accessToken.value
    authenticationStore.refreshToken = accessToken.value
    authenticationStore.showLoginDrawer = false
    
    if (!authenticatedCart.value) {
      // When the user logs, we know from the start that the
      // items in the cart were not authenticated
      authenticatedCart.value = true
    }

    emit('authenticate')
  })
}
</script>
