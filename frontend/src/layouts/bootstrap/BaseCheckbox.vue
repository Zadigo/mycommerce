<template>
  <div :class="[isSwitch ? 'form-switch' : 'form-check', inline ? 'form-check-inline' : null]">
    <input :id="id" v-model="value" :class="inputClasses" :checked="value" :type="checkboxType" :role="[ isSwitch ? 'switch' : null]" :name="name" class="form-check-input">
    <label :for="id" class="form-check-label">{{ label }}</label>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseCheckbox',
  props: {
    id: {
      type: String,
      required: true
    },
    // bigger: {
    //   type: Boolean
    // },
    inline: {
      type: Boolean
    },
    isSwitch: {
      type: Boolean,
      default: false
    },
    isRadio: {
      type: Boolean,
      default: false
    },
    initial: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      required: true
    },
    name: {
      type: String
    }
  },
  emits: {
    'update:initial' () {
      return true
    }
  },
  setup () {
    const darkMode = inject('darkMode', () => false)
    return {
      darkMode
    }
  },
  computed: {
    value: {
      get () {
        return this.initial
      },
      set (value) {
        this.$emit('update:initial', value)
      }
    },
    inputClasses () {
      return [
        // {
        //   'fs-input-bigger': this.bigger && !this.isSwitch,
        // },
        this.darkMode ? 'dark' : null
      ]
    },
    checkboxType () {
      if (this.isSwitch && this.isRadio) {
        return 'checkbox'
      } else if (this.isSwitch) {
        return 'checkbox'
      } else if (this.isRadio) {
        return 'radio'
      } else {
        return 'checkbox'
      }
    }
  },
  mounted () {
    if (this.initial) {
      this.value = true
    }
  }
}
</script>

<style scoped>
.form-check-input.fs-input-bigger {
  font-size: 1.375em;
}
</style>
