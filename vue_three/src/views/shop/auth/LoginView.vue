<template>
  <base-intro-vue height="100vh" image="/hero4.jpg">
    <template #default>
      <div class="card">
        <div class="card-body">
          <auth-fields-vue :login-fields="loginFields" :show-login-fields="true" @update-fields="updateFields" />

          <button type="button" class="btn btn-lg btn-primary mt-2" @click="login">
            Login
          </button>
        </div>
      </div>
    </template>
  </base-intro-vue>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthentication } from '../../../store/authentication'
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
    const router = useRouter()
    const store = useAuthentication()
    const { login, loginFields, updateFields } = useAuthenicationComposable()
    store.$onAction(({ name, store, after }) => {
      after(() => {
        if (name === 'loginUser') {
          if (store.isAuthenticated) {
            router.push({ name: 'shop_view', params: { lang: 'fr' } })
          }
        }
      })
    })
    return {
      login,
      loginFields,
      updateFields
    }
  }
}
</script>
