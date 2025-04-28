<template>
  <TailDialog v-model="show">
    <TailDialogContent>
      <TailDialogHeader>
        <TailDialogTitle>
          Alerte inventaire
        </TailDialogTitle>
      </TailDialogHeader>

      <h2 class="text-2xl font-semibold mb-3">
        La taille "{{ selectedSize }}" n'est plus en stock
      </h2>

      <p class="font-light">
        Renseignes ton adresse e-mail dans le champ 
        ci-dessous pour être averti lorsque cet article est 
        de retour en stock
      </p>

      <form class="mt-4" @submit.prevent>
        <TailInput v-model="email" type="email" class="w-full block" placeholer="Addresse email" />
  
        <TailButton color="primary" class="w-full block" @click="execute">
          S'inscrire
        </TailButton>
      </form>
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
