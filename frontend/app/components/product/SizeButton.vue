<template>
  <volt-button :variant="buttonStyle === 'button' ? 'outlined' : 'text'" :class="buttonClass" size="small" @click="() => emit('select-size', size)">
    <icon v-if="!size.availability" name="i-lucide:clock-fading" class="text-warning-500 me-2" />
    {{ size.name }}
  </volt-button>
</template>

<script lang="ts" setup>
import type { BaseSizeSet, ClotheSizes, ProductNode } from '~/types';

const { size, selectedSize, selectable = true, customClass, buttonStyle = 'button' } = defineProps<{
  size: BaseSizeSet,
  selectedSize: ClotheSizes,
  selectable?: boolean,
  customClass?: string,
  buttonStyle?: 'button' | 'link'
}>()

const emit = defineEmits<{ 'select-size': [size: BaseSizeSet] }>()

const isSelected = computed(() => size.name === selectedSize)

const buttonClass = computed(() => {
  return [
    {
      'rounded-full border': buttonStyle === 'button',
      'bg-gray-200 hover:bg-gray-300': isSelected.value && buttonStyle === 'button',
      'underline': isSelected.value && buttonStyle === 'link'
    },
    customClass
  ]
})
</script>
