<template>
  <form>
    <v-col v-if="showLoginFields" cols="12">
      <input v-for="field in loginFields" :key="field.key" :type="field.key" :placeholder="$t(field.name)" :aria-label="$t(field.name)" class="form-control my-2" @keyup="updateLoginFields($event, field)" />          
    </v-col>

    <v-col v-else cols="12">
      <input v-for="field in signupFields" :key="field.key" :type="checkFieldType(field)" :placeholder="$t(field.name)" :aria-label="$t(field.name)" class="form-control my-2" @keyup="updateSignupFields($event, field)" />          
    </v-col>
  </form>
</template>

<script>
export default {
  name: 'AuthFields',
  props: {
    showLoginFields: {
      default: true
    },
    loginFields: {
      type: Array,
      required: true
    },
    signupFields: {
      type: Array,
      required: true
    }
  },
  methods: {
    checkFieldType(name) {
      var specialFields = ['password', 'email']

      if (name == 'password1' || name == 'password2') {
          return 'password'
      }

      if (!specialFields.includes(name)) {
          return 'text'
      }

      return name
    },

    updateLoginFields(e, field) {
      this.$emit('login-credentials', { [`${field.key}`]: e.target.value })
    },

    updateSignupFields(e, field) {
      this.$emit('signup-credentials', { [`${field.key}`]: e.target.value })
    }
  }
}
</script>
