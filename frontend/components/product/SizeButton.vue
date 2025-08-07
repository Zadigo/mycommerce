<template>
  <TailButton v-if="size.availability" variant="light" :class="buttonClass" @click="handleSizeSelection(size)">
    <font-awesome v-if="!size.availability" icon="clock-rotate-left" class="text-warning me-2" />
    {{ size.name }}
  </TailButton>
</template>

<script lang="ts" setup>
import type { ProductSizes } from '~/types'
import type { DefaultClotheSize } from '~/data'

const emit = defineEmits({
  'select-size' (_size: DefaultClotheSize) {
    return true
  }
})

const props = defineProps<{
  size: ProductSizes,
  selectedSize: DefaultClotheSize,
  selectable?: boolean,
  customClass?: string
}>()

const isSelected = computed(() => {
  return props.size.name === props.selectedSize
})

const buttonClass = computed(() => {
  return [
    'rounded-full border',
    props.customClass,
    { 
      '': !isSelected.value,
      'bg-primary': isSelected.value && props.selectable
    }
  ]
})

/**
 * 
 */
function handleSizeSelection (size: ProductSizes) {
  emit('select-size', size.name)
}
</script>
