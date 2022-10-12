<template>
  <select v-model="value" class="form-select" aria-label="Default select example">
    <option v-for="(item, i) in items" :key="i">
      {{ item }}
    </option>
  </select>
</template>

<script>
export default {
  name: 'BaseSelect',
  props: {
    items: {
      type: Array
    }
  },
  emits: {
    'update:value' () {
      return true
    }
  },
  data () {
    return {
      modelValue: null
    }
  },
  computed: {
    value: {
      get () {
        return this.modelValue
      },
      set (value) {
        this.modelValue = value
        return this.$emit('update:value', value)
      }
    }
  },
  beforeMount () {
    this.modelValue = this.items[0]
  }
}
</script>

<style scoped>
.form-select option {
  min-height: 3em;
  padding: .5rem 1rem;
}
</style>
