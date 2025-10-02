<template>
  <volt-dialog v-model:visible="showWhatsAppModal" modal>
    <template #header>
      WhatsApp
    </template>

    <div class="text-center">
      <NuxtImg :src="qrCode" />

      <p class="text-small mt-5">
        {{ $t('Scanne ce code QR pour accéder à whatsapp à partir de ton téléphone') }}
      </p>
    </div>
  </volt-dialog>
</template>

<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

const config = useRuntimeConfig()
const qrCode = useQRCode(config.public.whatsAppUrl)

const showWhatsAppModal = useState<boolean>('showWhatsAppModal')
</script>
