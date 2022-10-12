<template>
  <!-- bottom-0 end-0 -->
  <div class="toast-container position-fixed top-0 end-0 p-3">
    <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <!-- <img src="" class="rounded me-2" alt="..."> -->
        <strong class="me-auto">Bootstrap</strong>
        <small>11 mins ago</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <!-- :class="[darkMode ? 'bg-dark': null]" -->
      <div class="toast-body">
        Hello, world! This is a toast message.
      </div>
    </div>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseToast',
  props: {
    show: {
      type: Boolean
    }
  },
  emits: {
    close () {
      return true
    }
  },
  setup () {
    const darkMode = inject('darkMode')
    return {
      darkMode
    }
  },
  data () {
    return {
      toasts: [],
      modelValue: false
    }
  },
  computed: {
    state: {
      get () {
        return this.modelValue || this.show
      },
      set (value) {
        setTimeout(() => {
          this.modelValue = false
          return this.$emit('close', value)
        }, 3000);
      }
    }
  }
  // watch: {
  //   show (current) {
  //     if (current) {
  //       this.modelValue = true
  //       this.toasts.push(1)
  //       setTimeout(() => {
  //         this.modelValue = false
  //       }, 3000);
  //     }
  //   }
  // },
}
</script>



<style scoped>
.toast-container {
  z-index: 1000;
}
</style>
