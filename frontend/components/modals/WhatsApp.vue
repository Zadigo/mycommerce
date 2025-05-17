<template>
<TailDialog v-model:open="showWhatsAppModal" @close="showWhatsAppModal=false">
  <TailDialogContent>
    <TailDialogHeader>
      <TailDialogTitle>
        WhatsApp
      </TailDialogTitle>
    </TailDialogHeader>
    
    <div class="text-center">      
      <NuxtImg :src="qrCode" />

      <p class="text-small mt-5">
        {{ $t('Scanne ce code QR pour accéder à whatsapp à partir de ton téléphone') }}
      </p>
    </div>
  </TailDialogContent>
</TailDialog>
</template>

<script setup lang="ts">
import { useQRCode } from '@vueuse/integrations/useQRCode'

const config = useRuntimeConfig()
const qrCode = useQRCode(config.public.whatsAppUrl)

const shopStore = useShop()
const { showWhatsAppModal } = storeToRefs(shopStore)
</script>
