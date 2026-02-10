<template>
  <volt-button :variant="buttonStyle === 'button' ? 'outlined' : 'text'" :id="createElementId('action-size', size.name)" :class="theme" size="small" @click="selectSize(size)">
    <icon v-if="!size.availability" name="i-lucide:clock-fading" class="text-warning-500 me-2" />
    {{ size.name }}
  </volt-button>
</template>

<script lang="ts" setup>
import type { BaseSizeSet, Undefineable } from '~/types';

const { size, selectedSize, selectable = true, customClass, buttonStyle = 'button' } = defineProps<{
  size: BaseSizeSet,
  selectedSize: Undefineable<BaseSizeSet>,
  selectable?: boolean,
  customClass?: string,
  buttonStyle?: 'button' | 'link'
}>()

const emit = defineEmits<{ 'select-size': [size: BaseSizeSet] }>()

/**
 * Theme
 */

const isSelected = computed(() => isDefined(selectedSize) ? size.name === selectedSize.name : false)

const theme = computed(() => {
  return [
    {
      'rounded-full border': buttonStyle === 'button',
      'bg-gray-200 hover:bg-gray-300': isSelected.value && buttonStyle === 'button',
      'underline': isSelected.value && buttonStyle === 'link'
    },
    customClass
  ]
})

/**
 * Analytics
 */

const { selectProdcutSize } = useGoogleAnalyticsCallbacks()

async function selectSize(size: BaseSizeSet) {
  emit('select-size', size)
  await selectProdcutSize(size)
}
</script>
