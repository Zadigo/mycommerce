<template>
  <div v-if="showBillingForm" class="card-body">
    <v-form id="user-information" @submit.prevent>
      <div class="d-flex justify-content-end">
        <v-btn class="mb-2" variant="text" icon="mdi-close" @click="showBillingForm=false" />
      </div>
      
      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="proxyRequestData.firstname" variant="outlined" placeholder="Firstname" autocomplete="given-name " />
        <v-text-field v-model="proxyRequestData.lastname" variant="outlined" placeholder="Lastname" autocomplete="family-name " />
      </div>

      <v-text-field v-model="proxyRequestData.address_line" variant="outlined" placeholder="Address line" autocomplete="street-address" />

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="proxyRequestData.zip_code" variant="outlined" placeholder="Zip code" autocomplete="postal-code" />
        <v-text-field v-model="proxyRequestData.country" variant="outlined" placeholder="Country" autocomplete="country" />
      </div>

      <!-- TODO: Get data from quart -->
      <v-autocomplete v-model="proxyRequestData.city" :items="['Lille', 'Paris']" variant="outlined">
        <v-text-field />
      </v-autocomplete>
      
      <v-text-field v-model="proxyRequestData.telephone" type="tel" variant="outlined" placeholder="Telephone" autocomplete="tel" />          

      <div class="card shadow-none border">
        <div class="card-body">
          <p class="fw-bold">
            {{ $t("Sexe") }}
          </p>

          <!-- TODO: Add gender -->
          <!-- <v-radio-group v-model="requestData.sexe" hide-details>
            <v-radio label="Femme" value="Femme" />
            <v-radio label="Homme" value="Homme" />
          </v-radio-group> -->
        </div>
      </div>

      <p class="fw-bold mt-4">
        {{ $t("Date d'anniversaire") }}
      </p>

      <!-- TODO: Date of birth -->
      <!-- <v-btn variant="tonal" flat>
        {{ $t("Choisir la date d'anniversaire") }}

        <v-menu activator="parent" :close-on-content-click="false">
          <v-list>
            <v-date-picker v-model="proxyRequestData.date_of_birth" :max="maxBirthdayDate" />
          </v-list>
        </v-menu>
      </v-btn> -->

      <v-btn class="mt-4" color="secondary" block rounded @click="handleUpdateUserDetails">
        Mettre à jour
      </v-btn>
    </v-form>
  </div>


  <div v-else class="card-body data-fields" @click="handleShowBillingForm">
    <p class="fw-bold mb-2">{{ fullName }}</p>
    <p class="m-0"><!-- {{ profile.email }} --> Email</p>
  
    <p class="m-0">{{ address.address_line }}</p>
    <p class="m-0">{{ address.zip_code }} {{ address.city }}</p>
    
    <p class="m-0">{{ address.country }}</p>
    
    <p class="m-0">Téléphone portable: {{ address.telephone }}</p>
  </div>
</template>

<script setup lang="ts">
import { syncRef } from '@vueuse/core'
import type { PropType } from 'vue';
import type { AddressSet } from '~/types';

const props = defineProps({
  address: {
    type: Object as PropType<AddressSet>,
    default: () => {}
  }
})

const showBillingForm = ref(false)

const proxyRequestData = ref({
  firstname: '',
  lastname: '',
  address_line: '',
  zip_code: '',
  country: '',
  city: '',
  gender: 'Femme',
  telephone: ''
})

const requestData = ref({
  firstname: '',
  lastname: '',
  address_line: '',
  zip_code: '',
  country: '',
  city: '',
  gender: 'Femme',
  telephone: ''
})

const { $dayjs } = useNuxtApp()

const fullName = computed(() => {
  return `${proxyRequestData.value.firstname} ${proxyRequestData.value.lastname}`
})

syncRef(proxyRequestData, requestData, 'right')


const maxBirthdayDate = computed(() => {
  const currentDate = $dayjs()
  return currentDate
})

// const { history, undo, redo } = useRefHistory(requestData)

// const maxBirthdayYear = reactify(() => {
//   return dayjs().year() - 18
// })

// const maxBirthdayDate = ref(`${maxBirthdayYear().value}-12-31`)
// extendRef(proxyRequestData, { date_of_birth: maxBirthdayDate })

/**
 * Updates the user details to the
 * backend 
 */
async function handleUpdateUserDetails () {
  showBillingForm.value = false
}

function handleShowBillingForm () {
  proxyRequestData.value = props.address
  showBillingForm.value = true
}
</script>

<style lang="scss">
.card-body.data-fields {
  cursor: pointer;
}
</style>
