<template>
  <!-- v-bind="$attrs" -->
  <input :id="id" v-model="value" :type="inputType" :name="id" :class="[darkMode ? 'bg-transparent text-light' : null]" class="form-control">
  <!-- <div class="input-container">
    <label v-if="label" :for="id" class="text-muted">{{ label }}</label>
  </div> -->
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseInput',
  // inheritsAttrs: false,
  props: {
    id: {
      type: String,
      required: true
    },
    inputType: {
      type: String,
      default: 'text'
    },
    initial: {
      type: String,
    },
    // label: {
    //   type: String
    // }
  },
  emits: {
    'update:initial'() {
      return true
    }
  },
  setup () {
    const darkMode =  inject('darkMode', false)
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
    }
  }
}
</script>

<style scoped>
/* padding-top: calc(10px + 16px); */
.form-control {
  padding-inline-start: 16px;
  padding-inline-end: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
}
/* label {
  display: none;
} */
/* .f.show {
  display: block;
  animation: slide .4s ease-in-out;
}
.f {
  animation: inverse-slide .4s ease-in-out;
}

@keyframes slide {
  0% {
    opacity: 0;
    transform: translateY(-10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0px);
  }
}

@keyframes inverse-slide {
  0% {
    opacity: 1;
    transform: translateY(0px);
  }
  
  100% {
    opacity: 0;
    transform: translateY(-10px);
  }
} */
</style>
