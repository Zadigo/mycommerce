<template>
  <volt-dialog v-model:visible="show" header="Alerte inventaire" modal style="width: 500px;">
    <div class="p-10">
      <h2 class="font-semibold mb-3">
        La taille "{{ selectedSize?.name }}" n'est plus en stock
      </h2>

      <p class="font-light">
        Renseignes ton adresse e-mail dans le champ ci-dessous pour être averti lorsque cet article est de retour en stock
      </p>

      <form class="mt-4" @submit.prevent>
        <volt-input-text v-model="email" :placeholer="$t('Addresse email')" type="email" class="w-full block" />

        <volt-button class="w-full block mt-5" size="lg" @click="() => { execute() }">
          S'inscrire
        </volt-button>
      </form>
    </div>
  </volt-dialog>
</template>

<script setup lang="ts">
import type { ExtendedRouteParamsRawGeneric, ProductNode, Undefineable } from '~/types';

const props = defineProps<{ product: Undefineable<ProductNode> }>()
const { selectedSize  } = useSizeSelection(props.product)

const show = defineModel<boolean>('show')

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
