<template>
  <b-modal v-model="loginModal" id="login-modal" title="Login" centered>
    <v-container>
      <v-row>
        <!-- Login -->
        <v-col v-if="showLoginFields" cols="12">
          <b-form-input v-for="field in loginFields" :key="field" v-model="loginCredentials[field]" :type="field" :placeholder="field" class="my-2"></b-form-input>          
        </v-col>

        <!-- Signup -->
        <v-col v-else cols="12">
          <b-form-input v-for="field in signupFields" :key="field" v-model="signupCredentials[field]" :type="checkFieldType(field)" :placeholder="field" class="my-2"></b-form-input>          
        </v-col>

        <v-checkbox v-model="rememberMe" :label="$t('Remember me')"></v-checkbox>

        <v-col v-if="showLoginFields" cols="12">
          Don't have an account ? <b-link @click="showLoginFields = !showLoginFields">Signup</b-link>
        </v-col>
        <v-col v-else cols="12">
          Already have an account ? <b-link @click="showLoginFields = !showLoginFields">Login</b-link>
        </v-col>
      </v-row>
    </v-container>

    <template #modal-footer>
      <div class="w-100 text-right">
        <b-btn v-if="showLoginFields" variant="primary" @click="login">
          {{ $t('Login') }}
        </b-btn>

        <b-btn v-else variant="primary" @click="signup">
          {{ $t('Signup') }}
        </b-btn>
      </div>
    </template>
  </b-modal>
</template>

<script>
import loginMixin from './login_mixin'

export default {
  name: 'LoginModal',

  mixins: [loginMixin],

  computed: {
    loginModal: {
      get() { return this.$store.state.authenticationModule.loginModal },
      set() { this.$store.commit('authenticationModule/loginUser') }
    }
  }

//   methods: {
//     async login() {
//       try {
//         var response = await this.login()
//         var data = response.data

//         this.$store.commit('authenticationModule/setUserProfile', data)
//         this.$session.set('auth', data)
//         this.$session.set('rememberMe', this.rememberMe)
//         this.$store.commit('authenticationModule/loginUser')
//       } catch(error) {
//         console.log(error)
//       }
//     }
//   }
}
</script>
