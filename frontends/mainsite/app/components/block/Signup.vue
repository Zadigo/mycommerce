<template>
  <div class="mx-auto px-10">
    <h3 class="font-bold mb-5">
      {{ $t("Créer un compte") }}
    </h3>
    
    <form @submit.prevent>
      <volt-input-text v-model="requestData.email" :placeholder="$t('Email')" type="email" autocomplete="email" />
      <volt-input-text v-model="requestData.password" :placeholder="$t('Mot de passe')" type="password" class="my-2" autocomplete="new-password" />
      <volt-input-text v-model="requestData.password_confirmation" :placeholder="$t('Mot de passe')" type="password" class="mb-5" autocomplete="new-password" />
      
      <p class="font-light text-slate-500 text-sm">
        {{ $t('Signup: Password constraints') }}
      </p>
      
      <div class="my-5">
        <div class="flex items-center space-x-2">
          <volt-label label-for="checkbox-newsletter" class="leading-5">
            <volt-checkbox v-model="requestData.newsletter" id="action-novelty-newsletter" />
            <template #label>
              {{ $t('Je veux recevoir les nouveautés et des communications commerciales personnalisées de BERSHKA par e-mail ou dautres moyens') }}
            </template>
          </volt-label>
        </div>

        <div class="flex items-center space-x-2 mt-5">
          <volt-label label-for="checkbox-privacy" class="leading-5">
            <volt-checkbox v-model="acceptPrivacy" id="action-accept-conditions" />
            <template #label>
              {{ $t("J'ai lu et j'accepte les Conditions générales et je comprends les informations sur le traitement de mes données personnelles expliquées dans la") }} <RouterLink to="/conditions-generales">{{ $t("politique de confidentialité") }}</RouterLink>
            </template>
          </volt-label>
        </div>
      </div>

      <volt-button id="action-signup-email" :disabled="!acceptPrivacy" size="lg" class="w-full" @click="handleSignup">
        {{ $t('Créer un compte') }}
      </volt-button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const RequestDataSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
  password_confirmation: z.string().min(8),
  newsletter: z.boolean().default(false)
})

type RequestData = z.infer<typeof RequestDataSchema>

const emit = defineEmits<{ authenticate: [] }>()

const acceptPrivacy = ref<boolean>(false)
const requestData = ref<RequestData>({
  email: '',
  password: '',
  password_confirmation: '',
  newsletter: false
})

const handleSignup = async () => {
  console.log('Signup')
  // await RequestDataSchema.parseAsync(requestData.value)
  
  const data = $fetch<{ id: number }>('/api/v1/accounts/signup', {
    baseURL: useRuntimeConfig().public.prodDomain,
    method: 'POST',
    body: requestData.value
  })

  requestData.value.email = ''
  requestData.value.password = ''
  requestData.value.password_confirmation = ''
  
  emit('authenticate')
}
</script>
