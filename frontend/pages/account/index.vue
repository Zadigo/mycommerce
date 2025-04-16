<template>
  <section id="user-page">
    <!-- Email / Password -->
    <div v-if="profile" id="email-password" class="card shadow-sm">
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

        <Transition mode="out-in">
          <v-form v-if="showEditPassword" class="password-block" @submit.prevent>
            <v-text-field id="current-password" v-model="emailPasswordRequestData.current_password" variant="solo-filled" placeholder="Mot de passe actuel" type="password" autocomplete="false" aria-label="Mot de passe actuel" flat />
            <v-text-field id="password1" v-model="emailPasswordRequestData.password1" variant="solo-filled" placeholder="Nouveau mot de passe" type="password" autocomplete="new-password" aria-label="Nouveau mot de passe" flat />
            <v-text-field id="password2" v-model="emailPasswordRequestData.password2" variant="solo-filled" placeholder="Taper le mot de passe à nouveau" autocomplete="new-password" type="password" aria-label="Taper le mot de passe à nouveau" flat />
            
            <div class="d-flex gap-1">
              <v-btn color="secondary" variant="tonal" rounded @click="requestUpdate">
                {{ $t('Changer le mot de passe') }}
              </v-btn>

              <v-btn class="d-flex justify-content-between align-items-center" color="dark" variant="text" rounded flat @click="showEditPassword=false">
                Annuler
              </v-btn>
            </div>
          </v-form>
          
          <v-btn v-else class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block @click="showEditPassword=true">
            <span class="me-2">*************</span>
            <font-awesome icon="pen" />
          </v-btn>
        </Transition>

        <!-- Email -->
        <p class="fw-bold mt-4">
          {{ $t("Email") }}
        </p>

        <form v-if="showEditEmail" class="password-block" @submit.prevent>
          <v-text-field v-model="emailPasswordRequestData.email" variant="solo-filled" placeholder="Email" type="email" aria-label="Email" flat />        
          
          <div class="d-flex gap-1">
            <v-btn color="secondary" variant="tonal" rounded @click="requestUpdate">
              {{ $t("Changer l'email") }}
            </v-btn>
            
            <v-btn class="d-flex justify-content-between align-items-center" color="dark" variant="text" rounded flat @click="showEditEmail=false">
              Annuler
            </v-btn>
          </div>
        </form>

        <v-btn v-else class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block @click="handleEditEmail">
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

      <AccountBillingForm v-for="address in profile.userprofile.address_set" :key="address.id" :address="address" @delete-complete="handleDelete" />
      <AccountBillingForm v-if="showNewAddressForm" @create-complete="handleCreation"  @close="showNewAddressForm=false" />

      <div class="card-body d-flex justify-content-end">
        <v-btn variant="tonal" rounded @click="showNewAddressForm=!showNewAddressForm">
          <Icon name="fa-solid:plus" />
          {{ $t('Ajouter') }}
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { AddressSet } from '~/types'

interface EmailPasswordData {
  email: string
  current_password: string
  password1: string,
  password2: string
}

useHead({
  title: 'Mon compte'
})

definePageMeta({
  layout: 'accounts'
})

const authStore = useAuthentication()
const { $client } = useNuxtApp() 
const { handleError } = useErrorHandler()
const { profile } = storeToRefs(authStore)

const emailPasswordRequestData = ref<EmailPasswordData>({
  email: '',
  current_password: '',
  password1: '',
  password2: ''
})

const showNewAddressForm = ref(false)
const showEditPassword = ref(false)
const showEditEmail = ref(false)

/**
 * 
 */
function resetEmailPasswordData () {
  showEditEmail.value = false
  showEditPassword.value = false
  emailPasswordRequestData.value = {
    email: '',
    current_password: '',
    password1: '',
    password2: ''
  }
}

/**
 * 
 */
function handleEditEmail() {
  if (profile.value) {
    emailPasswordRequestData.value.email = profile.value.email
    showEditEmail.value = true
  }
}

/**
 * 
 */
function handleCreation(data: AddressSet) {
  if (profile.value) {
    profile.value.userprofile.address_set.push(data)
  }
}

/**
 * 
 */
function handleDelete(id: number) {
  if (profile.value) {
    const index = profile.value.userprofile.address_set.findIndex(x => x.id === id)
    profile.value.userprofile.address_set.splice(index, 1)
  }
}

/**
 * Requests an update for the password and/or
 * the email address by the user 
 */
async function requestUpdate () {
  try {
    await $client.patch(`/api/v1/accounts/${authStore.userId}`, emailPasswordRequestData)

    resetEmailPasswordData()
  } catch (e) {
    handleError(e)
    resetEmailPasswordData()
  }
}
</script>
