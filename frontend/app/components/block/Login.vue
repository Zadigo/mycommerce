<template>
  <div class="mx-auto px-10">
    <div class="flex-col justify-center h-full">
      <h3 class="font-semibold text-1xl grow text-center">
        {{ $t('Connecte-toi ou crée un compte') }}
      </h3>

      <volt-button id="signin-google" variant="outline" size="lg" class="mt-3 mb-5 rounded-full w-full" @click="handleGoogle">
        <Icon name="i-fa7-brands:google" />
      </volt-button>

      <p class="font-light mt-1 mb-8 text-center">
        {{ $t('Login: Privacy Policy') }} <NuxtLinkLocale  id="link-legal-login-modal" to="/confidentialite" class="text-blue-600 underline">{{ $t('politique de confidentialité') }}</NuxtLinkLocale >
      </p>

      <form id="form-login" @submit.prevent>
        <volt-input-text v-model="usernameField" :placeholder="$t(`Nom d'utilisateur ou email`)" type="text" autocomplete="email" />
        <volt-input-text v-model="password" :placeholder="$t('Mot de passe')" class="my-2" type="password" autocomplete="current-password" />

        <volt-button id="signin-email" class="rounded-full w-full mt-5" size="lg" @click="async () => { await login(() => closeAllModals()) }">
          {{ $t('Se connecter') }}
        </volt-button>
      </form>

      <p class="grow font-light text-center mt-3">
        {{ $t('No account signup text') }} 
        <a link="action-sigup" href="#" class="text-blue-600 underline" @click.prevent="emit('show-signup')">
          {{ $t("Inscris-toi") }}
        </a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { useSessionStorage } from '@vueuse/core'

const emit = defineEmits<{ 'show-signup': [], authenticate: [] }>()

const { $firebaseApp } = useNuxtApp()
const { customHandleError } = useErrorHandler()
const authenticatedCart = useSessionStorage('authenticatedCart', false)

/**
 * Login
 */

// Google Login
async function handleGoogle () {
  try {
    const auth = getAuth($firebaseApp)
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
    customHandleError(e)
  }
}

// Email/Password Login
const { login, usernameField, password } = useLogin('username')
const { closeAllModals } = useModalsState()
</script>
