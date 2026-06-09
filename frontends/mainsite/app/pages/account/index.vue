<template>
  <section id="user-page">
    <!-- Email / Password -->
    <volt-card v-if="profile" id="email-password" :header="$t('Accédez à votre compte')">
      <template #content>
        <!-- Password -->
        <p class="font-semibold">
          {{ $t('Mot de passe') }}
        </p>

        <volt-inplace v-model:active="showEditPassword">
          <template #display>
            <span class="me-2">*************</span>
            <Icon name="i-fa7-solid:pen" />
          </template>

          <template #content>
            <form class="space-y-2" @submit.prevent>
              <volt-input-text id="current-password" v-model="emailPasswordRequestData.current_password" :placeholder="$t('Mot de passe actuel')" class="w-full" type="password" autocomplete="false" />
              <volt-input-text id="password1" v-model="emailPasswordRequestData.password1" :placeholder="$t('Nouveau mot de passe')" class="w-full" type="password" autocomplete="new-password" />
              <volt-input-text id="password2" v-model="emailPasswordRequestData.password2" :placeholder="$t('Taper le mot de passe à nouveau')" class="w-full" type="password" autocomplete="new-password" />

              <div class="flex gap-1 mt-5">
                <volt-contrast-button class="flex justify-between items-center" rounded @click="showEditPassword = false">
                  {{ $t("Annuler") }}
                </volt-contrast-button>

                <volt-contrast-button rounded @click="requestUpdate">
                  {{ $t('Changer le mot de passe') }}
                </volt-contrast-button>

              </div>
            </form>
          </template>
        </volt-inplace>

        <!-- Email -->
        <p class="font-semibold mt-4">
          {{ $t("Email") }}
        </p>

        <volt-inplace v-model:active="showEditEmail">
          <template #display>
            <span class="me-2">{{ profile?.email }}</span>
            <Icon name="i-fa7-solid:pen" />
          </template>

          <template #content>
            <form class="my-3" @submit.prevent>
              <volt-input-text v-model="emailPasswordRequestData.email" placeholder="Email" type="email" aria-label="Email" flat />

              <div class="flex gap-1 mt-5">
                <volt-contrast-button @click="showEditEmail=false">
                  {{ $t("Annuler") }}
                </volt-contrast-button>

                <volt-contrast-button @click="requestUpdate">
                  {{ $t("Changer l'email") }}
                </volt-contrast-button>
              </div>
            </form>
          </template>
        </volt-inplace>

        <p class="font-light mt-4">
          {{ $t("Policy: account") }} <NuxtLinkLocale to="/privacy">{{ $t("politique de confidentialité") }}</NuxtLinkLocale>
        </p>
      </template>
    </volt-card>

    <!-- Billing -->
    <volt-card v-if="profile" id="billing" class="border-none mt-2">
      <template #title>
        {{ $t('Adresses de facturation') }}
      </template>

      <account-billing-form v-for="address in profile.userprofile.address_set" :key="address.id" :address="address" @delete-complete="handleDelete" />
      <account-billing-form v-if="showNewAddressForm" @create-complete="handleCreation" @close="showNewAddressForm=false" />

      <template #content>
        <div class="flex justify-end">
          <volt-secondary-button rounded @click="showNewAddressForm=!showNewAddressForm">
            <Icon name="i-fa7-solid:plus" />
            {{ $t('Ajouter') }}
          </volt-secondary-button>
        </div>
      </template>
    </volt-card>
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

definePageMeta({
  layout: 'accounts'
})

const { t } = useI18n()
const { $client } = useNuxtApp() 
const { customHandleError } = useErrorHandler()

const { getProfile, userId } = useUser()
const profile = await getProfile(`/api/v1/accounts/${userId.value}`)

const emailPasswordRequestData = ref<EmailPasswordData>({
  email: '',
  current_password: '',
  password1: '',
  password2: ''
})

const showNewAddressForm = ref<boolean>(false)
const showEditPassword = ref<boolean>(false)
const showEditEmail = ref<boolean>(false)

// Resets the user's password
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

// Toggles the section that reveals the input for the
// user to modify his email
function handleEditEmail() {
  if (profile) {
    emailPasswordRequestData.value.email = profile.email
    showEditEmail.value = true
  }
}

// The addresse set to be created
function handleCreation(data: AddressSet) {
  if (profile) {
    profile.userprofile.address_set.push(data)
  }
}

// Deletes an address set
function handleDelete(id: number) {
  if (profile) {
    const index = profile.userprofile.address_set.findIndex(x => x.id === id)
    profile.userprofile.address_set.splice(index, 1)
  }
}

// Requests an update for the password and/or
// the email address by the user 
async function requestUpdate() {
  await $client(`/api/v1/accounts/${userId.value}`, {
    method: 'PATCH',
    body: emailPasswordRequestData.value,
    onResponse() {
      resetEmailPasswordData()
    },
    onRequestError({ error }) {
      resetEmailPasswordData()
      customHandleError(error)
    }
  })
}

useHead({
  title: t('Mon compte'),
  meta: [
    {
      key: 'description',
      content: ''
    }
  ]
})

</script>
