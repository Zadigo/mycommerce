<template>
  <base-auth>
    <template v-slot-scoped="{ showLoginFields, loginFields, signupFields }">
      <div class="card-body">
        <auth-fields :show-login-fields="showLoginFields" :login-fields="loginFields" :signup-fields="signupFields" @login-credentials="updateLoginFields" @signup-credentials="updateSignupFields" />
        <additional-links />
        <!-- <v-col cols="12">
          <p class="my-1 text-white text-left">Vous n'avez pas encore de compte ? <router-link :to="{ name: 'signup_view' }">Créer un compte</router-link></p>
          <p v-if="!showLoginFields" class="my-1 text-white text-left">Vous avez déjà de compte ? <a @click="showLoginFields=true">Se connecter</a></p>
        </v-col> -->
      </div>

      <div class="card-footer">
        <button class="btn btn-block btn-primary text-white" @click="login({ redirect: true, to: 'home_view' })">
          <v-icon class="mr-2">mdi-login</v-icon>
          {{ $t('Login') }}
        </button>
      </div>
    </template>
  </base-auth>
</template>

<script>
import loginMixin from '@/mixins/login'

import AdditionalLinks from '@/components/auth/AdditionalLinks.vue'
import AuthFields from '@/components/auth/AuthFields.vue'
import BaseAuth from '@/layouts/BaseAuth.vue'

export default {
  name: 'LoginView',
   title() {
    return this.$t('Login')
  },
  mixins: [loginMixin],
  components: { 
    AdditionalLinks,
    AuthFields,
    BaseAuth
  } 
}
</script>
