<template>
  <!-- TODO: Create a base template from where Login, Signup etc. can derive from -->
  <intro :image="require('@/assets/hero3.jpg')">
    <intro-mask :opacity="0.5">
      <intro-container>
        <v-container>
          <v-row>
            <v-col cols="4" class="offset-md-4">
              <b-card :title="$t('Login')">
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
              </b-card>
            </v-col>
          </v-row>
        </v-container>
      </intro-container>
    </intro-mask>
  </intro>
</template>

<script>
import AuthFields from '../components/auth/AuthFields.vue'
import loginMixin from '@/components/auth/login_mixin'

export default {
  name: 'LoginView',

  title() {
    return this.$t('Login')
  },
  
  components: {
    AuthFields
  },
  
  mixins: [loginMixin],
  
  methods: {
    updateLoginFields(params) {
      this.loginCredentials = Object.assign({}, this.loginCredentials, params)
    },

    updateSignupFields(params) {
      this.signupCredentials = Object.assign({}, this.loginCredentials, params)
    }
  }
}
</script>

<style scoped>
section {
  min-height: 100vh;
}
</style>
