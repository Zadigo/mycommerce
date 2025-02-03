<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h3>
          {{ $t("Créer un compte") }}
        </h3>
        
        <v-form @submit.prevent>
          <v-text-field v-model="requestData.email" type="email" variant="solo-filled" autocomplete="email" placeholder="Email" flat />
          <v-text-field v-model="requestData.password" type="password" variant="solo-filled" autocomplete="new-password" placeholder="Mot de passe" flat />
          <p class="fw-light text-bg-tertiary text-small">
            8 caractères minimum, comprenant une minuscule, une majuscule et un chiffre. 
            Ne pas répéter plus de 3 fois le même caractère
          </p>

          <v-checkbox v-model="requestData.newsletter" label="Je veux recevoir les nouveautés et des communications commerciales personnalisées de BERSHKA par e-mail ou d'autres moyens." />
          <v-checkbox v-model="acceptPrivacy" label="J'ai lu et j'accepte les Conditions générales  et je comprends les informations sur le traitement de mes données personnelles expliquées dans la Politique de confidentialité" />

          <v-btn id="signup-email" class="text-light" color="dark" size="x-large" block flat rounded @click="handleSignup">
            {{ $t('Créer un compte') }}
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
interface RequestData {
  email: string
  password: string
  newsletter: boolean
}

const emit = defineEmits({
  authenticate () {
    return true
  }
})

const acceptPrivacy = ref(false)
const requestData = ref<RequestData>({
  email: '',
  password: '',
  newsletter: false
})

const canSignup = computed(() => {
  return [acceptPrivacy.value].every(x => x !== true)
})

/**
 * TODO: Returns the Django signup url that will be
 * used to create a new user
 */
// const signupUrl = computed((): string => {
//   const url = import.meta.env.VITE_DEVELOPMENT_SIGNUP_URL
//   const query = new URLSearchParams()

//   query.append('c', route.path)
//   return url + `?${query}`
// })

async function handleSignup () {
  if (canSignup.value) {
    emit('authenticate')
  } else {
    // TODO: Show error message
  }
}
</script>
