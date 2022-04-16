<template>
  <form>
    <v-col v-if="showLoginFields" cols="12">
      <b-form-input v-for="field in loginFields" :key="field.key" :type="field.key" :placeholder="field.name" class="my-2" @update="updateLoginFields($event, field)"></b-form-input>          
    </v-col>

    <v-col v-else cols="12">
      <b-form-input v-for="field in signupFields" :key="field.key" :type="checkFieldType(field)" :placeholder="field.name" class="my-2" @update="updateSignupFields($event, field)"></b-form-input>          
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
      this.$emit('login-credentials', { [`${field.key}`]: e })
    },

    updateSignupFields(e, field) {
      this.$emit('signup-credentials', { [`${field.key}`]: e })
    }
  }
}
</script>
