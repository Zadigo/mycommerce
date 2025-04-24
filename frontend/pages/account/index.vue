<template>
  <section id="user-page">
    <!-- Email / Password -->
    <TailCard v-if="profile" id="email-password" class="card border-none">
      <TailCardHeader>
        <TailCardTitle>
          {{ $t("Accédez à votre compte") }}
        </TailCardTitle>
      </TailCardHeader>

      <TailCardContent>
        <!-- Password -->
        <p class="font-bold">
          {{ $t('Mot de passe') }}
        </p>

        <Transition mode="out-in">
          <form v-if="showEditPassword" class="password-block" @submit.prevent>
            <v-text-field id="current-password" v-model="emailPasswordRequestData.current_password" variant="solo-filled" placeholder="Mot de passe actuel" type="password" autocomplete="false" aria-label="Mot de passe actuel" flat />
            <v-text-field id="password1" v-model="emailPasswordRequestData.password1" variant="solo-filled" placeholder="Nouveau mot de passe" type="password" autocomplete="new-password" aria-label="Nouveau mot de passe" flat />
            <v-text-field id="password2" v-model="emailPasswordRequestData.password2" variant="solo-filled" placeholder="Taper le mot de passe à nouveau" autocomplete="new-password" type="password" aria-label="Taper le mot de passe à nouveau" flat />
            
            <div class="flex gap-1">
              <v-btn color="secondary" variant="tonal" rounded @click="requestUpdate">
                {{ $t('Changer le mot de passe') }}
              </v-btn>

              <v-btn class="flex justify-between items-center" color="dark" variant="text" rounded flat @click="showEditPassword=false">
                Annuler
              </v-btn>
            </div>
          </form>
          
          <v-btn v-else class="flex justify-between items-center" color="dark" variant="text" flat block @click="showEditPassword=true">
            <span class="me-2">*************</span>
            <Icon name="fa-solid:pen" />
          </v-btn>
        </Transition>

        <!-- Email -->
        <p class="font-bold mt-4">
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

          <Icon name="fa-solid:pen" />
        </v-btn>

        <p class="font-light mt-4">
          BERSHKA prend très au sérieux le respect de votre vie privée
          et nous sommes engagés dans la protection de vos données personnelles.
          Découvrez comment nous prenons soin et comment nous traitons vos
          données dans notre Politique de confidentialité.
        </p>
      </TailCardContent>
    </TailCard>

    <!-- Billing -->
    <TailCard v-if="profile" id="billing" class="card border-none mt-2">
      <TailCardHeader>
        <TailCardTitle>
          {{ $t('Information pour la facturation') }}
        </TailCardTitle>
      </TailCardHeader>

      <AccountBillingForm v-for="address in profile.userprofile.address_set" :key="address.id" :address="address" @delete-complete="handleDelete" />
      <AccountBillingForm v-if="showNewAddressForm" @create-complete="handleCreation"  @close="showNewAddressForm=false" />

      <TailCardContent class="flex justify-end">
        <v-btn variant="tonal" rounded @click="showNewAddressForm=!showNewAddressForm">
          <Icon name="fa-solid:plus" />
          {{ $t('Ajouter') }}
        </v-btn>
      </TailCardContent>
    </TailCard>
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
  title: 'Mon compte',
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
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
  await $client(`/api/v1/accounts/${authStore.userId}`, {
    method: 'PATCH',
    body: emailPasswordRequestData.value,
    onResponse() {
      resetEmailPasswordData()
    },
    onRequestError({ error }) {
      resetEmailPasswordData()
      handleError(error)
    }
  })
}
</script>
