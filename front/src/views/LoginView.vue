<template>
  <!-- TODO: Create a base template from where Login, Signup etc. can derive from -->
  <section id="login" class="space">
    <v-container>
      <v-row>
        <v-col cols="4" class="offset-md-4">
          <b-card :title="$t('Login')">
            <b-card-text>
              <auth-fields :show-login-fields="showLoginFields" :login-fields="loginFields" :signup-fields="signupFields" @login-credentials="updateLoginFields" @signup-credentials="updateSignupFields" />
            </b-card-text>

            <b-btn v-if="showLoginFields" class="mt-5" variant="primary" block @click="doLogin">
              <v-icon class="mr-2">mdi-login</v-icon>
              {{ $t('Login') }}
            </b-btn>

            <b-btn v-else class="mt-5" variant="primary" block @click="() => {}">
              <v-icon class="mr-2">mdi-login</v-icon>
              {{ $t('Signup') }}
            </b-btn>
          </b-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script>
import AuthFields from '../components/auth/AuthFields.vue'
import loginMixin from '@/components/auth/login_mixin'

export default {
  name: 'LoginView',

  title: () => 'Login',
  
  components: {
    AuthFields
  },
  
  mixins: [ loginMixin ],
  
  methods: {
    updateLoginFields(params) {
      this.loginCredentials = Object.assign({}, this.loginCredentials, params)
    },

    updateSignupFields(params) {
      this.signupCredentials = Object.assign({}, this.loginCredentials, params)
    },

    doLogin() {
      this.login().then((response) => {
          var data = response.data

          this.$store.commit('authenticationModule/setUserProfile', data)

          this.$session.set('auth', data)
          this.$session.set('rememberMe', this.rememberMe)
          
          this.$router.push({ name: 'home', params: { lang: this.$i18n.locale } })
      })
      .catch((error) => {
          console.log(error)
      })
    }
  }
}
</script>

<style scoped>
section {
  min-height: 100vh;
}
</style>
