<template>
  <!-- Backdrop -->
  <div v-if="show" :class="{ 'pointer-events-none': !show }" class="fixed inset-0 bg-black/50 z-40 transition-opacity" @click="show=false" />
  
  <!-- Offcanvas -->
  <div :class="offCanvasClasses" class="fixed inset-y-0 w-10/12 bg-white z-50 shadow-lg transform transition-transform duration-300">
    <div class="flex justify-between items-center p-4 border-b border-gray-100">
      <h5 class="text-lg font-semibold">
        Offcanvas
      </h5>

      <button type="button" class="text-gray-500 rounded-full p-1 w-8 h-8 hover:bg-gray-100 focus:outline-none" @click="show=false">
        <Icon name="fa:close" size="11" />
      </button>
    </div>

    <!-- Offcanvas Body -->
    <div class="p-4 font-light">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

type Position = 'right' | 'left'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  position: {
    type: String as PropType<Position>,
    default: 'right'
  },
  width: {
    type: String,
    default: null
  }
})

const emit = defineEmits({
  'update:modelValue'(_value: boolean) {
    return true
  }
})

const show = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  }
})

const offCanvasClasses = computed(() => {  
  return [
    props.width ? `md:w-[${props.width}]` : 'md:w-72',
    {
      'left-0': props.position === 'left',
      'right-0': props.position === 'right'
    },
    {
      'translate-x-0': show.value, 
      '-translate-x-full': !show.value && props.position === 'left',
      'translate-x-full': !show.value && props.position === 'right',
    }
  ]
})
</script>
