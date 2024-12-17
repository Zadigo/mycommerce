<template>
  <section id="user-page">
    <!-- Email / Password -->
    <div id="email-password" class="card shadow-sm">
      <div class="card-header">
        <h1 class="h6 text-uppercase fw-bold my-3">
          {{ $t("Accédez à votre compte") }}
        </h1>
      </div>

      <div class="card-body">
        <!-- Password -->
        <p class="fw-bold">
          {{ $t('Mot de passe') }}
        </p>

        <transition name="opacity" mode="out-in">
          <v-form v-if="showEditPassword" class="password-block" @submit.prevent>
            <v-text-field id="password1" v-model="emailPasswordData.password1" variant="solo-filled" placeholder="Password 1" type="password" aria-label="Password 1" flat />
            <v-text-field id="password2" v-model="emailPasswordData.password2" variant="solo-filled" placeholder="Password 2" type="password" aria-label="Password 2" flat />
            
            <v-btn color="secondary" rounded @click="requestChangeEmailPassword">
              {{ $t('Changer le mot de passe') }}
            </v-btn>
          </v-form>

          <v-btn v-else class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block @click="showEditPassword = true">
            <span class="me-2">*************</span>
            <font-awesome icon="pen" />
          </v-btn>
        </transition>

        <!-- Email -->
        <p class="fw-bold mt-4">
          {{ $t("Email") }}
        </p>

        <v-form v-if="showEditEmail" class="password-block" @submit.prevent>
          <v-text-field v-model="emailPasswordData.email" variant="solo-filled" placeholder="Email" type="email" aria-label="Email" flat />        
          
          <v-btn color="secondary" rounded @click="requestChangeEmailPassword">
            {{ $t("Changer l'email") }}
          </v-btn>
        </v-form>

        <v-btn v-else class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block @click="showEditEmail = true">
          <span class="me-2">
            {{ profile?.email }}
          </span>

          <font-awesome icon="pen" />
        </v-btn>

        <p class="fw-light mt-4">
          BERSHKA prend très au sérieux le respect de votre vie privée
          et nous sommes engagés dans la protection de vos données personnelles.
          Découvrez comment nous prenons soin et comment nous traitons vos
          données dans notre Politique de confidentialité.
        </p>
      </div>
    </div>

    <!-- Billing -->
    <div v-if="profile" id="billing" class="card shadow-sm mt-2">
      <div class="card-header">
        <h1 class="h6 text-uppercase fw-bold my-3">
          {{ $t('Information pour la facturation') }}
        </h1>
      </div>

      <AccountsBilliingForm v-for="address in profile.userprofile.address_set" :key="address.id" :address="address" />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { useSessionStorage } from '@vueuse/core';
import { AxiosError } from 'axios';
import type { Profile } from '~/types';

type CredentialsMethod = 'email' | 'password'
interface EmailPasswordData {
  email: string,
  password1: string,
  password2: string
}

definePageMeta({
  layout: 'account-layout',
  middleware: [
    'auth'
  ]
})

const userProfile = useSessionStorage<Profile>('profile', null, {
  deep: true,
  serializer: {
    write (value) {
      return JSON.stringify(value)
    },
    read (raw) {
      return JSON.parse(raw)
    }
  }
})

const authenticationStore = useAuthentication()
const { profile } = storeToRefs(authenticationStore)
const { $client } = useNuxtApp() 

const emailPasswordData = ref<EmailPasswordData>({
  email: '',
  password1: '',
  password2: ''
})

// const showBillingForm = ref(false)
const showEditPassword = ref(false)
const showEditEmail = ref(false)

function resetEmailPasswordData () {
  emailPasswordData.value = {
    email: '',
    password1: '',
    password2: ''
  }
}

/**
 * Requests an update for the password and/or
 * the email address by the user 
 */
async function requestChangeEmailPassword (method: CredentialsMethod) {
  try {
    await $client.post('accounts/update', emailPasswordData)

    emailPasswordData.value.email = ''
    emailPasswordData.value.password1 = ''
    emailPasswordData.value.password2 = ''
    
    if (method === 'password') {
      showEditPassword.value = false
    } else if (method === 'email') {
      showEditEmail.value= false
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      showEditEmail.value = false
      showEditPassword.value = false
      resetEmailPasswordData()
      // messagesStore.addErrorMessage('Not saved', 'Items not saved')
    }
  }
}

/**
 * Returns details on the profile for
 * the currently authenticated user 
 */
async function requestUserDetails () {
  try {
    if (!profile.value) {
      const response = await $client.get<Profile>('accounts/profile')
      userProfile.value = response.data
      profile.value = response.data
    }
  } catch (e) {
    if (e instanceof AxiosError && e.response) {
      // Do something
    }
  }
}

onMounted(async () => {
  await requestUserDetails()
})
</script>
