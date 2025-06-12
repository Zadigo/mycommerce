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
            <TailInput id="current-password" v-model="emailPasswordRequestData.current_password" :placeholder="$t('Mot de passe actuel')" type="password" autocomplete="false" />
            <TailInput id="password1" v-model="emailPasswordRequestData.password1" :placeholder="$t('Nouveau mot de passe')" class="my-2" type="password" autocomplete="new-password" />
            <TailInput id="password2" v-model="emailPasswordRequestData.password2" :placeholder="$t('Taper le mot de passe à nouveau')" autocomplete="new-password" type="password" />
            
            <div class="flex gap-1 mt-5">
              <TailButton class="rounded-full" @click="requestUpdate">
                {{ $t('Changer le mot de passe') }}
              </TailButton>

              <TailButton class="flex justify-between items-center rounded-full" rounded flat @click="showEditPassword=false">
                {{ $t("Annuler") }}
              </TailButton>
            </div>
          </form>
          
          <TailButton v-else class="flex items-center rounded-full" variant="light" @click="showEditPassword=true">
            <span class="me-2">*************</span>
            <Icon name="fa-solid:pen" />
          </TailButton>
        </Transition>

        <!-- Email -->
        <p class="font-bold mt-4">
          {{ $t("Email") }}
        </p>

        <form v-if="showEditEmail" class="password-block" @submit.prevent>
          <TailInput v-model="emailPasswordRequestData.email" placeholder="Email" type="email" aria-label="Email" flat />        
          
          <div class="flex gap-1 mt-5">
            <TailButton class="rounded-full" @click="requestUpdate">
              {{ $t("Changer l'email") }}
            </TailButton>
            
            <TailButton class="rounded-full" @click="showEditEmail=false">
              {{ $t("Annuler") }}
            </TailButton>
          </div>
        </form>

        <TailButton v-else class=" rounded-full" variant="light" @click="handleEditEmail">
          <span class="me-2">
            {{ profile?.email }}
          </span>

          <Icon name="fa-solid:pen" />
        </TailButton>

        <p class="font-light mt-4">
          {{ $t("Policy: account") }} <NuxtLinkLocale to="/privacy">{{ $t("politique de confidentialité") }}</NuxtLinkLocale>
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
        <TailButton class="rounded-full" @click="showNewAddressForm=!showNewAddressForm">
          <Icon name="fa-solid:plus" />
          {{ $t('Ajouter') }}
        </TailButton>
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

definePageMeta({
  layout: 'accounts'
})

const { t } = useI18n()
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
  if (profile.value) {
    emailPasswordRequestData.value.email = profile.value.email
    showEditEmail.value = true
  }
}

/**
 * @param data The addresse set to be created
 */
function handleCreation(data: AddressSet) {
  if (profile.value) {
    profile.value.userprofile.address_set.push(data)
  }
}

/**
 * Deletes an address set
 * 
 * @param id The id of the address set to delete
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
async function requestUpdate() {
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
