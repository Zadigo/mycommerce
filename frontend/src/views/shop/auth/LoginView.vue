<!-- <template>
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
</script> -->

<template>
  <div class="card-body">
    <div class="row">
      <div class="col-12">
        <form @submit.prevent>
          <input v-model="loginCredentials.email" type="email" placeholder="Email" autocomplete="email" class="form-control p-2 my-2">
          <input v-model="loginCredentials.password" type="password" placeholder="Password" autocomplete="current-password" class="form-control p-2 my-2">
        </form>
      </div>

      <!-- <div class="col-12">
        <auth-navigation-vue />
      </div> -->
    </div>
  </div>

  <div class="card-footer">
    <button type="button" class="btn btn-primary" @click="completeLogin">
      Login
    </button>
  </div>
</template>

<script>
import useAuthenticationComposable from '@/composables/authentication'
// import AuthNavigationVue from './AuthNavigation.vue'

import { useAuthentication } from '@/store/authentication'
// import { useRouter } from 'vue-router'

export default {
  name: 'LoginView',
  // components: {
  //   AuthNavigationVue
  // },
  emits: {
      submitted: () => true
  },
  setup() {
    const store = useAuthentication()
    const { loginCredentials, performLogin } = useAuthenticationComposable()
    // const router = useRouter()

    // store.$onAction(({ name, store, after }) => {
    //   after(() => {
    //     if (name === 'loginUser') {
    //       if (store.isAuthenticated) {
    //         router.push({ name: 'shop_view', params: { lang: 'fr' } })
    //       }
    //     }
    //   })
    // })

    return {
      store,
      loginCredentials,
      performLogin
    }
  },
  methods: {
    completeLogin () {
      this.performLogin((response) => {
        this.store.loginUser(response.data)
        this.$session.create('auth', response.data)
        // store.session.create('RememberMe', rememberMe.value)
        this.$router.push({ name: 'shop_view', params: { lang: 'fr' } })
      }, (error) => {
        console.error(error)
      })
    }
  }
}
</script>
