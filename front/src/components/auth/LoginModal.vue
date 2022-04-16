<template>
  <b-modal id="login-modal" v-model="loginModal" :title="$t('Login')" centered>
    <v-container>
      <v-row>
        <!-- Login -->
        <v-col v-if="showLoginFields" cols="12">
          <b-form-input v-for="field in loginFields" :key="field.key" v-model="loginCredentials[field.key]" :type="field.key" :placeholder="field.name"  :autocomplete="getAutocomplete(true, field)" class="my-2"></b-form-input>          
        </v-col>

        <!-- <input autocomplete="pager"> -->

        <!-- Signup -->
        <v-col v-else cols="12">
          <b-form-input v-for="field in signupFields" :key="field.key" v-model="signupCredentials[field.key]" :type="checkFieldType(field)" :placeholder="field.name" :autocomplete="getAutocomplete(false, field)" class="my-2"></b-form-input>          
        </v-col>

        <v-checkbox v-model="rememberMe" :label="$t('Remember me')"></v-checkbox>

        <v-col v-if="showLoginFields" cols="12">
          Don't have an account ? <v-btn @click="showLoginFields=false">Signup</v-btn>
        </v-col>

        <v-col v-else cols="12">
          Already have an account ? <v-btn @click="showLoginFields=true">Login</v-btn>
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
import loginMixin from '@/mixins/login'

export default {
  name: 'LoginModal',
  props: {
      callback: {
          type: Function,
          required: false
      }
  },
  mixins: [loginMixin],
  computed: {
    loginModal: {
      get() { return this.$store.state.authenticationModule.loginModal },
      set() { this.$store.commit('authenticationModule/loginUser') }
    }
  }
}
</script>
