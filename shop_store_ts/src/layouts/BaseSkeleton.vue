<template>
  <transition name="opacity">
    <div v-if="loading" ref="skeleton" class="card-skeleton" />
    <slot v-else />
  </transition>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'BaseSkeleton',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: null
    },
    width: {
      type: String,
      default: null
    },
    borderRadius: {
      type: Boolean
    }
  },
  setup () {
    const skeletonEl = ref<HTMLElement>()
    return {
      skeletonEl
    }
  },
  mounted () {
    if (this.$refs.skeleton) {
      if (this.width) {
        this.$refs.skeleton.style.width = `${this.width}`
      }
      
      if (this.height) {
        this.$refs.skeleton.style.height = `${this.height}`
      }

      if (this.borderRadius) {
        this.$refs.skeleton.style.borderRadius = '0.5rem'
      }
    }    
  }
})
</script>

<style scoped>
.card-skeleton {
  --bs-light-rgb: 248, 249, 250;

  background: rgb(var(--bs-light-rgb));
  color: rgb(var(--bs-light-rgb));
  position: relative;
  overflow: hidden;
  /* height: 208px; */
  min-height: 20px;
  width: 100%;
}

.card-skeleton::after {
  content: "";
  position: absolute;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  width: 50%;
  height: 100%;
  top: 0;
  left: 0;
  -webkit-animation: loading 1s infinite;
  animation: loading 1s infinite;
}

@-webkit-keyframes loading {
  0% {
    transform: skewX(-10deg) translateX(-100%);
  }

  100% {
    transform: skewX(-10deg) translateX(200%);
  }
}

@keyframes loading {
  0% {
    transform: skewX(-10deg) translateX(-100%);
  }

  100% {
    transform: skewX(-10deg) translateX(200%);
  }
}
</style>
