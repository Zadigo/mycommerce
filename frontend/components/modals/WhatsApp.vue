<template>
<v-dialog v-model="show" width="400" transition="dialog-bottom-transition">
  <v-card>
    <v-card-text>
      <div class="text-center">
        <h6 claass="fw-bold mb-5">
          WhatsApp
        </h6>
        
        <img :src="qrCode">

        <p class="text-small mt-5">
          Scanne ce code QR pour accéder à whatsapp à partir de ton téléphone
        </p>
      </div>
    </v-card-text>
  </v-card>
</v-dialog>
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
