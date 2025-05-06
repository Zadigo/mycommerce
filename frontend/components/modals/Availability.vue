<template>
  <TailDialog v-model:open="show">
    <TailDialogContent>
      <TailDialogHeader>
        <TailDialogTitle>
          Alerte inventaire
        </TailDialogTitle>
      </TailDialogHeader>

      <div class="pa-10">
        <h2 class="text-2xl font-semibold mb-3">
          La taille "{{ selectedSize }}" n'est plus en stock
        </h2>

        <p class="font-light">
          Renseignes ton adresse e-mail dans le champ 
          ci-dessous pour être averti lorsque cet article est 
          de retour en stock
        </p>

        <form class="mt-4" @submit.prevent>
          <TailInput v-model="email" :placeholer="$t('Addresse email')" type="email" class="w-full block" />
    
          <TailButton class="w-full block mt-5" size="lg" @click="execute">
            S'inscrire
          </TailButton>
        </form>
      </div>
    </TailDialogContent>
  </TailDialog>
</template>

<script setup lang="ts">
import type { DefaultClotheSize } from '~/data'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  selectedSize: {
    type: String as PropType<DefaultClotheSize>,
    default: 'Unique'
  }
})

const emit = defineEmits({
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const email = ref<string>('')

const show = computed({
  get: () => props.modelValue,
  set: (value: boolean) => {
    emit('update:modelValue', value)
  }
})

const { execute } = useAsyncData(() => {
  return $fetch('', {
    method: 'POST',
    body: {
      product_id: null,
      email: email.value
    }
  })
}, {
  immediate: false
})
</script>
