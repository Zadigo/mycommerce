<template>
  <TailCardContent v-if="showBillingForm || forCreation">
    <form id="user-information" @submit.prevent>
      <div class="flex justify-end">
        <v-btn class="mb-2" variant="text" icon="mdi-close" @click="handleClose" />
      </div>
      
      <div class="flex justify-between gap-1">
        <v-text-field v-model="requestData.firstname" variant="outlined" placeholder="Firstname" autocomplete="given-name " />
        <v-text-field v-model="requestData.lastname" variant="outlined" placeholder="Lastname" autocomplete="family-name " />
      </div>

      <v-text-field v-model="requestData.address_line" variant="outlined" placeholder="Address line" autocomplete="street-address" />

      <div class="flex justify-between gap-1">
        <v-text-field v-model="requestData.zip_code" variant="outlined" placeholder="Zip code" autocomplete="postal-code" />
        <v-text-field v-model="requestData.country" variant="outlined" placeholder="Country" autocomplete="country" />
      </div>

      <!-- TODO: Get data from quart -->
      <v-autocomplete v-model="requestData.city" :items="['Lille', 'Paris']" variant="outlined">
        <v-text-field />
      </v-autocomplete>
      
      <v-text-field v-model="requestData.telephone" type="tel" variant="outlined" placeholder="Telephone" autocomplete="tel" />          

      <TailCard class="card shadow-none border">
        <TailCardContent>
          <p class="font-bold">
            {{ $t("Sexe") }}
          </p>

          <!-- TODO: Add gender -->
          <!-- <v-radio-group v-model="requestData.sexe" hide-details>
            <v-radio label="Femme" value="Femme" />
            <v-radio label="Homme" value="Homme" />
          </v-radio-group> -->
        </TailCardContent>
      </TailCard>

      <p class="font-bold mt-4">
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

      <TailButton  v-if="forCreation" class="mt-4 rounded-full" @click="requestCreate">
        {{ $t("Ajouter l'addresse") }}
      </TailButton>

      <TailButton v-else class="mt-4 rounded-full" @click="requestUpdate">
        {{ $t("Mettre à jour") }}
      </TailButton>
    </form>
  </TailCardContent>

  <TailCardContent v-else class="bg-slate-50 cursor-pointer hover:bg-slate-100 mx-5 pa-5 rounded-md">
    <div class="flex justify-end">
      <v-btn variant="tonal" size="x-small" rounded @click="requestDelete">
        <font-awesome icon="trash" />
      </v-btn>
    </div>
    
    <div class="p-1" @click="handleShowBillingForm">
      <p class="font-bold mb-2">{{ fullName }}</p>
      <p class="mb-1">
        <span v-if="profile">{{ profile.email }}</span>
      </p>
    
      <p class="mb-1">{{ address.address_line }}</p>
      <p class="mb-1">{{ address.zip_code }} {{ address.city }}</p>
      
      <p class="mb-1"><font-awesome icon="map-location" class="me-1" /> {{ address.country }}</p>
      
      <p><font-awesome icon="phone" class="me-1" /> {{ address.telephone }}</p>
    </div>
  </TailCardContent>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import type { AddressSet } from '~/types'

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
const { profile } = storeToRefs(authStore)
const { handleError } = useErrorHandler()
const { $dayjs, $client } = useNuxtApp()

const showBillingForm = ref<boolean>(false)
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

/**
 * 
 */
function resetEmailPasswordData() {

}

/**
 * Updates the user details to the
 * backend 
 */
async function requestUpdate () {
  const response = await $client<EditableAddressSet>(
    `/api/v1/accounts/${authStore.userId}/address-lines/${props.address.id}`, 
    {
      method: 'PATCH',
      body: requestData.value,
      onRequestError({ error }) {
        handleError(error)
        showBillingForm.value = false
      },
      onResponse() {
        emit('edit-complete', response)
        showBillingForm.value = false
      }
    }
  )
}

/**
 * 
 */
async function requestCreate() {
  const response = await $client<EditableAddressSet>(
    `/api/v1/accounts/${authStore.userId}/address-lines`, 
    {
      method: 'POST',
      body: requestData.value,
      onRequestError({ error }) {
        handleError(error)
      },
      onResponse() {
        emit('create-complete', response)
        emit('close')
      }
    }
  )
}

/**
 * Requests an update for the password and/or
 * the email address by the user 
 */
async function requestDelete() {
  await $client(`/api/v1/accounts/${authStore.userId}/address-lines/${props.address.id}`, {
    method: 'DELETE',
    onResponse() {
      emit('delete-complete', props.address.id)
    },
    onRequestError({ error }) {
      handleError(error)
      resetEmailPasswordData()
    }
  })
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

/**
 * 
 */
function handleShowBillingForm() {
  requestData.value = props.address
  showBillingForm.value = true
}

/**
 * 
 */
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
