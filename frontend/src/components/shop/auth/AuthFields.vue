<template>
  <form @submit.prevent>
    <div v-if="showLoginFields" class="col-12">
      <input v-for="field in loginFields" :key="field.key" :type="field.type" :autocomplete="field.autocomplete" :placeholder="$t(field.name)" :aria-label="$t(field.name)" class="form-control my-2 p-2" @keyup="updateLoginFields($event, field)" />
    </div>

    <div v-else class="col-12">
      <input v-for="field in signupFields" :key="field.key" :type="field.type" :placeholder="$t(field.name)" :aria-label="$t(field.name)" class="form-control my-2 p-2" @keyup="updateSignupFields($event, field)" />
    </div>
  </form>
</template>

<script>
export default {
  name: 'AuthFields',
  props: {
    showLoginFields: {
      type: Boolean
    },
    loginFields: {
      type: Array,
      default: () => []
    },
    signupFields: {
      type: Array,
      default: () => []
    }
  },
  emits: {
    'update-fields': () => true
  },
  methods: {
    updateLoginFields (e, field) {
      this.$emit('update-fields', ['login', { [`${field.key}`]: e.target.value }])
    },

    updateSignupFields (e, field) {
      this.$emit('update-fields', ['signup', { [`${field.key}`]: e.target.value }])
    }
  }
}
</script>
