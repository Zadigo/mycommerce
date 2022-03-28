<template>
  <base-auth>
    <template v-slot-scoped="{ showLoginFields, loginFields, signupFields }">
      <b-card-text>
        <auth-fields :show-login-fields="showLoginFields" :login-fields="loginFields" :signup-fields="signupFields" @login-credentials="updateLoginFields" @signup-credentials="updateSignupFields" />
      </b-card-text>

      <b-btn v-if="showLoginFields" class="mt-5" variant="primary" block @click="login({ redirect: true, to: 'home' })">
        <v-icon class="mr-2">mdi-login</v-icon>
        {{ $t('Login') }}
      </b-btn>

      <b-btn v-else class="mt-5" variant="primary" block @click="signup">
        <v-icon class="mr-2">mdi-login</v-icon>
        {{ $t('Signup') }}
      </b-btn>
    </template>
  </base-auth>
</template>

<script>
import AuthFields from '../../components/auth/AuthFields.vue'
import BaseAuth from './BaseAuth.vue'

import loginMixin from '../../mixins/login_mixin'

export default {
  name: 'LoginView',
   title() {
    return this.$t('Login')
  },
  mixins: [loginMixin],
  components: { BaseAuth, AuthFields },

}
</script>
