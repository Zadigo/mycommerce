<template>
  <section>
    <!-- Email / Password -->
    <div id="email-password" class="card shadow-sm">
      <div class="card-header">
        <h1 class="h6 text-uppercase fw-bold my-3">
          {{ $t("Accédez à votre compte") }}
        </h1>
      </div>

      <div class="card-body">
        <!-- Password -->
        <p class="fw-bold">
          {{ $t('Mot de passe') }}
        </p>

        <transition name="opacity" mode="out-in">
          <v-form v-if="showEditPassword" class="password-block" @submit.prevent>
            <v-text-field id="password1" v-model="emailPasswordData.password1" variant="solo-filled" placeholder="Password 1" type="password" aria-label="Password 1" flat />
            <v-text-field id="password2" v-model="emailPasswordData.password2" variant="solo-filled" placeholder="Password 2" type="password" aria-label="Password 2" flat />
            
            <v-btn color="secondary" rounded @click="requestChangeEmailPassword">
              {{ $t('Changer le mot de passe') }}
            </v-btn>
          </v-form>

          <v-btn v-else class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block @click="showEditPassword = true">
            <span class="me-2">*************</span>
            <font-awesome-icon :icon="['fas', 'pen']" />
          </v-btn>
        </transition>

        <!-- Email -->
        <p class="fw-bold mt-4">
          {{ $t("Email") }}
        </p>

        <v-form v-if="showEditEmail" class="password-block" @submit.prevent>
          <v-text-field v-model="emailPasswordData.email" variant="solo-filled" placeholder="Email" type="email" aria-label="Email" flat />        
          
          <v-btn color="secondary" rounded @click="requestChangeEmailPassword">
            {{ $t("Changer l'email") }}
          </v-btn>
        </v-form>
        
        <v-btn v-else class="d-flex justify-content-between align-items-center" color="dark" variant="text" flat block @click="showEditEmail = true">
          <span class="me-2">{{ profile?.email }}</span>
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

    <!-- Billing -->
    <div v-if="profile" id="billing" class="card shadow-sm mt-2">
      <div class="card-header">
        <h1 class="h6 text-uppercase fw-bold my-3">
          {{ $t('Information pour la facturation') }}
        </h1>
      </div>

      <billing-form v-for="address in profile.userprofile.address_set" :key="address.id" :address="address" />
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuthentication } from 'src/stores/authentication'
import { useMessages } from 'src/stores/messages'

import BillingForm from 'src/components/accounts/BillingForm.vue'

declare type CredentialsMethod = 'email' | 'password'

export default defineComponent({
  name: 'UserPage',
  components: {
    BillingForm
  },
  setup () {
    const messagesStore = useMessages()

    const authenticationStore = useAuthentication()
    const { profile } = storeToRefs(authenticationStore)

    const emailPasswordData = ref({
      email: null,
      password1: null,
      password2: null
    })

    const showBillingForm = ref(false)
    const showEditPassword = ref(false)
    const showEditEmail = ref(false)

    provide('profile', profile)

    return {
      history,
      profile,
      messagesStore,
      emailPasswordData,
      showEditPassword,
      showEditEmail,
      showBillingForm
    }
  },
  mounted () {
    this.requestUserDetails()
  },
  methods: {
    /**
     * Requests an update for the password and/or
     * the email address by the user 
     */
    async requestChangeEmailPassword (method: CredentialsMethod) {
      try {
        await this.$http.post('accounts/update', this.emailPasswordData)

        this.emailPasswordData.email = null
        this.emailPasswordData.password1 = null
        this.emailPasswordData.password2 = null
        
        if (method === 'password') {
          this.showEditPassword = false
        } else if (method === 'email') {
          this.showEditEmail= false
        }
      } catch (e) {
        this.showEditEmail = false
        this.showEditPassword = false
        this.resetEmailPasswordData()
        this.messagesStore.addErrorMessage('Not saved', 'Items not saved')
      }
    },
    /**
     * Returns details on the profile for
     * the currently authenticated user 
     */
    async requestUserDetails () {
      try {
        if (!this.$session.keyExists('profile')) {
          const response = await this.$http.get('accounts/profile')
          this.profile = response.data
          this.$session.create('profile', this.profile)
        } else {
          this.profile = this.$session.retrieve('profile')
        }
      } catch (e) {
        console.log(e)
      }
    },
    resetEmailPasswordData () {
      this.emailPasswordData = {
        email: null,
        password1: null,
        password2: null
      }
    }
  }
})
</script>
