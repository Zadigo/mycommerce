<template>
  <section id="user-page">
    <!-- Email / Password -->
    <tail-card v-if="profile" id="email-password">
      <tail-card-header>
        <tail-card-title class="font-title">
          {{ $t("Accédez à votre compte") }}
        </tail-card-title>
      </tail-card-header>

      <tail-card-content>
        <!-- Password -->
        <p class="font-semibold">
          {{ $t('Mot de passe') }}
        </p>

        <Transition mode="out-in">
          <form v-if="showEditPassword" class="my-3" @submit.prevent>
            <tail-input id="current-password" v-model="emailPasswordRequestData.current_password" :placeholder="$t('Mot de passe actuel')" type="password" autocomplete="false" />
            <tail-input id="password1" v-model="emailPasswordRequestData.password1" :placeholder="$t('Nouveau mot de passe')" class="my-2" type="password" autocomplete="new-password" />
            <tail-input id="password2" v-model="emailPasswordRequestData.password2" :placeholder="$t('Taper le mot de passe à nouveau')" autocomplete="new-password" type="password" />
            
            <div class="flex gap-1 mt-5">
              <tail-button class="rounded-full" @click="requestUpdate">
                {{ $t('Changer le mot de passe') }}
              </tail-button>

              <tail-button class="flex justify-between items-center rounded-full" rounded flat @click="showEditPassword=false">
                {{ $t("Annuler") }}
              </tail-button>
            </div>
          </form>
          
          <tail-button v-else class="my-3 flex items-center rounded-full" variant="light" @click="showEditPassword=true">
            <span class="me-2">*************</span>
            <Icon name="i-fa7-solid:pen" />
          </tail-button>
        </Transition>

        <!-- Email -->
        <p class="font-semibold mt-4">
          {{ $t("Email") }}
        </p>

        <form v-if="showEditEmail" class="my-3" @submit.prevent>
          <tail-input v-model="emailPasswordRequestData.email" placeholder="Email" type="email" aria-label="Email" flat />        
          
          <div class="flex gap-1 mt-5">
            <tail-button class="rounded-full" @click="requestUpdate">
              {{ $t("Changer l'email") }}
            </tail-button>
            
            <tail-button class="rounded-full" @click="showEditEmail=false">
              {{ $t("Annuler") }}
            </tail-button>
          </div>
        </form>

        <tail-button v-else class="my-3 rounded-full lowercase" variant="light" @click="handleEditEmail">
          <span class="me-2">
            {{ profile?.email }}
          </span>

          <Icon name="i-fa7-solid:pen" />
        </tail-button>

        <p class="font-light mt-4">
          {{ $t("Policy: account") }} <NuxtLinkLocale to="/privacy">{{ $t("politique de confidentialité") }}</NuxtLinkLocale>
        </p>
      </tail-card-content>
    </tail-card>

    <!-- Billing -->
    <tail-card v-if="profile" id="billing" class="card border-none mt-2">
      <tail-card-header>
        <tail-card-title>
          {{ $t('Information pour la facturation') }}
        </tail-card-title>
      </tail-card-header>

      <AccountBillingForm v-for="address in profile.userprofile.address_set" :key="address.id" :address="address" @delete-complete="handleDelete" />
      <AccountBillingForm v-if="showNewAddressForm" @create-complete="handleCreation"  @close="showNewAddressForm=false" />

      <tail-card-content class="flex justify-end">
        <tail-button class="rounded-full" @click="showNewAddressForm=!showNewAddressForm">
          <Icon name="i-fa7-solid:plus" />
          {{ $t('Ajouter') }}
        </tail-button>
      </tail-card-content>
    </tail-card>
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
const profile = await getProfile(userId.value)

const emailPasswordRequestData = ref<EmailPasswordData>({
  email: '',
  current_password: '',
  password1: '',
  password2: ''
})

const showNewAddressForm = ref<boolean>(false)
const showEditPassword = ref<boolean>(false)
const showEditEmail = ref<boolean>(false)

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
 * Toggles the section that reveals the input for the
 * user to modify his email
 */
function handleEditEmail() {
  if (profile) {
    emailPasswordRequestData.value.email = profile.email
    showEditEmail.value = true
  }
}

/**
 * @param data The addresse set to be created
 */
function handleCreation(data: AddressSet) {
  if (profile) {
    profile.userprofile.address_set.push(data)
  }
}

/**
 * Deletes an address set
 * 
 * @param id The id of the address set to delete
 */
function handleDelete(id: number) {
  if (profile) {
    const index = profile.userprofile.address_set.findIndex(x => x.id === id)
    profile.userprofile.address_set.splice(index, 1)
  }
}

/**
 * Requests an update for the password and/or
 * the email address by the user 
 */
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
