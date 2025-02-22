<template>
  <div v-if="showBillingForm || forCreation" class="card-body">
    <v-form id="user-information" @submit.prevent>
      <div class="d-flex justify-content-end">
        <v-btn class="mb-2" variant="text" icon="mdi-close" @click="handleClose" />
      </div>
      
      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.firstname" variant="outlined" placeholder="Firstname" autocomplete="given-name " />
        <v-text-field v-model="requestData.lastname" variant="outlined" placeholder="Lastname" autocomplete="family-name " />
      </div>

      <v-text-field v-model="requestData.address_line" variant="outlined" placeholder="Address line" autocomplete="street-address" />

      <div class="d-flex justify-content-between gap-1">
        <v-text-field v-model="requestData.zip_code" variant="outlined" placeholder="Zip code" autocomplete="postal-code" />
        <v-text-field v-model="requestData.country" variant="outlined" placeholder="Country" autocomplete="country" />
      </div>

      <!-- TODO: Get data from quart -->
      <v-autocomplete v-model="requestData.city" :items="['Lille', 'Paris']" variant="outlined">
        <v-text-field />
      </v-autocomplete>
      
      <v-text-field v-model="requestData.telephone" type="tel" variant="outlined" placeholder="Telephone" autocomplete="tel" />          

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
            <v-date-picker v-model="requestData.date_of_birth" :max="maxBirthdayDate" />
          </v-list>
        </v-menu>
      </v-btn> -->

      <v-btn  v-if="forCreation" class="mt-4" color="secondary" block rounded @click="requestCreate">
        Ajouter l'addresse
      </v-btn>

      <v-btn v-else class="mt-4" color="secondary" block rounded @click="requestUpdate">
        Mettre à jour
      </v-btn>
    </v-form>
  </div>


  <div v-else class="card-body data-fields">
    <div class="d-flex justify-content-end">
      <v-btn variant="tonal" size="x-small" rounded @click="requestDelete">
        <font-awesome icon="trash" />
      </v-btn>
    </div>
    
    <div class="p-1" @click="handleShowBillingForm">
      <p class="fw-bold mb-2">{{ fullName }}</p>
      <p class="m-0">custom@email.com</p>
    
      <p class="m-0">{{ address.address_line }}</p>
      <p class="m-0">{{ address.zip_code }} {{ address.city }}</p>
      
      <p class="m-0"><font-awesome icon="map-location" class="me-1" /> {{ address.country }}</p>
      
      <p class="m-0"><font-awesome icon="phone" class="me-1" /> {{ address.telephone }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { AddressSet } from '~/types';

type EditableAddressSet = Omit<AddressSet, 'id' | 'is_active' | 'created_on'>

const props = defineProps({
  address: {
    type: Object as PropType<AddressSet>,
    default: null
  }
})

const emit = defineEmits({
  'edit-complete'(_data: EditableAddressSet) {
    return true
  },
  'create-complete'(_data: EditableAddressSet) {
    return true
  },
  'delete-complete'(_id: number) {
    return true
  },
  close() {
    return false
  }
})

const authStore = useAuthentication()
const { handleError } = useErrorHandler()
const { $dayjs, $client } = useNuxtApp()

const showBillingForm = ref(false)
const requestData = ref<EditableAddressSet>(props.address || {
  firstname: '',
  lastname: '',
  address_line: '',
  zip_code: '',
  country: '',
  city: '',
  telephone: '',
  gender: 1
})

function resetEmailPasswordData() {

}

/**
 * Updates the user details to the
 * backend 
 */
async function requestUpdate () {
  try {
    const response = await $client.patch<EditableAddressSet>(
      `/accounts/${authStore.userId}/address-lines/${props.address.id}`, 
      requestData.value
    )
    
    emit('edit-complete', response.data)
    showBillingForm.value = false
  } catch (e) {
    showBillingForm.value = false
    handleError(e)
  }
}

async function requestCreate() {
  try {
    const response = await $client.post<EditableAddressSet>(
      `/accounts/${authStore.userId}/address-lines`, 
      requestData.value
    )
    
    emit('create-complete', response.data)
    emit('close')
  } catch (e) {
    handleError(e)
  }
}

/**
 * Requests an update for the password and/or
 * the email address by the user 
 */
async function requestDelete() {
  try {
    await $client.delete(`accounts/${authStore.userId}/address-lines/${props.address.id}`)
    emit('delete-complete', props.address.id)
  } catch (e) {
    handleError(e)
    resetEmailPasswordData()
  }
}

const maxBirthdayDate = computed(() => {
  const currentDate = $dayjs()
  return currentDate
})

const forCreation = computed(() => {
  return props.address === null
})

const fullName = computed(() => {
  return `${requestData.value.firstname} ${requestData.value.lastname}`
})

function handleShowBillingForm () {
  requestData.value = props.address
  showBillingForm.value = true
}

function handleClose() {
  if (forCreation.value) {
    emit('close')
  } else {
    showBillingForm.value = false
  }
}
</script>

<style lang="scss">
.card-body.data-fields {
  cursor: pointer;
}
</style>
