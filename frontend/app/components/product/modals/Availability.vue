<template>
  <tail-dialog v-model:open="show">
    <tail-dialog-content>
      <tail-dialog-header>
        <tail-dialog-title>
          Alerte inventaire
        </tail-dialog-title>
      </tail-dialog-header>

      <div class="p-10">
        <h2 class="text-2xl font-semibold mb-3">
          La taille "{{ userSelection.size }}" n'est plus en stock
        </h2>

        <p class="font-light">
          Renseignes ton adresse e-mail dans le champ 
          ci-dessous pour être averti lorsque cet article est 
          de retour en stock
        </p>

        <form class="mt-4" @submit.prevent>
          <TailInput v-model="email" :placeholer="$t('Addresse email')" type="email" class="w-full block" />
    
          <tail-button class="w-full block mt-5" size="lg" @click="execute">
            S'inscrire
          </tail-button>
        </form>
      </div>
    </tail-dialog-content>
  </tail-dialog>
</template>

<script setup lang="ts">
import type { ExtendedRouteParamsRawGeneric } from '~/types'

const cartStore = useCart()
const { userSelection } = storeToRefs(cartStore)

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits<{ 'update:modelValue': [] }>()
const show = useVModel(props, 'modelValue', emit)

const { id } = useRoute().params as ExtendedRouteParamsRawGeneric
const email = ref<string>('')

const { execute } = useAsyncData(() => {
  return $fetch('', {
    method: 'POST',
    body: {
      product_id: id,
      email: email.value
    }
  })
}, {
  immediate: false
})
</script>
