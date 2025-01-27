<template>
  <ion-header>
    <ion-toolbar>
      <ion-buttons>
        <ion-nav-link router-direction="back">
          <ion-back-button :text="null" />
        </ion-nav-link>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>

  <ion-content>
    <ion-grid>
      <ion-row>
        <ion-col size="12">
          <p class="fw-bold">Mes addresses</p>
          <ion-list>
            <ion-nav-link :component="paymentOptions" router-direction="forward">
              <ion-item button>
                <ion-label>
                  <p class="fw-bold">1 rue de Marseille</p>
                  <p>45000, Lille</p>
                  <p>John Pendenque, +33 05 11 11 11 11</p>
                </ion-label>
              </ion-item>
            </ion-nav-link>

            <ion-nav-link :component="createAddress" router-direction="forward">
              <ion-button>
                Ajouter une addresse
              </ion-button>
            </ion-nav-link>
          </ion-list>
        </ion-col>
      </ion-row>
    </ion-grid>
  </ion-content>
</template>

<script setup lang="ts">
import { useErrorHandler } from '@/composables/errors'
import { useAxiosClient } from '@/plugins/client'
import { useCart } from '@/stores/cart'
import {
  IonButton,
  IonButtons,
  IonCol,
  IonNavLink,
  IonBackButton,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonToolbar
} from '@ionic/vue'
import { useLocalStorage } from '@vueuse/core'
import { arrowBack } from 'ionicons/icons'
import { storeToRefs } from 'pinia'
import { markRaw } from 'vue'
import { NewIntentAPIResponse } from './payment'

import CreateAddress from './CreateAddress.vue'
import PaymentOptions from './PaymentOptions.vue'

const cartStore = useCart()
const { requestData } = storeToRefs(cartStore)
const { client } = useAxiosClient()
const { handleError } = useErrorHandler()

const paymentIntent = useLocalStorage<NewIntentAPIResponse>('payment_intent', null, {
  deep: true,
  serializer: {
    read (raw) {
      return JSON.parse(raw)
    },
    write (value) {
      return JSON.stringify(value)
    }
  }
})

const createAddress = markRaw(CreateAddress)
const paymentOptions = markRaw(PaymentOptions)

/**
 * Update an existing payment intent
 */
async function handleUpdatePaymentIntent () {
  try {
    requestData.value.session_id = cartStore.sessionId

    await client.post('orders/intent/update', {
      intent: paymentIntent.value.intent,
      ...requestData.value
    })
  } catch (e) {
    handleError(e)
  }
}
</script>
