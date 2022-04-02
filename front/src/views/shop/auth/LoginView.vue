<template>
  <base-auth>
    <template v-slot-scoped="{ showLoginFields, loginFields, signupFields }">
      <b-card-text>
        <auth-fields :show-login-fields="showLoginFields" :login-fields="loginFields" :signup-fields="signupFields" @login-credentials="updateLoginFields" @signup-credentials="updateSignupFields" />

        <v-col cols="12">
          <p class="my-1 text-white text-left">Vous n'avez pas encore de compte ? <router-link :to="{ name: 'signup_view' }">Créer un compte</router-link></p>
          <p v-if="!showLoginFields" class="my-1 text-white text-left">Vous avez déjà de compte ? <a @click="showLoginFields=true">Se connecter</a></p>
        </v-col>
      </b-card-text>

      <b-btn class="mt-5" variant="primary" block @click="login({ redirect: true, to: 'home' })">
        <v-icon class="mr-2">mdi-login</v-icon>
        {{ $t('Login') }}
      </b-btn>
    </template>

    <!-- <template #additional-actions>
      <div class="py-5 mt-4">
        <button class="btn btn-block btn-light">
          <v-icon class="mr-2">mdi-google</v-icon>
          Google
        </button>
        <button class="btn btn-block btn-light">
          <v-icon class="mr-2">mdi-facebook</v-icon>
          Facebook
        </button>
      </div>
    </template> -->
  </base-auth>
</template>

<script>
import loginMixin from '@/mixins/login_mixin'

import AuthFields from '@/components/auth/AuthFields.vue'
import BaseAuth from '@/layouts/BaseAuth.vue'

export default {
  name: 'LoginView',
   title() {
    return this.$t('Login')
  },
  mixins: [loginMixin],
  components: { BaseAuth, AuthFields }
}
</script>
