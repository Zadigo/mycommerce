<template>
  <div :class="cardClasses" class="card">
    <slot></slot>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseTemplateCard',
  props: {
    hoverable: {
      type: Boolean
    }
  },
  setup () {
    const darkMode = inject('darkMode', false)
    return {
      darkMode
    }
  },
  computed: {
    cardClasses () {
      return [
        this.darkMode ? 'bg-dark' : null,
        this.hoverable ? 'hoverable' : null
      ]
    },
  }
}
</script>

<style scoped>
.card.hoverable {
  transition: transform 0.1s ease-in-out;
}
.card.hoverable:hover {
  transform: translateY(-0.5rem) scale(1.0125);
  box-shadow: 0 .5rem 1rem rgba(0, 0, 0, .15) !important;
}
</style>
