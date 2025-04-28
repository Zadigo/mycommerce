<template>
  <div class="mx-auto px-10">
    <h3 class="font-bold mb-5">
      {{ $t("Créer un compte") }}
    </h3>
    
    <form @submit.prevent>
      <TailInput v-model="requestData.email" :placeholder="$t('Email')" type="email" class="mb-2" autocomplete="email" />
      <TailInput v-model="requestData.password" :placeholder="$t('Mot de passe')" type="password" class="mb-5" autocomplete="new-password" flat />
      
      <p class="font-light text-slate-500 text-sm">
        {{ $t('Signup: Password constraints') }}
      </p>
      
      <div class="my-5">
        <v-checkbox v-model="requestData.newsletter" label="Je veux recevoir les nouveautés et des communications commerciales personnalisées de BERSHKA par e-mail ou d'autres moyens." />
        <v-checkbox v-model="acceptPrivacy" label="J'ai lu et j'accepte les Conditions générales  et je comprends les informations sur le traitement de mes données personnelles expliquées dans la Politique de confidentialité" />
      </div>

      <TailButton id="signup-email" size="lg" class="w-full" @click="handleSignup">
        {{ $t('Créer un compte') }}
      </TailButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const RequestDataSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  newsletter: z.boolean()
})

type RequestData = z.infer<typeof RequestDataSchema>

const emit = defineEmits({
  authenticate () {
    return true
  }
})

const acceptPrivacy = ref<boolean>(false)
const requestData = ref<RequestData>({
  email: '',
  password: '',
  newsletter: false
})

const canSignup = computed(() => {
  return useArrayEvery([acceptPrivacy], (x) => x === true)
  // return [acceptPrivacy.value].every(x => x !== true)
})

async function handleSignup() {
  RequestDataSchema.parse(requestData.value)

  if (canSignup.value) {
    $fetch('/api/v1/signup', {
      method: 'POST',
      body: requestData.value
    })
    emit('authenticate')
  } else {
    // TODO: Show error message
  }
}
</script>
