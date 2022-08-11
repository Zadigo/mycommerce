<template>
  <div class="row">
    <div class="col-12 my-2">
      <p v-if="$route.name === 'login_view'" class="my-1">Don't have an account? <router-link :to="{ name: 'signup_view' }">Create one</router-link>
      </p>
      <p v-if="$route.name === 'signup_view'" class="my-1">Already have an account? <router-link :to="{ name: 'login_view' }">Signin</router-link>
      </p>
      <p v-if="$route.name === 'login_view'" class="my-1">Forgot your password? <router-link :to="{ name: 'forgot_passoword_view' }">Reset password</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword'
}
</script>
