<template>
  <div class="mx-auto px-10">
    <h3 class="font-bold mb-5">
      {{ $t("Créer un compte") }}
    </h3>
    
    <form @submit.prevent>
      <TailInput v-model="requestData.email" :placeholder="$t('Email')" type="email" autocomplete="email" />
      <TailInput v-model="requestData.password1" :placeholder="$t('Mot de passe')" type="password" class="my-2" autocomplete="new-password" />
      <TailInput v-model="requestData.password2" :placeholder="$t('Mot de passe')" type="password" class="mb-5" autocomplete="new-password" />
      
      <p class="font-light text-slate-500 text-sm">
        {{ $t('Signup: Password constraints') }}
      </p>
      
      <div class="my-5">
        <div class="flex items-center space-x-2">
          <TailCheckbox v-model="requestData.newsletter" id="action-novelty-newsletter" />
          <TailLabel>
            {{ $t("Je veux recevoir les nouveautés et des communications commerciales personnalisées de BERSHKA par e-mail ou d'autres moyens") }}
          </TailLabel>
        </div>

        <div class="flex items-center space-x-2 mt-5">
          <TailCheckbox v-model="acceptPrivacy" id="action-accept-conditions" />
          <TailLabel>
            <p>
              {{ $t("J'ai lu et j'accepte les Conditions générales et je comprends les informations sur le traitement de mes données personnelles expliquées dans la") }} <RouterLink to="/conditions-generales">{{ $t("politique de confidentialité") }}</RouterLink>
            </p>
          </TailLabel>
        </div>
      </div>

      <TailButton id="action-signup-email" :disabled="!acceptPrivacy" size="lg" class="w-full" @click="handleSignup">
        {{ $t('Créer un compte') }}
      </TailButton>
    </form>
  </div>
</template>

<script setup lang="ts">
import { z } from 'zod'

const RequestDataSchema = z.object({
  email: z.string().email(),
  password1: z.string().min(8).refine(x => {
    console.log('RequestDataSchema', x)
    return x
  }),
  password2: z.string().min(8).refine(x => {
    console.log('RequestDataSchema', x)
    return x
  }),
  newsletter: z.boolean().default(false)
})

type RequestData = z.infer<typeof RequestDataSchema>

const emit = defineEmits({
  authenticate() {
    return true
  }
})

const acceptPrivacy = ref<boolean>(false)
const requestData = ref<RequestData>({
  email: '',
  password1: '',
  password2: '',
  newsletter: false
})

const { execute } = useFetch('/api/v1/signup', {
  method: 'POST',
  body: requestData.value,
  immediate: false,
  watch: false
})

/**
 * Signup the user
 */
const handleSignup = async () => {
  console.log('Signup')
  await RequestDataSchema.parseAsync(requestData.value)
  
  execute()

  requestData.value.email = ''
  requestData.value.password1 = ''
  requestData.value.password2 = ''
  
  emit('authenticate')
}
</script>
