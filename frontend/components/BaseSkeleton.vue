<template>
  <div id="loader">
    <div v-if="loading" ref="skeletonEl" :style="{ '--min-height': height }" class="card-skeleton" />
    <slot v-else />
  </div>
</template>

<script lang="ts" setup>
const props = defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  height: {
    type: String,
    default: '100px'
  },
  width: {
    type: String,
    default: null
  },
  borderRadius: {
    type: Boolean
  }
})

const skeletonEl = ref<HTMLElement>()

function implementStyle() {
  if (skeletonEl.value) {
    skeletonEl.value.style.height = props.height
  
    if (props.width) {
      skeletonEl.value.style.width = props.width
    }
  
    if (props.borderRadius) {
      skeletonEl.value.style.borderRadius = '0.5rem'
    }
  }
}

onMounted(implementStyle)
onUpdated(implementStyle)
</script>

<style lang="scss" scoped>
$background_color: rgba(248, 249, 250, 1);

.card-skeleton {
  background: $background_color;
  color: $background_color;
  position: relative;
  overflow: hidden;
  min-height: var(--min-height, 20px);
  width: 100%;

  &::after {
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
