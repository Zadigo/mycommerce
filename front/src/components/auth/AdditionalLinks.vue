<template>
  <v-row>
    <v-col v-if="showLoginFields" cols="12">
      Don't have an account ? <v-btn @click="$emit('show-signup-fields')">Signup</v-btn>
    </v-col>

    <v-col v-else cols="12">
      Already have an account ? <v-btn @click="$emit('show-login-fields')">Login</v-btn>
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AdditionalLinks',
  props: {
    showLoginFields: {
      type: Boolean
    }
  }
}
</script>
