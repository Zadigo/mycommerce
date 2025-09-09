<template>
  <TailButton v-if="size.availability" variant="light" :class="buttonClass" @click="() => emit('select-size', size.name)">
    <icon v-if="!size.availability" name="i-fa7-clock-rotate-left" class="text-warning me-2" />
    {{ size.name }}
  </TailButton>
</template>

<script lang="ts" setup>
import type { DefaultClotheSize, ProductSizes } from '~/types'

const props = defineProps<{
  size: ProductSizes,
  selectedSize: DefaultClotheSize,
  selectable?: boolean,
  customClass?: string
}>()

const emit = defineEmits<{ 'select-size': [size: DefaultClotheSize] }>()

const isSelected = computed(() => props.size.name === props.selectedSize)

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
</script>
