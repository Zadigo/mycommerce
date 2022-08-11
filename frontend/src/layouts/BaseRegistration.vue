<template>
  <section id="registration">
    <base-intro-vue :image="require('@/assets/hero4.jpg')" height="100vh">
      <template #default>
        <div class="card">
          <div class="card-header">
            <h4 class="fw-bold m-0">
              <span v-if="$route.name==='login_view'">Login</span>
              <span v-else-if="$route.name==='signup_view'">Signup</span>
              <span v-else-if="$route.name==='forgot_password_view'">Reset password</span>
            </h4>
          </div>
          <!-- <router-view name="content" @submitted="submitted" /> -->
          <router-view name="content" />
        </div>
      </template>
    </base-intro-vue>
  </section>
</template>

<script>
import BaseIntroVue from './BaseIntro.vue'

export default {
  name: 'BaseRegistration',
  components: {
    BaseIntroVue
  },
  methods: {
    submitted () {
    }
  }
}
</script>
