<template>
  <section>
    <div class="card shadow-sm">
      <div class="card-header">
        <h1 class="h6 text-uppercase fw-bold my-3">Accédez à votre compte</h1>
      </div>

      <div class="card-body">
        <p class="fw-bold">Mot de passe</p>
        <!-- class="p-3 bg-light d-block rounded-1 d-flex justify-content-between align-items-center" -->
        <v-btn class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block>
          <span>*************</span>
          <font-awesome-icon :icon="['fas', 'pen']" />
        </v-btn>

        <p class="fw-bold mt-4">Email</p>
        <!-- class="p-3 bg-light d-block rounded-1 d-flex justify-content-between align-items-center" -->
        <v-btn class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block>
          <span>google@gmail.com</span>
          <font-awesome-icon :icon="['fas', 'pen']" />
        </v-btn>

        <p class="fw-light mt-4">
          BERSHKA prend très au sérieux le respect de votre vie privée
          et nous sommes engagés dans la protection de vos données personnelles.
          Découvrez comment nous prenons soin et comment nous traitons vos
          données dans notre Politique de confidentialité.
        </p>
      </div>
    </div>

    <div class="card shadow-sm mt-2">
      <div class="card-header">
        <h1 class="h6 text-uppercase fw-bold my-3">Information pour la facturation</h1>
        <v-btn icon="mdi-close" @click="showBillingForm = false"></v-btn>
      </div>

      <div v-if="showBillingForm" class="card-body">
        <v-form id="user-information" @submit.prevent>
          <div class="d-flex justify-content-between gap-1">
            <v-text-field v-model="proxyRequestData.firstname" variant="outlined" placeholder="Firstname" autocomplete="given-name "></v-text-field>
            <v-text-field v-model="proxyRequestData.lastname" variant="outlined" placeholder="Lastname" autocomplete="family-name "></v-text-field>
          </div>
  
          <v-text-field v-model="proxyRequestData.address" variant="outlined" placeholder="Address line" autocomplete="street-address"></v-text-field>
  
          <div class="d-flex justify-content-between gap-1">
            <v-text-field v-model="proxyRequestData.zip_code" variant="outlined" placeholder="Zip code" autocomplete="postal-code"></v-text-field>
            <v-text-field v-model="proxyRequestData.country" variant="outlined" placeholder="Country" autocomplete="country"></v-text-field>
          </div>
  
          <v-select v-model="proxyRequestData.city" :items="cities" variant="outlined"></v-select>
  
          <v-text-field v-model="proxyRequestData.telephone" variant="outlined" placeholder="Telephone" autocomplete="tel"></v-text-field>
  
          <div class="card shadow-none border">
            <div class="card-body">
              <p class="fw-bold">Sexe</p>
              <v-radio-group v-model="requestData.sexe" hide-details>
                <v-radio label="Femme" value="Femme"></v-radio>
                <v-radio label="Homme" value="Homme"></v-radio>
              </v-radio-group>
            </div>
          </div>
  
          <p class="fw-bold mt-4">Date d'anniversaire</p>
          <!-- <v-date-field></v-date-field> -->
  
          <v-btn class="mt-4" color="primary" block @click="handleUpdateUserDetails">
            Mettre à jour
          </v-btn>
        </v-form>
      </div>

      <div v-else class="card-body" @click="showBillingForm = true">
        <p class="fw-bold mb-2">{{ fullName }}</p>
        <p class="m-0">{{ proxyRequestData.email }}</p>
        <p class="m-0">{{ proxyRequestData.address }}</p>
        <p class="m-0">{{ proxyRequestData.zip_code }} {{ proxyRequestData.city }}</p>
        <p class="m-0">{{ proxyRequestData.country }}</p>
        <p class="m-0">Téléphone portable: {{ proxyRequestData.telephone }}</p>
      </div>
    </div>
  </section>
</template>

<script>
import { ref } from 'vue'
import { useRefHistory } from '@vueuse/core'
import cities from 'data/fr_cities.json'
import { computed } from 'vue'

export default {
  setup () {
    const proxyRequestData = ref({
      firstname: null,
      lastname: null,
      address: null,
      zip_code: null,
      country: null,
      city: null,
      sexe: 'Femme',
      telephone: null
    })
    const requestData = ref({
      firstname: null,
      lastname: null,
      address: null,
      zip_code: null,
      country: null,
      city: null,
      sexe: 'Femme',
      telephone: null
    })

    const { history, undo, redo } = useRefHistory(requestData)

    const fullName = computed(() => {
      return `${proxyRequestData.value.firstname} ${proxyRequestData.value.lastname}`
    })

    // syncRef(proxyRequestData, requestData, 'right')

    const showBillingForm = ref(false)

    return {
      history,
      undoRequestData: undo,
      redoRequestData: redo,
      fullName,
      showBillingForm,
      proxyRequestData,
      requestData,
      cities
    }
  },
  mounted () {
    this.requestUserDetails()
  },
  methods: {
    async requestUserDetails () {
      this.proxyRequestData = {
        firstname: 'Aurélie',
        lastname: 'Mazon',
        address: '45 rue de Paris',
        zip_code: '75000',
        country: 'FR',
        city: 'Nord',
        sexe: 'Femme',
        telephone: '06 01 01 01 01'
      }
    },
    async handleUpdateUserDetails () {
      this.showBillingForm = false
    }
  }
}
</script>
