<template>
  <div class="mx-auto px-10">
    <div class="flex flex-column justify-content-center h-full">
      <h3 class="font-semibold text-1xl grow text-center">
        {{ $t('Connecte-toi ou crée un compte') }}
      </h3>

      <TailButton id="signin-google" variant="outline" size="lg" class="mt-3 mb-5 rounded-full" @click="handleGoogle">
        <Icon name="fa-brands:google" />
      </TailButton>

      <p class="font-light mt-1 mb-8 text-center">
        {{ $t('Login: Privacy Policy') }} <NuxtLinkLocale  id="link-legal-login-modal" to="/confidentialite" class="text-blue-600 underline">{{ $t('politique de confidentialité') }}</NuxtLinkLocale >
      </p>

      <form id="form-login" @submit.prevent>
        <TailInput v-model="email" :placeholder="$t(`Nom d'utilisateur ou email`)" type="text" autocomplete="email" />
        <TailInput v-model="password" :placeholder="$t('Mot de passe')" class="my-2" type="password" autocomplete="current-password" />

        <TailButton id="signin-email" class="rounded-full w-full mt-5" size="lg" @click="handleLogin">
          {{ $t('Se connecter') }}
        </TailButton>
      </form>

      <p class="flex-grow font-light text-center mt-3">
        {{ $t('No account signup text') }} 
        <a link="action-sigup" href="#" class="text-blue-600 underline" @click.prevent="emit('show-signup')">
          {{ $t("Inscris-toi") }}
        </a>
      </p>
    </div>
  </div>
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

const { $fireStore, $fireApp } = useNuxtApp()
const { handleError } = useErrorHandler()
const authenticatedCart = useSessionStorage('authenticatedCart', false)
const authStore = useAuthentication()
const { showLoginDrawer } = storeToRefs(authStore)

const email = ref<string>('')
const password = ref<string>('')

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
  const accessToken = useCookie('access', { sameSite: 'strict', secure: true })
  const refreshToken = useCookie('refresh', { sameSite: 'strict', secure: true })

  const { access, refresh } = await login(email.value, password.value)

  accessToken.value = access
  refreshToken.value = refresh

  if (!authenticatedCart.value) {
    // When the user logs, we know from the start that the
    // items in the cart were not authenticated
    authenticatedCart.value = true
  }

  email.value = ''
  email.value = ''
  showLoginDrawer.value = false

  // useTrackEvent('login', {
  //   method: 'Email'
  // })

  emit('authenticate')
}
</script>
