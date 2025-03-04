<template>
  <div :class="cardClasses" class="rounded-md relative">
    <!-- <div v-if="title" class="border-b-2 border-gray-50 p-3">
      <h3 class="text-xl font-semibold">
        {{ title }}
      </h3>
    </div> -->

    <slot name="header" />

    <slot name="image">
      <img v-if="src" :src="src" alt="" class="w-full rounded-tl-md rounded-tr-md">
    </slot>

    <slot>
      <div class="p-5 font-light">
        <h3 v-if="title" class="mb-1 text-xl font-semibold">
          {{ title }}
        </h3>
        <h5 v-if="subtitle" class="mb-3 text-gray-500">
          {{ subtitle }}
        </h5>
        <p>{{ text }}</p>
      </div>
    </slot>

    <div v-if="$slots.footer" class="border-t-2 border-gray-50 p-3">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: null
  },
  subtitle: {
    type: String,
    default: null
  },
  text: {
    type: String,
    default: null
  },
  src: {
    type: String,
    default: null
  },
  outlined: {
    type: Boolean
  },
  tonal: {
    type: Boolean
  }
})

const cardClasses = computed(() => {
  return [
    {
      'shadow-md shadow-gray-300': !props.tonal && !props.outlined,
      'border-2 border-black border-opacity-40': props.outlined,
      'bg-gray-100': props.tonal
    }
  ]
})
</script>
