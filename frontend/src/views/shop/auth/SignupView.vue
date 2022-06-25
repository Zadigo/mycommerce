<template>
  <base-intro-vue height="100vh" image="/hero4.jpg">
    <template #default>
      <div class="card">
        <div class="card-body">
          <auth-fields-vue :signup-fields="signupFields" @update-fields="updateFields" />

          <navigation-links-vue :is-login="false" />

          <button type="button" class="btn btn-lg btn-primary mt-2" @click="doSignup">
            Signup
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
