<template>
  <button v-if="size.availability" type="button" :class="buttonClass" @click="handleSizeSelection(size)">
    <font-awesome v-if="!size.availability" icon="clock-rotate-left" class="text-warning me-2" />
    {{ size.name }}
  </button>
</template>

<script lang="ts" setup>
import type { ProductSizes } from '~/types';

const emit = defineEmits({
  'select-size' (_size: string | number) {
    return true
  }
})

const props = defineProps({
  size: {
    type: Object as PropType<ProductSizes>,
    required: true
  },
  selectedSize: {
    type: [String, Number],
    default: null
  },
  selectable: {
    type: Boolean,
    default: true
  },
  customClass: {
    type: String,
    default: ''
  }
})

const isSelected = computed(() => {
  return props.size.name === props.selectedSize
})

const buttonClass = computed(() => {
  return [
    'btn',
    'btn-rounded',
    props.customClass,
    { 
      'btn-outline-dark': !isSelected.value,
      'btn-secondary': isSelected.value && props.selectable
    }
  ]
})

function handleSizeSelection (size: ProductSizes) {
  emit('select-size', size.name)
}
</script>
