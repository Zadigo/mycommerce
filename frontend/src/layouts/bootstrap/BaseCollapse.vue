<template>
  <div ref="link" class="collapse-wrapper">
    <a :aria-expanded="show" :aria-controls="id" class="btn btn-primary" href role="button" @click.prevent="handleCollapse">
      {{ buttonName }}
    </a>

    <transition name="slide" mode="out-in">
      <div v-if="show" :id="id" :class="[show ? 'show' : null]" class="collapse mt-1">
        <slot :dark-mode="darkMode"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { inject, ref } from 'vue'

export default {
  name: 'BaseCollapse',
  props: {
    id: {
      type: String,
      required: true
    },
    buttonName: {
      type: String
    }
  },
  emits: {
    'collapse:update' () {
      return true
    }
  },
  setup () {
    const show = ref(false)
    const darkMode = inject('darkMode', false)
    const collapseElement = null
    return {
      darkMode,
      show,
      collapseElement
    }
  },
  mounted () {
    this.collapseElement = this.$refs.link.querySelector('.collapse')
  },
  methods: {
    handleCollapse () {
      this.show = !this.show
      this.$emit('collapse:update', this.show)
    }
  }
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all .15s ease;
}
.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  /* transform: scale(.9, .9); */
  transform: translateY(-10%);
}
.slide-enter-to,
.slide-leave-from {
  opacity: 1;
  /* transform: scale(1, 1); */
  transform: translateY(0%);
}
</style>
