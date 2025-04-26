<template>
<TailDialog v-model:open="show" @close="show=false">
  <TailDialogContent>
    <TailDialogHeader>
      <TailDialogTitle>
        WhatsApp
      </TailDialogTitle>
    </TailDialogHeader>
    
    <div class="text-center">      
      <img :src="qrCode">

      <p class="text-small mt-5">
        Scanne ce code QR pour accéder à whatsapp à partir de ton téléphone
      </p>
    </div>
  </TailDialogContent>
</TailDialog>
</template>

<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

const config = useRuntimeConfig()
const qrCode = useQRCode(config.public.whatsAppUrl)

const props = defineProps({
  modelValue: {
    type: Boolean
  }
})

const emit = defineEmits({
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const show = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})
</script>
