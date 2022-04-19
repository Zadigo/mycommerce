<template>
  <base-modal :show="loginModal" :centered="true" id="login" @modal-close="loginModal=false">
    <template>
      <v-container>
        <v-row>
          <auth-fields :show-login-fields="showLoginFields" :login-fields="loginFields" :signup-fields="signupFields" @login-credentials="updateLoginFields" @signup-credentials="updateSignupFields" />

          <v-checkbox v-model="rememberMe" :label="$t('Remember me')"></v-checkbox>

          <additional-links :show-login-fields="showLoginFields" @show-login-fields="showLoginFields=true" @show-signup-fields="showLoginFields=false" />
        </v-row>
      </v-container>
    </template>

    <template #modal-footer>
      <div class="w-100 text-right">
        <button v-if="showLoginFields" class="btn btn-primary" @click="login">
          {{ $t('Login') }}
        </button>

        <button v-else class="btn btn-primary" @click="signup">
          {{ $t('Signup') }}
        </button>
      </div>
    </template>
  </base-modal>
</template>

<script>
import AdditionalLinks from '@/components/auth/AdditionalLinks.vue'
import AuthFields from '@/components/auth/AuthFields.vue'
import BaseModal from '@/layouts/BaseModal.vue'
import loginMixin from '@/mixins/login'

export default {
  name: 'LoginModal',
  components: { AdditionalLinks, AuthFields, BaseModal },
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
