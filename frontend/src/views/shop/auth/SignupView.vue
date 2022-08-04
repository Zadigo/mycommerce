<template>
  <base-intro-vue :image="require('@/assets/hero4.jpg')" height="100vh">
    <template #default>
      <div class="card">
        <div class="card-body">
          <h4 class="fw-bold mb-2">{{ $t('Register with') }}...</h4>

          <div class="mb-1">
            <button type="button" class="btn btn-block btn-primary">
              <font-awesome-icon icon="fa-brands fa-google" size="2x" />
            </button>

            <button type="button" class="btn btn-block btn-primary">
              <font-awesome-icon icon="fa-brands fa-facebook" size="2x" />
            </button>
          </div>

          <h4 class="fw-bold my-3">{{ $t('Or register with') }}</h4>

          <auth-fields-vue :signup-fields="signupFields" @update-fields="updateFields" />

          <navigation-links-vue :is-login="false" />

          <button type="button" class="btn btn-lg btn-primary mt-2" @click="doSignup">
            <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="me-2" />
            {{ $t('Signup') }}
          </button>
        </div>
      </div>
    </template>
  </base-intro-vue>
</template>

<script>

import AuthFieldsVue from '@/components/shop/auth/AuthFields.vue'
import NavigationLinksVue from '@/components/shop/auth/NavigationLinks.vue'

import useAuthenicationComposable from '../../../composables/login'

export default {
  name: 'LoginView',
  components: {
    AuthFieldsVue,
    NavigationLinksVue
  },
  setup () {
    const { signup, signupFields, updateFields } = useAuthenicationComposable()
    return {
      signup,
      signupFields,
      updateFields
    }
  },
  methods: {
    doSignup () {
      this.signup()
      this.$router.push({ name: 'login_view', params: { lang: 'fr' } })
    }
  }
}
</script>
