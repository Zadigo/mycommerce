<template>
  <div class="card-reveal">
    <transition name="slide">
      <div v-show="reveal" class="reveal">
        <div class="row">
          <div class="col-12 mb-2">
            <button type="button" class="btn-close me-auto" @click="reveal=false"></button>
          </div>
        </div>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
import { inject } from 'vue'

export default {
  name: 'BaseCardReveal',
  setup (props, { slots }) {
    const darkMode = inject('darkMode')
    const cardHeight = 0
    const hasReveal = !!slots.reveal
    return {
      cardHeight,
      darkMode,
      hasReveal
    }
  },
  data () {
    return {
      reveal: false
    }
  },
  computed: {
    
  },
  mounted () {
    this.cardHeight = this.$refs.link.offsetHeight
  }
}
</script>
