<template>
  <base-intro-vue height="100vh" image="/hero4.jpg">
    <template #default>
      <div class="card">
        <div class="card-body">
          <auth-fields-vue :login-fields="signupFields" :show-login-fields="false" @update-fields="updateFields" />

          <button type="button" class="btn btn-lg btn-primary mt-2" @click="doSignup">
            Signup
          </button>
        </div>
      </div>
    </template>
  </base-intro-vue>
</template>

<script>
import useAuthenicationComposable from '../../../composables/login'
// import AdditionalLinks from '@/components/auth/AdditionalLinks.vue'
import AuthFieldsVue from '@/components/shop/auth/AuthFields.vue'

export default {
  name: 'LoginView',
  components: {
  //   AdditionalLinks,
    AuthFieldsVue
  },
  setup () {
    const { signup, signupFields, updateFields } = useAuthenicationComposable()
    return {
      login,
      signupFields,
      updateFields
    }
  },
  methods: {
    doSignup () {
      this.signup()
      this.$router.push({ name: 'shop_view', params: { lang: 'fr' } })
    }
  }
}
</script>
