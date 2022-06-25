<template>
  <div class="row">
    <div class="col-12 my-3">
      <p v-if="isLogin" class="m-0">
        Don't have an account ? <router-link :to="{ name: 'signup_view', params: { lang: $i18n.locale } }" class="btn-link">Signup</router-link>
      </p>

      <p v-else class="my-2">
        Already have an account ? <router-link :to="{ name: 'login_view', params: { lang: $i18n.locale } }" class="btn-link">Login</router-link>
      </p>

      <p class="m-0">
        Forgot your password ? <router-link :to="{ name: 'login_view', params: { lang: $i18n.locale } }" class="btn-link">Get a new one</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NavigationLinks',
  emits: ['signup-fields', 'login-fields'],
  props: {
    isLogin: {
      type: Boolean
    }
  }
}
</script>
