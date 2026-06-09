<template>
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

              <volt-contrast-button rounded @click="handleUpdate">
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
          <icon name="i-fa7-solid:pen" />
        </template>

        <template #content>
          <form class="my-3" @submit.prevent>
            <volt-input-text v-model="emailPasswordRequestData.email" placeholder="Email" type="email" aria-label="Email" flat />

            <div class="flex gap-1 mt-5">
              <volt-contrast-button @click="showEditEmail=false">
                {{ $t("Annuler") }}
              </volt-contrast-button>

              <volt-contrast-button @click="handleUpdate">
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
</template>

<script setup lang="ts">
import type { UserProfile } from '~/types'

const props = defineProps<{
  profile: UserProfile | null
}>()

const [showEditPassword, toggleShowEditPassword] = useToggle<boolean>(false)
const [showEditEmail, toggleShowEditEmail] = useToggle<boolean>(false)

/**
 * Reset data
 */

const isUpdating = ref<boolean>(false)

whenever(isUpdating, () => {
  emailPasswordRequestData.value = {
    email: props.profile ? props.profile.email : '',
    current_password: '',
    password1: '',
    password2: ''
  }
  showEditEmail.value = false
  showEditPassword.value = false
})

interface EmailPasswordData {
  email: string
  current_password: string
  password1: string,
  password2: string
}

const emailPasswordRequestData = ref<EmailPasswordData>({
  email: '',
  current_password: '',
  password1: '',
  password2: ''
})

const { customHandleError } = useErrorHandler()
const { userId } = useUser()
const { $client } = useNuxtApp()

// Requests an update for the password and/or
// the email address by the user 
async function handleUpdate() {
  isUpdating.value = true

  await $client(`/api/v1/accounts/${userId.value}`, {
    method: 'PATCH',
    body: emailPasswordRequestData.value,
    onRequestError({ error }) {
      customHandleError(error)
    }
  })

  isUpdating.value = false
}
</script>
