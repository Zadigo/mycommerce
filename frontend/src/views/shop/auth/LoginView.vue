<template>
  <base-intro-vue :image="require('@/assets/hero4.jpg')" height="100vh">
    <template #default>
      <div class="card">
        <div class="card-body">
          <auth-fields-vue :login-fields="loginFields" :show-login-fields="true" @update-fields="updateFields" />

          <navigation-links-vue :is-login="true" />

          <button type="button" class="btn btn-lg btn-primary mt-2" @click="login">
            <font-awesome-icon icon="fa-solid fa-right-to-bracket" class="me-2" />
            {{ $t('Login') }}
          </button>
        </div>
      </div>
    </template>
  </base-intro-vue>
</template>

<script>
import { useRouter } from 'vue-router'
import { useAuthentication } from '../../../store/authentication'

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
