<template>
  <div v-if="showBillingForm" class="card-body">
    <v-form id="user-information" @submit.prevent>
      <v-btn icon="mdi-close" @click="showBillingForm = false" />
      
      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="proxyRequestData.firstname" variant="outlined" placeholder="Firstname" autocomplete="given-name " />
        <v-text-field v-model="proxyRequestData.lastname" variant="outlined" placeholder="Lastname" autocomplete="family-name " />
      </div>

      <v-text-field v-model="proxyRequestData.address" variant="outlined" placeholder="Address line" autocomplete="street-address" />

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="proxyRequestData.zip_code" variant="outlined" placeholder="Zip code" autocomplete="postal-code" />
        <v-text-field v-model="proxyRequestData.country" variant="outlined" placeholder="Country" autocomplete="country" />
      </div>

      <v-autocomplete v-model="proxyRequestData.city" :items="cities" variant="outlined">
        <v-text-field />
      </v-autocomplete>
      
      <v-text-field v-model="proxyRequestData.telephone" type="tel" variant="outlined" placeholder="Telephone" autocomplete="tel" />          

      <div class="card shadow-none border">
        <div class="card-body">
          <p class="fw-bold">
            {{ $t("Sexe") }}
          </p>

          <v-radio-group v-model="requestData.sexe" hide-details>
            <v-radio label="Femme" value="Femme" />
            <v-radio label="Homme" value="Homme" />
          </v-radio-group>
        </div>
      </div>

      <p class="fw-bold mt-4">
        {{ $t("Date d'anniversaire") }}
      </p>

      <v-btn variant="tonal" flat>
        {{ $t("Choisir la date d'anniversaire") }}

        <v-menu activator="parent" :close-on-content-click="false">
          <v-list>
            <v-date-picker v-model="proxyRequestData.date_of_birth" :max="maxBirthdayDate" />
          </v-list>
        </v-menu>
      </v-btn>

      <v-btn class="mt-4" color="secondary" block rounded @click="handleUpdateUserDetails">
        Mettre à jour
      </v-btn>
    </v-form>
  </div>

  <div v-else class="card-body" @click="showBillingForm = true">
    <p class="fw-bold mb-2">
      {{ fullName }}
    </p>

    <p class="m-0">
      {{ profile.email }}
    </p>
    
    <p class="m-0">
      {{ address.address_line }}
    </p>
    
    <p class="m-0">
      {{ address.zip_code }} {{ address.city }}
    </p>
    
    <p class="m-0">
      {{ address.country }}
    </p>
    
    <p class="m-0">
      Téléphone portable: {{ address.telephone }}
    </p>
  </div>
</template>

<script lang="ts" setup>
import { syncRef, reactify, extendRef } from '@vueuse/core'
import type { PropType } from 'vue';
import type { AddressSet, User } from '~/types';

defineProps({
  address: {
    type: Object as PropType<AddressSet>,
    default: () => {}
  }
})

const profile = inject<User>('profile')
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
syncRef(proxyRequestData, requestData, 'right')

const fullName = computed(() => {
  return `${proxyRequestData.value.firstname} ${proxyRequestData.value.lastname}`
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
</script>
